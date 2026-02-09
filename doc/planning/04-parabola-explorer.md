# Step 04 — Interactive Parabola Explorer

## Goal

Build the main interactive explorer page where students can manipulate parabola
parameters via sliders and see the graph update in real time. Both forms
(vertex and normal) are displayed simultaneously with automatic conversion.

## Dependencies

- Step 02 (Math Engine)
- Step 03 (Coordinate System)

## Extended Thinking Required

No — this step integrates existing components with straightforward state
management.

## Feature Description

The explorer page is the centerpiece of the application. It allows students to:

1. Adjust parameter `a` (stretch/compression/reflection) via slider
2. Adjust parameter `d` (horizontal shift) via slider
3. Adjust parameter `e` (vertical shift) via slider
4. See the parabola update in real time on the coordinate system
5. See both the vertex form and normal form displayed and updated automatically
6. See the vertex point highlighted on the graph
7. Optionally toggle visibility of zeros and y-intercept

### User Flow

```
Student opens Explorer
    │
    ▼
Default parabola displayed: f(x) = x²  (a=1, d=0, e=0)
    │
    ▼
Student moves slider "a" ──▶ Parabola stretches/compresses
Student moves slider "d" ──▶ Parabola shifts horizontally
Student moves slider "e" ──▶ Parabola shifts vertically
    │
    ▼
Both forms update in real time below the graph
Vertex marker moves accordingly
```

## Tasks

### 4.1 Implement SliderControl Component (`src/components/ui/Slider.tsx`)

- Labeled range input with:
  - Parameter name (e.g., "a", "d", "e")
  - Current value display
  - Min/max bounds
  - Step size (0.1 for `a`, 0.5 for `d` and `e`)
- Accessible: proper `<label>`, `aria-valuemin/max/now`
- Styled with Tailwind for a modern look
- Debounce is NOT needed — slider input events are already throttled by the
  browser; React state updates are fast enough

### 4.2 Implement ParameterControls Component

- Groups three SliderControl instances (a, d, e)
- Provides a "Zurücksetzen" (Reset) button to restore defaults
- Layout: vertical stack or horizontal row depending on viewport width

### 4.3 Implement FormDisplay Component (`src/components/math/FormulaDisplay.tsx`)

- Displays both forms side-by-side (or stacked on mobile):
  - **Scheitelpunktform**: $f(x) = a(x - d)^2 + e$
  - **Normalform**: $f(x) = ax^2 + bx + c$
- Uses formatting utilities from the math engine
- Optionally highlights which parameters changed (CSS transition on value
  change)
- Visually distinct cards for each form

### 4.4 Implement useParabola Hook (`src/hooks/useParabola.ts`)

- Manages the state of `VertexFormParams`
- Derives `NormalFormParams` via the conversion function
- Derives vertex `Point`
- Provides setter functions for individual parameters
- Provides a reset function

### 4.5 Compose ExplorerPage (`src/pages/ExplorerPage.tsx`)

- Layout:
  ```
  ┌──────────────────────────────────────┐
  │  Coordinate System (60% width)       │  Parameter
  │  with parabola, vertex, grid         │  Controls
  │                                      │  (40% width)
  ├──────────────────────────────────────┤
  │  Form Display (full width)           │
  │  Scheitelpunktform  │  Normalform    │
  └──────────────────────────────────────┘
  ```
- On mobile: stack vertically (graph on top, controls below, forms at bottom)
- Page title: "Parabel-Explorer"

### 4.6 Edge Cases

- **a = 0**: Display a warning message ("Der Parameter a darf nicht 0 sein")
  and either disable the graph or show the linear function
- **Extreme values**: Parabola may extend beyond the viewport — clip gracefully
- **Rapid slider movement**: Ensure no flickering or lag

## Tests

### `tests/pages/ExplorerPage.test.tsx`

- **Renders default parabola**: verify initial state shows $f(x) = x^2$
- **Slider interaction**: simulate slider change, verify parameter update
  reflected in the form display
- **Reset button**: verify clicking reset restores default parameters
- **Both forms displayed**: verify both vertex and normal form are visible
- **Vertex marker visible**: verify the vertex point is rendered on the graph

### `tests/hooks/useParabola.test.ts`

- **Initial state**: default params are $a=1, d=0, e=0$
- **Parameter update**: setting $d=3$ updates vertex form and derived normal form
- **Conversion correctness**: verify normal form coefficients match conversion

## Estimated Complexity

Medium — mostly integration of existing components with state wiring.
