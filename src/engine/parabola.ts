/**
 * Parabola evaluation and geometric computations
 *
 * Pure functions for evaluating a parabola at a given x, generating arrays
 * of points for plotting, and computing special geometric features such as
 * vertex, zeros (x-intercepts), and y-intercept.
 *
 * All functions expect vertex form parameters f(x) = a(x - d)² + e.
 */

import type { VertexFormParams, Point } from '../types/parabola';

/**
 * Evaluates the parabola f(x) = a(x - d)² + e at a given x value.
 *
 * @param params - Vertex form parameters.
 * @param x - The x value to evaluate at.
 * @returns The y value f(x).
 */
export function evaluateParabola(params: VertexFormParams, x: number): number {
  const { a, d, e } = params;
  const dx = x - d;
  return a * dx * dx + e;
}

/**
 * Generates an array of evenly-spaced points along the parabola for plotting.
 *
 * @param params - Vertex form parameters.
 * @param xMin  - Left bound of the x range (inclusive).
 * @param xMax  - Right bound of the x range (inclusive).
 * @param steps - Number of intervals (the returned array has steps + 1 points).
 *                Must be at least 1.
 * @returns Array of (x, y) points sampled from the parabola.
 * @throws {Error} If steps < 1.
 */
export function generateParabolaPoints(
  params: VertexFormParams,
  xMin: number,
  xMax: number,
  steps: number,
): Point[] {
  if (steps < 1) {
    throw new Error(`"steps" must be at least 1, got ${steps}.`);
  }

  const points: Point[] = [];
  const stepSize = (xMax - xMin) / steps;

  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * stepSize;
    points.push({ x, y: evaluateParabola(params, x) });
  }

  return points;
}

/**
 * Returns the vertex point S(d | e).
 *
 * @param params - Vertex form parameters.
 * @returns The vertex as a Point.
 */
export function computeVertex(params: VertexFormParams): Point {
  return { x: params.d, y: params.e };
}

/**
 * Computes the x-intercepts (zeros / Nullstellen) of the parabola.
 *
 * For f(x) = a(x - d)² + e = 0:
 *   (x - d)² = -e / a
 *
 * - If -e/a < 0: no real zeros → empty array.
 * - If -e/a = 0: one zero at x = d → array with one point.
 * - If -e/a > 0: two zeros at x = d ± √(-e/a) → array with two points
 *   sorted by ascending x.
 *
 * @param params - Vertex form parameters (a must not be zero).
 * @returns Array of zero, one, or two x-intercept points.
 * @throws {Error} If `a` is zero.
 */
export function computeZeros(params: VertexFormParams): Point[] {
  const { a, d, e } = params;

  if (a === 0) {
    throw new Error('Parameter "a" must not be zero: a = 0 does not define a parabola.');
  }

  const discriminant = -e / a;

  if (discriminant < 0) {
    return [];
  }

  if (discriminant === 0) {
    return [{ x: d, y: 0 }];
  }

  const sqrtDisc = Math.sqrt(discriminant);
  return [
    { x: d - sqrtDisc, y: 0 },
    { x: d + sqrtDisc, y: 0 },
  ];
}

/**
 * Computes the y-intercept of the parabola, i.e. the point (0, f(0)).
 *
 * @param params - Vertex form parameters.
 * @returns The y-intercept as a Point.
 */
export function computeYIntercept(params: VertexFormParams): Point {
  return { x: 0, y: evaluateParabola(params, 0) };
}
