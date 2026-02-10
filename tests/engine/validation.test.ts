/**
 * Tests for parameter validation and clamping
 *
 * Validates the validateVertexFormParams function for acceptance of valid
 * parameters and correct rejection of invalid inputs (wrong types, NaN,
 * Infinity, missing fields, out-of-range values, a = 0). Also tests the
 * clampParameter utility.
 */

import { describe, it, expect } from 'vitest';
import { validateVertexFormParams, clampParameter } from '../../src/engine/validation';

describe('validateVertexFormParams', () => {
  /*
   * Standard valid parameters within bounds should pass.
   */
  it('should accept valid parameters within bounds', () => {
    const result = validateVertexFormParams({ a: 1, d: 2, e: 3 });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  /*
   * Negative a within bounds should be accepted.
   */
  it('should accept negative a within bounds', () => {
    const result = validateVertexFormParams({ a: -3, d: -5, e: -8 });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  /*
   * Non-object inputs (null, number, string, etc.) must be rejected.
   */
  it('should reject null input', () => {
    const result = validateVertexFormParams(null);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Input must be a non-null object.');
  });

  it('should reject non-object input', () => {
    const result = validateVertexFormParams(42);
    expect(result.valid).toBe(false);
  });

  /*
   * Missing fields should be reported.
   */
  it('should reject an empty object (missing all fields)', () => {
    const result = validateVertexFormParams({});
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });

  /*
   * NaN and Infinity should be rejected as non-finite.
   */
  it('should reject NaN values', () => {
    const result = validateVertexFormParams({ a: NaN, d: 0, e: 0 });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('"a"'))).toBe(true);
  });

  it('should reject Infinity values', () => {
    const result = validateVertexFormParams({ a: 1, d: Infinity, e: 0 });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('"d"'))).toBe(true);
  });

  /*
   * a = 0 is semantically invalid — must be reported.
   */
  it('should reject a = 0', () => {
    const result = validateVertexFormParams({ a: 0, d: 1, e: 2 });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('must not be zero'))).toBe(true);
  });

  /*
   * Out-of-bounds values should be reported with the offending field.
   */
  it('should reject out-of-bounds a', () => {
    const result = validateVertexFormParams({ a: 10, d: 0, e: 0 });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('"a"'))).toBe(true);
  });

  it('should reject out-of-bounds d', () => {
    const result = validateVertexFormParams({ a: 1, d: 20, e: 0 });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('"d"'))).toBe(true);
  });
});

describe('clampParameter', () => {
  /*
   * A value within bounds should be returned unchanged.
   */
  it('should return the value when within bounds', () => {
    expect(clampParameter(3, 0, 5)).toBe(3);
  });

  /*
   * A value below the lower bound should be clamped to min.
   */
  it('should clamp to min when value is below lower bound', () => {
    expect(clampParameter(-10, -5, 5)).toBe(-5);
  });

  /*
   * A value above the upper bound should be clamped to max.
   */
  it('should clamp to max when value is above upper bound', () => {
    expect(clampParameter(100, -5, 5)).toBe(5);
  });

  /*
   * Boundary values should be returned as-is.
   */
  it('should return boundary values unchanged', () => {
    expect(clampParameter(-5, -5, 5)).toBe(-5);
    expect(clampParameter(5, -5, 5)).toBe(5);
  });
});
