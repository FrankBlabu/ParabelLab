/**
 * Graph and coordinate system type definitions
 *
 * Types for the SVG-based coordinate system component, including viewport
 * configuration, SVG point representation, and coordinate transformation
 * support. These types define the mapping between mathematical (Cartesian)
 * space and SVG pixel space.
 */

/**
 * Defines the visible region in mathematical coordinates and the
 * corresponding SVG canvas dimensions in pixels.
 *
 * - `xMin` / `xMax`: horizontal range in math space.
 * - `yMin` / `yMax`: vertical range in math space.
 * - `width` / `height`: SVG canvas dimensions in pixels (viewBox units).
 */
export interface Viewport {
  readonly xMin: number;
  readonly xMax: number;
  readonly yMin: number;
  readonly yMax: number;
  readonly width: number;
  readonly height: number;
}

/**
 * A point in SVG pixel space (viewBox coordinates).
 */
export interface SvgPoint {
  readonly x: number;
  readonly y: number;
}

/**
 * Default viewport configuration:
 * math space x ∈ [-10, 10], y ∈ [-10, 10], rendered on an 800×600 canvas.
 */
export const DEFAULT_VIEWPORT: Viewport = {
  xMin: -10,
  xMax: 10,
  yMin: -10,
  yMax: 10,
  width: 800,
  height: 600,
} as const;
