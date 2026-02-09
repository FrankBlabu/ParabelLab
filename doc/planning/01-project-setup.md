# Step 01 — Project Setup & Infrastructure

## Goal

Initialize the project with a complete development environment including build
tooling, linting, formatting, testing infrastructure, and CI configuration. After
this step, a developer can run `npm run dev` and see an empty application shell.

## Dependencies

None — this is the first step.

## Extended Thinking Required

No.

## Tasks

### 1.1 Initialize Vite + React + TypeScript Project

- Run `npm create vite@latest` with the React + TypeScript + SWC template
- Verify the default scaffold runs (`npm run dev`)
- Remove Vite boilerplate content (default counter app, logos)

### 1.2 Install Core Dependencies

**Production dependencies:**

```
react-router-dom
```

**Development dependencies:**

```
tailwindcss @tailwindcss/vite
vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
jsdom
eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh
prettier eslint-config-prettier
```

### 1.3 Configure Tailwind CSS

- Install Tailwind CSS and the Vite plugin
- Add `@import "tailwindcss"` to the main CSS file
- Configure `tailwind.config.ts` with a color palette suitable for a math
  learning app (calm blues, greens, warm accents)

### 1.4 Configure ESLint & Prettier

- Set up `eslint.config.js` with:
  - TypeScript strict rules
  - React hooks rules
  - React refresh rules
- Create `.prettierrc` with:
  - Single quotes
  - Trailing commas
  - 80-character line width
  - 2-space indentation

### 1.5 Configure Vitest

- Set up `vitest.config.ts` (or extend `vite.config.ts`) with:
  - `jsdom` test environment
  - Coverage configuration
  - Test file patterns: `tests/**/*.test.{ts,tsx}`
- Create a test setup file that imports `@testing-library/jest-dom`

### 1.6 Configure VSCode Tasks

- Create `.vscode/tasks.json` with:
  - `Dev`: `npm run dev`
  - `Build`: `npm run build`
  - `Checks`: `npm run lint && npm run typecheck`
  - `Test`: `npm run test`
- Add `typecheck` script to `package.json`: `tsc --noEmit`

### 1.7 Create Directory Structure

Create the empty directory structure as defined in the overview:

```
src/
├── components/
│   ├── ui/
│   ├── math/
│   └── graph/
├── pages/
├── engine/
├── hooks/
├── context/
├── types/
├── utils/
└── layouts/
tests/
├── engine/
├── components/
├── pages/
└── hooks/
```

### 1.8 Minimal App Entry Point

- Create `src/main.tsx` with React DOM render
- Create `src/App.tsx` with a placeholder component
- Create `src/index.css` with Tailwind imports
- Verify the app compiles and renders

## Tests

### Unit Tests

- **Smoke test**: Verify the `App` component renders without crashing
- **Build test**: Verify `npm run build` completes without errors (run as part
  of CI, not Vitest)

### Verification Checklist

- [ ] `npm run dev` starts the development server
- [ ] `npm run build` produces a production build without errors
- [ ] `npm run lint` passes with no warnings
- [ ] `npm run test` discovers and runs the smoke test
- [ ] TypeScript compilation succeeds with `tsc --noEmit`

## Estimated Complexity

Low — standard project scaffolding with well-documented tools.
