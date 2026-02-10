/**
 * Parabola form conversion functions
 *
 * Provides pure functions to convert between vertex form f(x) = a(x - d)² + e
 * and normal form f(x) = ax² + bx + c. Both directions handle the edge case
 * where a = 0 (not a valid parabola) by throwing an error.
 */

import type { VertexFormParams, NormalFormParams } from '../types/parabola';

/**
 * Converts vertex form parameters to normal form.
 *
 * Given f(x) = a(x - d)² + e, expands to f(x) = ax² + bx + c where:
 * - b = -2ad
 * - c = ad² + e
 *
 * @param params - Vertex form parameters (a must not be zero).
 * @returns The equivalent normal form parameters.
 * @throws {Error} If `a` is zero (degenerate — not a parabola).
 */
export function vertexToNormal(params: VertexFormParams): NormalFormParams {
  const { a, d, e } = params;

  if (a === 0) {
    throw new Error('Parameter "a" must not be zero: a = 0 does not define a parabola.');
  }

  const b = -2 * a * d;
  const c = a * d * d + e;

  return {
    a,
    b: b === 0 ? 0 : b,
    c: c === 0 ? 0 : c,
  };
}

/**
 * Converts normal form parameters to vertex form.
 *
 * Given f(x) = ax² + bx + c, computes:
 * - d = -b / (2a)
 * - e = c - b² / (4a)
 *
 * @param params - Normal form parameters (a must not be zero).
 * @returns The equivalent vertex form parameters.
 * @throws {Error} If `a` is zero (degenerate — not a parabola).
 */
export function normalToVertex(params: NormalFormParams): VertexFormParams {
  const { a, b, c } = params;

  if (a === 0) {
    throw new Error('Parameter "a" must not be zero: a = 0 does not define a parabola.');
  }

  const d = -b / (2 * a);
  const e = c - (b * b) / (4 * a);

  return {
    a,
    d: d === 0 ? 0 : d,
    e: e === 0 ? 0 : e,
  };
}
