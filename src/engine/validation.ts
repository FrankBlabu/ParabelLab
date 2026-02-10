/**
 * Parameter validation for parabola forms
 *
 * Provides runtime validation of incoming parameter objects and a clamping
 * utility for keeping interactive slider values within defined bounds.
 * All validation is schema-like: it inspects `unknown` input and returns a
 * typed result indicating success or listing all detected problems.
 */

import type { ValidationResult } from '../types/parabola';
import { PARAMETER_BOUNDS } from '../types/parabola';

/**
 * Validates that the given value is a plain object containing finite numeric
 * fields `a`, `d`, and `e` suitable for use as vertex form parameters.
 *
 * Checks performed:
 * - Input is a non-null object.
 * - `a`, `d`, `e` exist and are finite numbers.
 * - `a` is not zero (degenerate case).
 * - All values are within the defined parameter bounds.
 *
 * @param params - Unknown input to validate.
 * @returns A {@link ValidationResult} with `valid: true` if all checks pass,
 *   or `valid: false` with a list of human-readable error strings.
 */
export function validateVertexFormParams(params: unknown): ValidationResult {
  const errors: string[] = [];

  if (typeof params !== 'object' || params === null) {
    return { valid: false, errors: ['Input must be a non-null object.'] };
  }

  const obj = params as Record<string, unknown>;

  // Check each expected field
  for (const field of ['a', 'd', 'e'] as const) {
    const value = obj[field];
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      errors.push(`"${field}" must be a finite number.`);
      continue;
    }

    const bounds = PARAMETER_BOUNDS[field];
    if (value < bounds.min || value > bounds.max) {
      errors.push(
        `"${field}" must be between ${bounds.min} and ${bounds.max}, got ${value}.`,
      );
    }
  }

  // a = 0 is a separate semantic error (not just out-of-range)
  if (typeof obj.a === 'number' && obj.a === 0) {
    errors.push('"a" must not be zero: a = 0 does not define a parabola.');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Clamps a numeric value to the closed interval [min, max].
 *
 * @param value - The value to clamp.
 * @param min   - Lower bound (inclusive).
 * @param max   - Upper bound (inclusive).
 * @returns The clamped value.
 */
export function clampParameter(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
