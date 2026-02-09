# Step 03 — Coordinate System & Parabola Rendering

## Goal

Build a reusable SVG-based coordinate system component that can render a
parabola curve, axes, grid lines, and special points (vertex, zeros,
y-intercept). This component is the primary visualization tool used across the
explorer and all learning modules.

## Dependencies

- Step 01 (Project Setup)

## Extended Thinking Required

**Yes** — SVG coordinate transformations (math coordinates ↔ pixel coordinates),
responsive scaling, smooth curve rendering with SVG paths, and performance
considerations for real-time slider updates require careful design.

## Design Decisions

### SVG vs. Canvas

SVG is chosen over Canvas for the following reasons:
- Each element is a DOM node → accessible, stylable, interactive
- React can manage SVG elements declaratively via JSX
- No need for manual redraw logic
- CSS transitions/animations work out of the box
- Performance is sufficient for a single parabola curve

### Coordinate Transformation

The SVG viewBox provides a virtual coordinate space. We define a mapping:

- **Math space**: x ∈ [-10, 10], y ∈ [-10, 10] (adjustable)
- **SVG space**: viewBox = "0 0 800 600" (fixed aspect ratio)

Transformation formulas:

$$x_{svg} = \frac{(x_{math} - x_{min})}{(x_{max} - x_{min})} \times width$$

$$y_{svg} = height - \frac{(y_{math} - y_{min})}{(y_{max} - y_{min})} \times height$$

(Y-axis is inverted in SVG.)

## Tasks

### 3.1 Implement Coordinate Transform Utilities (`src/components/graph/`)

- `mathToSvg(point: Point, viewport: Viewport): SvgPoint`
- `svgToMath(point: SvgPoint, viewport: Viewport): Point`
- Define `Viewport` type: `{ xMin, xMax, yMin, yMax, width, height }`

### 3.2 Implement Grid Component

- Render vertical and horizontal grid lines at integer intervals
- Highlight every 5th line with a stronger stroke
- Grid lines should be subtle (light gray, thin stroke)

### 3.3 Implement Axes Component

- Render x-axis and y-axis as bold lines through the origin
- Add tick marks at integer positions
- Add numeric labels at tick marks (skip 0 label to avoid overlap)
- Add axis labels: "x" and "y"
- Arrowheads at the positive ends of both axes

### 3.4 Implement ParabolaCurve Component

- Accept `VertexFormParams` as props
- Use the math engine's `generateParabolaPoints()` to get plot data
- Render as an SVG `<path>` element using a smooth curve
  (quadratic Bézier or polyline with sufficient resolution)
- Color: configurable via prop, default is a distinct blue
- Clip the curve to the visible viewport

### 3.5 Implement VertexMarker Component

- Render a highlighted point at the vertex position
- Show coordinates label: "S(d|e)" near the point
- Use a distinct color (e.g., red dot)

### 3.6 Implement ZeroMarkers & YInterceptMarker (Optional Points)

- Small markers at x-intercepts and y-intercept
- Toggle visibility via props
- Coordinate labels on hover or always visible (configurable)

### 3.7 Compose CoordinateSystem Component

- Combine Grid, Axes, ParabolaCurve, VertexMarker into a single component
- Accept props for:
  - `parabolaParams: VertexFormParams`
  - `viewport: Viewport` (default: x ∈ [-10, 10], y ∈ [-10, 10])
  - `showGrid: boolean`
  - `showVertex: boolean`
  - `showZeros: boolean`
  - `showYIntercept: boolean`
  - `interactive: boolean` (for future drag support)
- Wrap in a responsive container that maintains aspect ratio

### 3.8 Responsive Container

- The SVG should scale to fill its parent container
- Use `viewBox` and `preserveAspectRatio` for proper scaling
- Minimum size constraints to keep labels readable

## Tests

### `tests/components/graph/CoordinateSystem.test.tsx`

- **Renders without crash**: component mounts with default props
- **Axes visible**: verify x-axis and y-axis SVG elements exist
- **Grid visible**: verify grid lines are rendered when `showGrid=true`
- **Parabola renders**: verify a `<path>` element exists for the curve
- **Vertex marker**: verify vertex marker appears at correct position
- **Viewport change**: verify the component re-renders correctly with a
  different viewport

### `tests/components/graph/coordinateTransform.test.ts`

- **Origin mapping**: math origin (0,0) maps to center of SVG
- **Boundary mapping**: math boundaries map to SVG edges
- **Round-trip**: mathToSvg → svgToMath returns original point
- **Y-axis inversion**: positive y in math → lower y in SVG

## Performance Considerations

- Use `React.memo` on subcomponents (Grid, Axes) that don't change frequently
- The parabola curve should re-render on every slider change — keep point
  generation efficient (200–400 points is sufficient)
- Avoid unnecessary re-renders of static elements when only the parabola
  parameters change

## Estimated Complexity

Medium-High — coordinate transformations, SVG path generation, and responsive
layout require careful implementation.
