/**
 * useParabola hook tests
 *
 * Tests for the custom hook that manages parabola state and derived values.
 * Covers:
 * - Initial state with default parameters
 * - Individual parameter updates (a, d, e)
 * - Normal form conversion correctness
 * - Vertex computation
 * - Reset functionality
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useParabola } from '../../src/hooks/useParabola';

describe('useParabola', () => {
  /**
   * Test: Initial state contains default parameters
   *
   * Verifies that the hook initializes with a=1, d=0, e=0,
   * which represents the parabola f(x) = x².
   */
  it('initializes with default parameters a=1, d=0, e=0', () => {
    const { result } = renderHook(() => useParabola());

    expect(result.current.vertexForm).toEqual({
      a: 1,
      d: 0,
      e: 0,
    });
  });

  /**
   * Test: Setting parameter 'd' updates vertex form
   *
   * Verifies that calling setD updates the 'd' parameter while
   * leaving 'a' and 'e' unchanged.
   */
  it('updates parameter d when setD is called', () => {
    const { result } = renderHook(() => useParabola());

    act(() => {
      result.current.setD(3);
    });

    expect(result.current.vertexForm).toEqual({
      a: 1,
      d: 3,
      e: 0,
    });
  });

  /**
   * Test: Setting parameter 'a' updates vertex form
   *
   * Verifies that calling setA updates the 'a' parameter while
   * leaving 'd' and 'e' unchanged.
   */
  it('updates parameter a when setA is called', () => {
    const { result } = renderHook(() => useParabola());

    act(() => {
      result.current.setA(2);
    });

    expect(result.current.vertexForm).toEqual({
      a: 2,
      d: 0,
      e: 0,
    });
  });

  /**
   * Test: Setting parameter 'e' updates vertex form
   *
   * Verifies that calling setE updates the 'e' parameter while
   * leaving 'a' and 'd' unchanged.
   */
  it('updates parameter e when setE is called', () => {
    const { result } = renderHook(() => useParabola());

    act(() => {
      result.current.setE(-4);
    });

    expect(result.current.vertexForm).toEqual({
      a: 1,
      d: 0,
      e: -4,
    });
  });

  /**
   * Test: Normal form is correctly derived from vertex form
   *
   * Verifies that the hook correctly converts vertex form to normal form.
   * For f(x) = 2(x - 3)² + 1:
   * - Vertex form: a=2, d=3, e=1
   * - Normal form: a=2, b=-12, c=19
   */
  it('correctly converts vertex form to normal form', () => {
    const { result } = renderHook(() => useParabola());

    act(() => {
      result.current.setA(2);
      result.current.setD(3);
      result.current.setE(1);
    });

    // For f(x) = 2(x - 3)² + 1:
    // Expanded: 2(x² - 6x + 9) + 1 = 2x² - 12x + 18 + 1 = 2x² - 12x + 19
    expect(result.current.normalForm).toEqual({
      a: 2,
      b: -12,
      c: 19,
    });
  });

  /**
   * Test: Vertex point is correctly computed
   *
   * Verifies that the hook correctly computes the vertex point.
   * The vertex of f(x) = a(x - d)² + e is at S(d | e).
   */
  it('correctly computes vertex point', () => {
    const { result } = renderHook(() => useParabola());

    act(() => {
      result.current.setD(5);
      result.current.setE(-3);
    });

    expect(result.current.vertex).toEqual({
      x: 5,
      y: -3,
    });
  });

  /**
   * Test: Reset restores default parameters
   *
   * Verifies that calling reset() restores all parameters to
   * their default values (a=1, d=0, e=0).
   */
  it('resets to default parameters when reset is called', () => {
    const { result } = renderHook(() => useParabola());

    // Change parameters
    act(() => {
      result.current.setA(3);
      result.current.setD(-2);
      result.current.setE(5);
    });

    // Verify they changed
    expect(result.current.vertexForm).toEqual({
      a: 3,
      d: -2,
      e: 5,
    });

    // Reset
    act(() => {
      result.current.reset();
    });

    // Verify back to defaults
    expect(result.current.vertexForm).toEqual({
      a: 1,
      d: 0,
      e: 0,
    });
  });

  /**
   * Test: Multiple parameter updates work correctly
   *
   * Verifies that multiple sequential parameter updates all work
   * correctly and the derived values update accordingly.
   */
  it('handles multiple parameter updates correctly', () => {
    const { result } = renderHook(() => useParabola());

    act(() => {
      result.current.setA(-1);
    });

    expect(result.current.vertexForm.a).toBe(-1);

    act(() => {
      result.current.setD(2);
    });

    expect(result.current.vertexForm.d).toBe(2);

    act(() => {
      result.current.setE(3);
    });

    expect(result.current.vertexForm).toEqual({
      a: -1,
      d: 2,
      e: 3,
    });

    // Normal form for f(x) = -(x - 2)² + 3
    // = -(x² - 4x + 4) + 3 = -x² + 4x - 4 + 3 = -x² + 4x - 1
    expect(result.current.normalForm).toEqual({
      a: -1,
      b: 4,
      c: -1,
    });
  });
});
