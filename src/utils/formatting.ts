/**
 * Formatting utilities for parabola equations
 *
 * Converts parabola parameters into human-readable mathematical notation
 * strings suitable for display in the UI. Handles special cases such as
 * coefficients of ±1, zero offsets, and sign collapsing to produce clean,
 * textbook-style output.
 */

import type { VertexFormParams, NormalFormParams } from '../types/parabola';

/**
 * Formats a vertex form parabola as a human-readable string.
 *
 * Examples:
 * - { a: 2, d: 3, e: 1 }  → "f(x) = 2(x - 3)² + 1"
 * - { a: 1, d: 0, e: 0 }  → "f(x) = x²"
 * - { a: -1, d: -2, e: 0 } → "f(x) = -(x + 2)²"
 * - { a: 1, d: 0, e: -4 } → "f(x) = x² - 4"
 *
 * @param params - Vertex form parameters.
 * @returns A formatted equation string.
 */
export function formatVertexForm(params: VertexFormParams): string {
  const { a, d, e } = params;

  // Build the coefficient + squared-term part
  let result = 'f(x) = ';

  // Coefficient
  if (a === 1) {
    // Omit coefficient entirely; it will be implied by the squared term
    result += '';
  } else if (a === -1) {
    result += '-';
  } else {
    result += `${a}`;
  }

  // Squared term: either "x²" or "(x ± d)²"
  if (d === 0) {
    result += 'x²';
  } else {
    // Determine sign inside parentheses: (x - d), so positive d → minus,
    // negative d → plus.
    const innerSign = d > 0 ? '-' : '+';
    const absD = Math.abs(d);
    result += `(x ${innerSign} ${absD})²`;
  }

  // Constant term e
  if (e !== 0) {
    if (e > 0) {
      result += ` + ${e}`;
    } else {
      result += ` - ${Math.abs(e)}`;
    }
  }

  return result;
}

/**
 * Formats a normal form parabola as a human-readable string.
 *
 * Examples:
 * - { a: 2, b: -12, c: 19 } → "f(x) = 2x² - 12x + 19"
 * - { a: 1, b: 0, c: 0 }    → "f(x) = x²"
 * - { a: -1, b: 4, c: -7 }  → "f(x) = -x² + 4x - 7"
 *
 * @param params - Normal form parameters.
 * @returns A formatted equation string.
 */
export function formatNormalForm(params: NormalFormParams): string {
  const { a, b, c } = params;

  let result = 'f(x) = ';

  // ax² term
  if (a === 1) {
    result += 'x²';
  } else if (a === -1) {
    result += '-x²';
  } else {
    result += `${a}x²`;
  }

  // bx term
  if (b !== 0) {
    if (b > 0) {
      result += ` + ${b === 1 ? '' : b}x`;
    } else {
      result += ` - ${b === -1 ? '' : Math.abs(b)}x`;
    }
  }

  // c term
  if (c !== 0) {
    if (c > 0) {
      result += ` + ${c}`;
    } else {
      result += ` - ${Math.abs(c)}`;
    }
  }

  return result;
}
