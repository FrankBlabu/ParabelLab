/**
 * Tests for coordinate transformation utilities
 *
 * Validates mathToSvg and svgToMath against known reference positions,
 * verifies y-axis inversion behaviour, boundary mapping, and round-trip
 * consistency (mathToSvg → svgToMath returns the original point).
 */

import { describe, it, expect } from 'vitest';
import { mathToSvg, svgToMath } from '../../../src/components/graph/coordinateTransform';
import type { Viewport } from '../../../src/types/graph';

/**
 * A symmetric viewport used in most tests:
 * math space x ∈ [-10, 10], y ∈ [-10, 10], rendered on an 800×600 canvas.
 */
const viewport: Viewport = {
  xMin: -10,
  xMax: 10,
  yMin: -10,
  yMax: 10,
  width: 800,
  height: 600,
};

describe('mathToSvg', () => {
  /*
   * The math origin (0, 0) should map to the centre of the SVG canvas —
   * i.e. (width/2, height/2) = (400, 300).
   */
  it('should map the math origin to the centre of the SVG canvas', () => {
    const result = mathToSvg({ x: 0, y: 0 }, viewport);
    expect(result.x).toBeCloseTo(400);
    expect(result.y).toBeCloseTo(300);
  });

  /*
   * The bottom-left corner of math space (xMin, yMin) should map to
   * SVG (0, height).
   */
  it('should map bottom-left boundary to SVG bottom-left', () => {
    const result = mathToSvg({ x: -10, y: -10 }, viewport);
    expect(result.x).toBeCloseTo(0);
    expect(result.y).toBeCloseTo(600);
  });

  /*
   * The top-right corner of math space (xMax, yMax) should map to
   * SVG (width, 0).
   */
  it('should map top-right boundary to SVG top-right', () => {
    const result = mathToSvg({ x: 10, y: 10 }, viewport);
    expect(result.x).toBeCloseTo(800);
    expect(result.y).toBeCloseTo(0);
  });

  /*
   * Positive y in math space should produce a lower y in SVG space
   * (since SVG y increases downward).
   */
  it('should invert the y-axis (positive y → lower SVG y)', () => {
    const high = mathToSvg({ x: 0, y: 5 }, viewport);
    const low = mathToSvg({ x: 0, y: -5 }, viewport);
    expect(high.y).toBeLessThan(low.y);
  });
});

describe('svgToMath', () => {
  /*
   * The centre of the SVG canvas should map back to the math origin.
   */
  it('should map the SVG centre to the math origin', () => {
    const result = svgToMath({ x: 400, y: 300 }, viewport);
    expect(result.x).toBeCloseTo(0);
    expect(result.y).toBeCloseTo(0);
  });

  /*
   * SVG (0, 600) corresponds to math (-10, -10).
   */
  it('should map SVG bottom-left to math bottom-left', () => {
    const result = svgToMath({ x: 0, y: 600 }, viewport);
    expect(result.x).toBeCloseTo(-10);
    expect(result.y).toBeCloseTo(-10);
  });
});

describe('round-trip conversions', () => {
  /*
   * Converting a math point to SVG then back to math should return
   * the original point (within floating-point tolerance).
   */
  it('should return the original point after mathToSvg → svgToMath', () => {
    const original = { x: 3.7, y: -2.5 };
    const svg = mathToSvg(original, viewport);
    const result = svgToMath(svg, viewport);
    expect(result.x).toBeCloseTo(original.x);
    expect(result.y).toBeCloseTo(original.y);
  });

  /*
   * Converting an SVG point to math then back to SVG should return
   * the original SVG point (within floating-point tolerance).
   */
  it('should return the original SVG point after svgToMath → mathToSvg', () => {
    const original = { x: 250, y: 150 };
    const math = svgToMath(original, viewport);
    const result = mathToSvg(math, viewport);
    expect(result.x).toBeCloseTo(original.x);
    expect(result.y).toBeCloseTo(original.y);
  });

  /*
   * Round-trip should also hold for an asymmetric viewport where
   * xMin ≠ -xMax or yMin ≠ -yMax.
   */
  it('should handle an asymmetric viewport correctly', () => {
    const asymViewport: Viewport = {
      xMin: -5,
      xMax: 15,
      yMin: -2,
      yMax: 8,
      width: 1000,
      height: 500,
    };
    const original = { x: 7, y: 3 };
    const svg = mathToSvg(original, asymViewport);
    const result = svgToMath(svg, asymViewport);
    expect(result.x).toBeCloseTo(original.x);
    expect(result.y).toBeCloseTo(original.y);
  });
});
