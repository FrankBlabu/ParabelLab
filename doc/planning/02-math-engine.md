# Step 02 — Math Engine

## Goal

Implement a pure-function math engine that handles all parabola-related
calculations. This module has no React dependencies and can be tested in
isolation. It forms the computational backbone for the explorer and all
learning modules.

## Dependencies

- Step 01 (Project Setup)

## Extended Thinking Required

**Yes** — Correct formulation of mathematical algorithms, edge case handling
for special parameter values (e.g., $a = 0$, very large values), and numerical
precision considerations require careful reasoning.

## Mathematical Background

### Vertex Form

$$f(x) = a(x - d)^2 + e$$

where $S(d|e)$ is the vertex (Scheitelpunkt).

### Normal Form

$$f(x) = ax^2 + bx + c$$

### Conversion: Vertex → Normal

$$f(x) = a(x - d)^2 + e = a(x^2 - 2dx + d^2) + e = ax^2 - 2adx + ad^2 + e$$

Therefore:
- $a = a$
- $b = -2ad$
- $c = ad^2 + e$

### Conversion: Normal → Vertex

Given $f(x) = ax^2 + bx + c$ (with $a \neq 0$):

$$d = -\frac{b}{2a}$$
$$e = c - \frac{b^2}{4a}$$

## Tasks

### 2.1 Define Types (`src/types/parabola.ts`)

```typescript
/** Parameters for vertex form: f(x) = a(x - d)² + e */
interface VertexFormParams {
  a: number;
  d: number;
  e: number;
}

/** Parameters for normal form: f(x) = ax² + bx + c */
interface NormalFormParams {
  a: number;
  b: number;
  c: number;
}

/** A point in 2D space */
interface Point {
  x: number;
  y: number;
}

/** Complete parabola data combining both forms */
interface ParabolaData {
  vertexForm: VertexFormParams;
  normalForm: NormalFormParams;
  vertex: Point;
}
```

### 2.2 Implement Conversion Functions (`src/engine/conversion.ts`)

- `vertexToNormal(params: VertexFormParams): NormalFormParams`
- `normalToVertex(params: NormalFormParams): VertexFormParams`
- Handle edge case: $a = 0$ (degenerate — not a parabola; return error or
  clamp)

### 2.3 Implement Parabola Evaluation (`src/engine/parabola.ts`)

- `evaluateParabola(params: VertexFormParams, x: number): number`
  — Computes $f(x)$ for a given $x$
- `generateParabolaPoints(params: VertexFormParams, xMin: number, xMax: number, steps: number): Point[]`
  — Generates an array of $(x, y)$ points for plotting
- `computeVertex(params: VertexFormParams): Point`
  — Returns the vertex point $S(d|e)$
- `computeZeros(params: VertexFormParams): Point[]`
  — Returns zero, one, or two x-intercepts using the discriminant
- `computeYIntercept(params: VertexFormParams): Point`
  — Returns the y-intercept $(0, f(0))$

### 2.4 Implement Validation (`src/engine/validation.ts`)

- `validateVertexFormParams(params: unknown): ValidationResult`
  — Checks that a, d, e are finite numbers and $a \neq 0$
- `clampParameter(value: number, min: number, max: number): number`
  — Utility to keep slider values within bounds
- Define sensible bounds for parameters:
  - $a \in [-5, 5] \setminus \{0\}$
  - $d \in [-10, 10]$
  - $e \in [-10, 10]$

### 2.5 Implement Formatting Utilities (`src/utils/formatting.ts`)

- `formatVertexForm(params: VertexFormParams): string`
  — Returns e.g. `"f(x) = 2(x - 3)² + 1"`
- `formatNormalForm(params: NormalFormParams): string`
  — Returns e.g. `"f(x) = 2x² - 12x + 19"`
- Handle special cases:
  - $a = 1$: omit coefficient (`(x - 3)²` not `1(x - 3)²`)
  - $a = -1$: show `-(x - 3)²`
  - $d = 0$: show `x²` not `(x - 0)²`
  - $e = 0$: omit constant term
  - Negative signs: `(x + 2)²` for $d = -2$

## Tests

### `tests/engine/conversion.test.ts`

- **Identity round-trip**: converting vertex→normal→vertex returns original params
- **Known values**: $a=1, d=2, e=3$ → $a=1, b=-4, c=7$
- **Negative a**: verify correct sign propagation
- **Zero d and e**: verify $f(x) = ax²$ converts correctly
- **Edge case**: $a=0$ handling

### `tests/engine/parabola.test.ts`

- **Vertex computation**: verify vertex point matches $(d, e)$
- **Point evaluation**: verify $f(d) = e$ (vertex is minimum/maximum)
- **Y-intercept**: verify $f(0) = ad² + e$
- **Zeros**: test discriminant-based cases (two, one, no zeros)
- **Point generation**: verify correct number of points, monotonicity near vertex

### `tests/engine/validation.test.ts`

- **Valid params**: accepted without errors
- **Invalid params**: NaN, Infinity, missing fields rejected
- **Clamping**: values outside bounds are clamped correctly

### `tests/utils/formatting.test.ts`

- **Standard case**: verify formatted string
- **Special cases**: $a=1$, $a=-1$, $d=0$, $e=0$
- **Negative parameters**: correct sign handling in formatted output

## Estimated Complexity

Medium — the math is straightforward but edge cases in formatting and precision
require attention.
