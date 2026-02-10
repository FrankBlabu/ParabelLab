/**
 * Tests for parabola equation formatting utilities
 *
 * Validates formatVertexForm and formatNormalForm for standard cases and
 * special-case handling: a = 1 / -1 (omitting coefficients), d = 0
 * (simplified squared term), e / c = 0 (omitting constant), and correct
 * sign presentation for negative parameters.
 */

import { describe, it, expect } from 'vitest';
import { formatVertexForm, formatNormalForm } from '../../src/utils/formatting';

describe('formatVertexForm', () => {
  /*
   * Standard case: f(x) = 2(x - 3)² + 1
   */
  it('should format a standard vertex form', () => {
    expect(formatVertexForm({ a: 2, d: 3, e: 1 })).toBe('f(x) = 2(x - 3)² + 1');
  });

  /*
   * a = 1: coefficient should be omitted → "f(x) = (x - 3)² + 1"
   */
  it('should omit coefficient when a = 1', () => {
    expect(formatVertexForm({ a: 1, d: 3, e: 1 })).toBe('f(x) = (x - 3)² + 1');
  });

  /*
   * a = -1: show minus sign without "1" → "f(x) = -(x - 3)² + 1"
   */
  it('should show minus without 1 when a = -1', () => {
    expect(formatVertexForm({ a: -1, d: 3, e: 1 })).toBe('f(x) = -(x - 3)² + 1');
  });

  /*
   * d = 0: simplify to "x²" → "f(x) = x²"
   */
  it('should simplify when d = 0', () => {
    expect(formatVertexForm({ a: 1, d: 0, e: 0 })).toBe('f(x) = x²');
  });

  /*
   * e = 0: omit the constant term → "f(x) = 2(x - 3)²"
   */
  it('should omit constant when e = 0', () => {
    expect(formatVertexForm({ a: 2, d: 3, e: 0 })).toBe('f(x) = 2(x - 3)²');
  });

  /*
   * Negative d: (x + 2)² for d = -2
   */
  it('should show plus sign inside parentheses for negative d', () => {
    expect(formatVertexForm({ a: 1, d: -2, e: 0 })).toBe('f(x) = (x + 2)²');
  });

  /*
   * Negative e: "f(x) = x² - 4"
   */
  it('should show minus sign for negative e', () => {
    expect(formatVertexForm({ a: 1, d: 0, e: -4 })).toBe('f(x) = x² - 4');
  });

  /*
   * Combined special case: a = -1, d = -2, e = 0
   */
  it('should handle a = -1 with negative d and zero e', () => {
    expect(formatVertexForm({ a: -1, d: -2, e: 0 })).toBe('f(x) = -(x + 2)²');
  });
});

describe('formatNormalForm', () => {
  /*
   * Standard case: f(x) = 2x² - 12x + 19
   */
  it('should format a standard normal form', () => {
    expect(formatNormalForm({ a: 2, b: -12, c: 19 })).toBe('f(x) = 2x² - 12x + 19');
  });

  /*
   * a = 1: omit coefficient → "f(x) = x² + 2x + 1"
   */
  it('should omit coefficient when a = 1', () => {
    expect(formatNormalForm({ a: 1, b: 2, c: 1 })).toBe('f(x) = x² + 2x + 1');
  });

  /*
   * a = -1: show "-x²" → "f(x) = -x² + 4x - 7"
   */
  it('should show -x² when a = -1', () => {
    expect(formatNormalForm({ a: -1, b: 4, c: -7 })).toBe('f(x) = -x² + 4x - 7');
  });

  /*
   * b = 0, c = 0: "f(x) = x²"
   */
  it('should simplify when b and c are zero', () => {
    expect(formatNormalForm({ a: 1, b: 0, c: 0 })).toBe('f(x) = x²');
  });

  /*
   * b = 1: omit coefficient on x term → "f(x) = x² + x"
   */
  it('should omit coefficient when b = 1', () => {
    expect(formatNormalForm({ a: 1, b: 1, c: 0 })).toBe('f(x) = x² + x');
  });

  /*
   * b = -1: show "- x" without "1" → "f(x) = x² - x"
   */
  it('should omit coefficient when b = -1', () => {
    expect(formatNormalForm({ a: 1, b: -1, c: 0 })).toBe('f(x) = x² - x');
  });

  /*
   * Negative c: "f(x) = x² - 5"
   */
  it('should show minus sign for negative c', () => {
    expect(formatNormalForm({ a: 1, b: 0, c: -5 })).toBe('f(x) = x² - 5');
  });
});
