/**
 * Coordinate transformation utilities
 *
 * Provides pure functions to convert between mathematical (Cartesian)
 * coordinates and SVG pixel coordinates. The y-axis is inverted in SVG
 * (positive y points downward), so the transformation accounts for that.
 *
 * Formulas:
 *   x_svg = ((x_math - xMin) / (xMax - xMin)) * width
 *   y_svg = height - ((y_math - yMin) / (yMax - yMin)) * height
 */

import type { Point } from '../../types/parabola';
import type { Viewport, SvgPoint } from '../../types/graph';

/**
 * Converts a point from math (Cartesian) space to SVG pixel space.
 *
 * @param point    - The point in math coordinates.
 * @param viewport - The viewport defining the mapping.
 * @returns The corresponding point in SVG coordinates.
 */
export function mathToSvg(point: Point, viewport: Viewport): SvgPoint {
  const { xMin, xMax, yMin, yMax, width, height } = viewport;

  const x = ((point.x - xMin) / (xMax - xMin)) * width;
  const y = height - ((point.y - yMin) / (yMax - yMin)) * height;

  return { x, y };
}

/**
 * Converts a point from SVG pixel space to math (Cartesian) space.
 *
 * @param point    - The point in SVG coordinates.
 * @param viewport - The viewport defining the mapping.
 * @returns The corresponding point in math coordinates.
 */
export function svgToMath(point: SvgPoint, viewport: Viewport): Point {
  const { xMin, xMax, yMin, yMax, width, height } = viewport;

  const x = (point.x / width) * (xMax - xMin) + xMin;
  const y = ((height - point.y) / height) * (yMax - yMin) + yMin;

  return { x, y };
}
