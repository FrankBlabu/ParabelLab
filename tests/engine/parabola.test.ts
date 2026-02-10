/**
 * Tests for parabola evaluation and geometric computation functions
 *
 * Validates evaluateParabola, generateParabolaPoints, computeVertex,
 * computeZeros, and computeYIntercept against known mathematical results.
 * Covers standard parabolas, discriminant-based zero cases (two, one, none),
 * and point generation mechanics.
 */

import { describe, it, expect } from 'vitest';
import {
  evaluateParabola,
  generateParabolaPoints,
  computeVertex,
  computeZeros,
  computeYIntercept,
} from '../../src/engine/parabola';

describe('evaluateParabola', () => {
  /*
   * Evaluating at the vertex x = d must yield y = e, since (d - d)² = 0.
   */
  it('should return e when evaluated at x = d (vertex)', () => {
    expect(evaluateParabola({ a: 2, d: 3, e: 5 }, 3)).toBe(5);
  });

  /*
   * f(x) = (x - 0)² + 0 = x² evaluated at x = 4 → 16
   */
  it('should compute a simple squared value correctly', () => {
    expect(evaluateParabola({ a: 1, d: 0, e: 0 }, 4)).toBe(16);
  });

  /*
   * f(x) = -2(x - 1)² + 4 at x = 3 → -2·(2)² + 4 = -8 + 4 = -4
   */
  it('should handle negative a and offsets', () => {
    expect(evaluateParabola({ a: -2, d: 1, e: 4 }, 3)).toBe(-4);
  });
});

describe('computeVertex', () => {
  /*
   * The vertex of f(x) = a(x - d)² + e is simply the point (d, e).
   */
  it('should return (d, e) as the vertex', () => {
    expect(computeVertex({ a: 1, d: 3, e: -2 })).toEqual({ x: 3, y: -2 });
  });
});

describe('computeYIntercept', () => {
  /*
   * f(0) = a(0 - d)² + e = a·d² + e
   * For a=1, d=2, e=3: f(0) = 4 + 3 = 7
   */
  it('should return (0, f(0)) correctly', () => {
    const result = computeYIntercept({ a: 1, d: 2, e: 3 });
    expect(result).toEqual({ x: 0, y: 7 });
  });
});

describe('computeZeros', () => {
  /*
   * Two zeros: f(x) = (x - 0)² - 4 → zeros at x = ±2.
   * Discriminant = -(-4)/1 = 4 > 0 → two real roots.
   */
  it('should return two zeros when discriminant is positive', () => {
    const zeros = computeZeros({ a: 1, d: 0, e: -4 });
    expect(zeros).toHaveLength(2);
    expect(zeros[0].x).toBeCloseTo(-2);
    expect(zeros[0].y).toBe(0);
    expect(zeros[1].x).toBeCloseTo(2);
    expect(zeros[1].y).toBe(0);
  });

  /*
   * One zero: f(x) = (x - 3)² → vertex sits on x-axis.
   * Discriminant = 0/1 = 0 → exactly one root at x = 3.
   */
  it('should return one zero when discriminant is zero', () => {
    const zeros = computeZeros({ a: 1, d: 3, e: 0 });
    expect(zeros).toHaveLength(1);
    expect(zeros[0]).toEqual({ x: 3, y: 0 });
  });

  /*
   * No zeros: f(x) = (x - 0)² + 1 → parabola entirely above x-axis.
   * Discriminant = -1/1 = -1 < 0 → no real roots.
   */
  it('should return empty array when discriminant is negative', () => {
    const zeros = computeZeros({ a: 1, d: 0, e: 1 });
    expect(zeros).toHaveLength(0);
  });

  /*
   * a = 0 is not a parabola — must throw.
   */
  it('should throw when a is zero', () => {
    expect(() => computeZeros({ a: 0, d: 0, e: 0 })).toThrow(
      'Parameter "a" must not be zero',
    );
  });
});

describe('generateParabolaPoints', () => {
  /*
   * Generating with steps = 4 over [0, 4] should return 5 points.
   */
  it('should return steps + 1 points', () => {
    const points = generateParabolaPoints({ a: 1, d: 0, e: 0 }, 0, 4, 4);
    expect(points).toHaveLength(5);
  });

  /*
   * First and last x values must match xMin and xMax.
   */
  it('should start at xMin and end at xMax', () => {
    const points = generateParabolaPoints({ a: 1, d: 0, e: 0 }, -5, 5, 10);
    expect(points[0].x).toBeCloseTo(-5);
    expect(points[points.length - 1].x).toBeCloseTo(5);
  });

  /*
   * For f(x) = x², the generated y values at integer x should be x².
   */
  it('should produce correct y values for f(x) = x²', () => {
    const points = generateParabolaPoints({ a: 1, d: 0, e: 0 }, 0, 3, 3);
    expect(points[0].y).toBeCloseTo(0);
    expect(points[1].y).toBeCloseTo(1);
    expect(points[2].y).toBeCloseTo(4);
    expect(points[3].y).toBeCloseTo(9);
  });

  /*
   * steps < 1 is invalid — must throw.
   */
  it('should throw when steps is less than 1', () => {
    expect(() =>
      generateParabolaPoints({ a: 1, d: 0, e: 0 }, 0, 1, 0),
    ).toThrow('"steps" must be at least 1');
  });
});
