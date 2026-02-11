# Learnings made while developing the project

## Issue 1 — Initial Planning

- The project has no build tooling yet. VSCode tasks (`Checks`, `Test`) referenced in
  the workflow prompts will only become available after Step 01 (Project Setup) is
  implemented. Planning-only issues can skip the validation step.
- The GitKraken MCP integration requires separate authentication via
  `vscode://eamodio.gitlens/link/integrations/connect?id=github&source=mcp`. As a
  fallback, issue content can be fetched via `fetch_webpage` from the GitHub issue URL.
- The `README.md` icon image path was `![](assets/icon.png)`, not `![](a)` as the
  read_file tool initially suggested — always verify exact file content before editing
  (e.g., via `cat -A`).
## Issue 23 — Prepare GitHub Codespaces

- Dev containers use the standard `.devcontainer/devcontainer.json` format defined by the
  [Dev Containers specification](https://containers.dev/).
- The `postCreateCommand` hook is ideal for running setup scripts after the container is
  created (e.g., `npm install`). This ensures dependencies are available in the environment.
- Port forwarding in dev containers requires explicit configuration via the `forwardPorts`
  array to expose development server ports (e.g., Vite on 5173) to the browser.
- Comprehensive documentation for Codespaces should include: setup instructions, development
  workflows, extension information, troubleshooting, and FAQs to reduce support burden.

## Issue 4 — Project Setup & Infrastructure

- Manual project scaffolding (creating files directly) is more reliable than using `npm create vite`
  when a directory contains non-source files that should be preserved (like documentation).
- Tailwind CSS v3 uses PostCSS with `@tailwind` directives, not `@import "tailwindcss"`. The
  latter causes PostCSS parse errors when combined with postcss-import. Always use the standard
  `@tailwind base/components/utilities` approach.
- ESLint configuration format changed significantly in v8.x to use flat config arrays instead
  of `.eslintrc.json`. The `typescript-eslint` package doesn't exist as a single package name
  — use individual packages: `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin`.
- When npm install encounters peer dependency conflicts, `--legacy-peer-deps` is a reasonable
  workaround for development setups, though it's better to resolve version conflicts by
  adjusting dependency versions to be compatible.
- React Router v6 generates warnings about future v7 flags (`v7_startTransition`,
  `v7_relativeSplatPath`), which are informational and can be safely ignored during development.
  These can be addressed when upgrading to React Router v7.
- Import paths in test files should be relative to the test file location, not adjusted with `../src/`.
  Using `../../src/App` from `tests/pages/App.test.tsx` correctly traverses to the source file.
- VSCode tasks defined in `.vscode/tasks.json` provide a better developer experience than shell
  commands for repeated workflows (dev, build, lint, test), enabling quick invocation and
  background process management.
- A clean project structure with separate `src/` and `tests/` directories mirroring each other
  makes it easy to scale as components and utilities are added. Empty directories are fine
  during the scaffold phase and can be populated in subsequent feature implementation steps.

## Issue 5 — Math Engine

- JavaScript produces `-0` for expressions like `-2 * a * 0` or `-0 / (2 * a)`. The
  `toEqual` matcher in Vitest distinguishes `-0` from `+0`, so conversion functions must
  normalise negative zero (e.g. `result === 0 ? 0 : result`) to avoid spurious test failures.
- Pure-function engine modules (`src/engine/`) with no React dependencies are straightforward
  to test with plain Vitest — no jsdom environment or React Testing Library required.
- Keeping types in `src/types/` with `readonly` fields enforces immutability at the type level
  and prevents accidental mutation of shared parameter objects.
- The `vitest` command runs in watch mode by default, which never exits. For CI and VSCode task
  usage the `test` script must use `vitest run` (single-run mode) so the process terminates
  after the suite completes.

## Issue 6 — Coordinate System & Parabola Rendering

- SVG coordinate space has an inverted y-axis (positive y points downward). The transformation
  formula `y_svg = height - ((y_math - yMin) / (yMax - yMin)) * height` handles this correctly.
- `React.memo` is useful for static sub-components (Grid, Axes) that rarely change, but the
  parabola curve re-renders on every parameter change and should not be memoised excessively.
- Test files nested three levels deep (e.g. `tests/components/graph/`) need `../../../src/`
  import paths, not `../../src/`. Always verify the relative depth when creating test files
  in new subdirectories.
- SVG `<clipPath>` is essential for clipping the parabola curve to the viewBox when the
  curve extends beyond the visible viewport (e.g. for large `|a|` values or extreme y-offsets).
- Using `data-testid` attributes on SVG groups and elements enables reliable React Testing
  Library queries on SVG content rendered in jsdom.

## Issue 7 — Interactive Parabola Explorer

- Range `<input type="range">` elements cannot be cleared with `user.clear()` in React Testing
  Library. Use `fireEvent.change(element, { target: { value: 'newValue' } })` instead for
  testing slider interactions.
- When a parameter value can cause errors in derived computations (like `a=0` in parabola
  functions), handle the degenerate case gracefully in hooks. Return safe fallback values
  (e.g., `{ a: 0, b: 0, c: 0 }`) instead of propagating errors that crash components.
- Conditional rendering based on parameter validity prevents runtime errors in child
  components. For `a=0`, hiding the coordinate system and displaying a placeholder message
  avoids errors in `computeZeros` and other parabola functions that expect `a ≠ 0`.
- `useMemo` is essential for expensive derived calculations (like `vertexToNormal`) to
  avoid recomputing on every render. Dependency arrays should include all values used in
  the computation.
- Custom hooks like `useParabola` provide clean separation of state management from UI
  components, making both easier to test independently. Hooks should return all necessary
  state, derived values, and setter functions for complete control.
- Responsive layouts with Tailwind's `flex-col lg:flex-row` pattern work well for adaptive
  designs that stack vertically on mobile and display side-by-side on larger screens.

## Issue 8 — Learning Module Framework

- Deterministic, seeded randomness in exercise generators makes tests stable while still
  producing varied content for the UI.
- Rendering fill-in-the-blank templates by parsing `{blankId}` placeholders keeps exercise
  steps declarative and avoids hardcoding input layouts.
- Text inputs with `inputMode="decimal"` allow negative numbers and decimals while
  still bringing up numeric keyboards on touch devices.

## Issue 9 — Module 1: Vertex Form to Normal Form

- When generating multi-step exercises with sign-dependent templates, always compute
  the sign character separately from the absolute value to avoid double negatives in
  the display (e.g., `f(x) = 2x² - 12x + 19` not `f(x) = 2x² + -12x + 19`).
- Display-only steps (no blanks) in a multi-step exercise are useful for pedagogical
  scaffolding — they show intermediate results so the student doesn't lose context.
  The `ExerciseContainer` handles steps with zero blanks gracefully.
- Special cases (`d=0`, `a=1`, `d=0 && e=0`) each need distinct step templates to
  avoid showing meaningless terms (like `0x`) or redundant blanks. It's better to
  branch in the exercise generator than to handle this in the UI.
- The existing `generateVertexToNormalExercise` uses a simple 2-step approach
  (compute b, compute c). Module 1's `generateModule1Exercise` provides a richer
  4-step pedagogical flow (binomial expansion, substitution, distribute a, combine)
  that is better suited for learning but coexists alongside the simpler generator.- **Edge case templates:** When a special case reduces the number of terms (like `a=1, e=0`
  where there are no binomial coefficients to fill in), the template string itself must be
  conditional, not just the ternary operator within it. Using `d !== 0 ? 'f(x) = x² ± 2dx + d²' : 'f(x) = x²'`
  avoids generating strings like `f(x) = x²  ` (extra spaces for empty branches).
- **Conditional explanation text:** Explanation text should match the template's logic.
  If the template omits the `2dx` term when `d=0`, the explanation must not reference
  "multiply by 2dx" either. Build explanations conditionally on the same parameters
  that control the template.
- **Test assumption failures:** Tests using deterministic seeds should not assume specific
  parameter values because the random generator might produce edge cases that violate
  assumptions. For example, a test using seed 42 might generate `d=0`, breaking a test
  that looks for `finalBabs` blank which only exists when `d ≠ 0`. Always guard test
  assertions with conditional checks: `if (params.d !== 0) { expect(finalBabs) ... }`.
- **Component callbacks for parent tracking:** When a parent component likes `Module1Page`
  needs to track progress (solved exercise count), add an optional callback prop to the
  child component (`ExerciseContainer`). Call it at the right lifecycle moment (after the
  final step is completed) to trigger state updates in the parent.

## Issue 10 — Module 2: Normal Form to Vertex Form

- **Two-path exercise architecture:** When an exercise has fundamentally different step counts
  based on a parameter (like completing the square with `a=1` vs `a≠1`), branch at the top
  level with `if (a === 1) { ... 6 steps ... } else { ... 7 steps ... }` rather than trying to
  conditionally render individual steps. This keeps each path clean and testable.
- **Handling b=0 edge case:** While completing the square normally requires adding and subtracting
  `(b/(2a))²`, when `b=0` the completing term is 0 and the process trivializes. Generate exercises
  that avoid `b=0` entirely (check and reassign if zero) rather than adding special-case rendering
  logic—it's simpler to just exclude the edge case than to handle it in the UI.
- **Tolerance for fractional answers:** Steps involving `b/2`, `b/(2a)`, or their squares produce
  fractional results (e.g., `1/3`). Use `tolerance: 0.001` on blanks for these values to allow
  students to round to reasonable decimal places without failing. Test assertions also need
  `toBeCloseTo(expected, 2)` rather than exact equality.
- **Sign-aware formatting helpers:** Always reuse the shared `formatNormalForm()` from
  `src/utils/formatting.ts` rather than creating local duplicates. A local helper diverges from
  the shared one over time (e.g., different handling of zero terms) and produces inconsistent
  equation display across the app.
- **Generating parameters by difficulty:** The parameter generation strategy should be explicit:
  Easy uses integers with even `b` to avoid fractions, Medium uses integers with any `b`, Hard uses
  non-unit `a` to force factoring. Document these rules in comments so future modules can follow
  the same progression pattern.
- **Test correctness via conversion functions:** Module 2 exercises can be validated by checking
  that the final vertex coordinates (stored in `exercise.parabolaParams`) match the expected
  output of `normalToVertex(...)`. This ensures round-trip correctness without duplicating the
  mathematical logic in tests.

## Issue 11 — Module 3: Basic Term Transformations

- **Category-based module architecture:** Module 3 uses a category selector (expanding, factoring,
  rearranging) instead of a single exercise type. This requires separate state tracking for each
  category's stats (solved/total), managed via a `Record<Module3Category, CategoryStats>` object.
  Each category maintains its own progress independently.
- **Pure algebra exercises without visualization:** Module 3 exercises don't need parabola
  parameters or coordinate system visualization. Simply omit the `parabolaParams` field from
  the exercise generator return value, and the `ExerciseContainer` component will automatically
  hide the coordinate system section.
- **Variable reassignment in generators:** When conditionally reassigning parameter values
  (e.g., `if (b === 0) b = 1`), use `let` instead of `const` to avoid TypeScript errors.
  This pattern is common for ensuring parameters meet certain constraints (non-zero, even, etc.).
- **Multi-step difficulty progression:** Hard exercises in Module 3 use multi-step solutions
  (e.g., expanding nested brackets in two steps: first apply binomial formula, then distribute
  the factor). This pedagogical structure helps students learn complex transformations incrementally.
- **Sign formatting consistency:** The `getSignChar(value: number)` helper function should be
  defined once and reused across all generators to ensure consistent sign handling in templates
  (e.g., `${sign} ${abs}` instead of raw numbers that might display as `+-5`).
- **Category selector UI pattern:** Implement category tabs with individual score displays
  (`{solved} / {total}`) on each tab. This provides immediate visual feedback on progress per
  category and encourages students to explore all three types of exercises.
- **Signed values in templates and hints:** When displaying mathematical intermediate steps
  (like `b/2 = X/2`), always use the signed value of the coefficient, not `Math.abs()`. Using
  the absolute value causes incorrect intermediate calculations for negative coefficients
  (e.g., showing `4/2` when `b = -4` instead of `-4/2`). The same applies to hints.
- **Test assertions must actually assert:** Never guard test expectations with `if` conditions
  like `if (blanks.length > 0) { expect(...) }` — this silently passes when the condition is
  false, making the test meaningless. Use `getAllByRole` (which throws if empty) instead of
  `queryAllByRole` + conditional guard.
- **Blank correctAnswer must match what the template implies:** If a template shows a blank
  inside a formula context (e.g., `{bOver2a}²`), the `correctAnswer` must match the signed
  mathematical value the student computes, not an absolute value. Either accept the signed value
  or explicitly change the template to show `|b/(2a)|` to clarify.
- **Wire up all component callbacks:** When a parent tracks state (like solved exercise count),
  every child interaction that affects that state must be wired up. Forgetting to pass `onComplete`
  to `ExerciseContainer` means the `solved` counter never increments, making the score display
  permanently show 0.