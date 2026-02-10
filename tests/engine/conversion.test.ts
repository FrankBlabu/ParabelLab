/**
 * Tests for parabola form conversion functions
 *
 * Validates the vertexToNormal and normalToVertex conversion functions,
 * ensuring correctness for standard cases, special parameter values, and
 * edge cases (e.g. a = 0). Also verifies that round-trip conversions
 * (vertex → normal → vertex) reproduce the original parameters.
 */

import { describe, it, expect } from 'vitest';
import { vertexToNormal, normalToVertex } from '../../src/engine/conversion';

describe('vertexToNormal', () => {
  /*
   * Known-value conversion:
   * f(x) = 1·(x - 2)² + 3  →  f(x) = x² - 4x + 7
   * b = -2·1·2 = -4, c = 1·4 + 3 = 7
   */
  it('should convert a known vertex form to normal form', () => {
    const result = vertexToNormal({ a: 1, d: 2, e: 3 });
    expect(result).toEqual({ a: 1, b: -4, c: 7 });
  });

  /*
   * Negative a: f(x) = -2(x - 1)² + 4  →  a=-2, b=4, c=2
   * b = -2·(-2)·1 = 4, c = -2·1 + 4 = 2
   */
  it('should handle negative a correctly', () => {
    const result = vertexToNormal({ a: -2, d: 1, e: 4 });
    expect(result).toEqual({ a: -2, b: 4, c: 2 });
  });

  /*
   * d = 0, e = 0: f(x) = a·x²  →  b = 0, c = 0
   */
  it('should convert f(x) = ax² when d and e are zero', () => {
    const result = vertexToNormal({ a: 3, d: 0, e: 0 });
    expect(result).toEqual({ a: 3, b: 0, c: 0 });
  });

  /*
   * Edge case: a = 0 is not a valid parabola — must throw.
   */
  it('should throw when a is zero', () => {
    expect(() => vertexToNormal({ a: 0, d: 1, e: 2 })).toThrow(
      'Parameter "a" must not be zero',
    );
  });
});

describe('normalToVertex', () => {
  /*
   * Known-value conversion:
   * f(x) = x² - 4x + 7  →  d = 4/2 = 2, e = 7 - 16/4 = 3
   */
  it('should convert a known normal form to vertex form', () => {
    const result = normalToVertex({ a: 1, b: -4, c: 7 });
    expect(result).toEqual({ a: 1, d: 2, e: 3 });
  });

  /*
   * Negative a: f(x) = -2x² + 4x + 2
   * d = -4 / (2·(-2)) = 1, e = 2 - 16/(-8) = 2 + 2 = 4
   */
  it('should handle negative a correctly', () => {
    const result = normalToVertex({ a: -2, b: 4, c: 2 });
    expect(result).toEqual({ a: -2, d: 1, e: 4 });
  });

  /*
   * b = 0, c = 0: f(x) = ax²  →  d = 0, e = 0
   */
  it('should convert f(x) = ax² when b and c are zero', () => {
    const result = normalToVertex({ a: 3, b: 0, c: 0 });
    expect(result).toEqual({ a: 3, d: 0, e: 0 });
  });

  /*
   * Edge case: a = 0 — must throw.
   */
  it('should throw when a is zero', () => {
    expect(() => normalToVertex({ a: 0, b: 2, c: 1 })).toThrow(
      'Parameter "a" must not be zero',
    );
  });
});

describe('Round-trip conversions', () => {
  /*
   * Converting vertex → normal → vertex must reproduce the original
   * parameters within floating-point tolerance.
   */
  it('should reproduce original vertex params after vertex → normal → vertex', () => {
    const original = { a: 2, d: -3, e: 5 };
    const normal = vertexToNormal(original);
    const restored = normalToVertex(normal);

    expect(restored.a).toBeCloseTo(original.a);
    expect(restored.d).toBeCloseTo(original.d);
    expect(restored.e).toBeCloseTo(original.e);
  });

  /*
   * Converting normal → vertex → normal must reproduce the original
   * parameters within floating-point tolerance.
   */
  it('should reproduce original normal params after normal → vertex → normal', () => {
    const original = { a: -1, b: 6, c: -2 };
    const vertex = normalToVertex(original);
    const restored = vertexToNormal(vertex);

    expect(restored.a).toBeCloseTo(original.a);
    expect(restored.b).toBeCloseTo(original.b);
    expect(restored.c).toBeCloseTo(original.c);
  });
});
