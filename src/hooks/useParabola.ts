/**
 * useParabola hook
 *
 * Manages state for parabola parameters in vertex form and provides derived
 * values (normal form, vertex point). Provides setter functions for individual
 * parameters and a reset function to restore defaults.
 */

import { useState, useMemo } from 'react';
import type { VertexFormParams, NormalFormParams, Point } from '../types/parabola';
import { vertexToNormal } from '../engine/conversion';
import { computeVertex } from '../engine/parabola';

/**
 * Default parabola parameters: f(x) = x² (a=1, d=0, e=0)
 */
const DEFAULT_PARAMS: VertexFormParams = {
  a: 1,
  d: 0,
  e: 0,
};

export interface UseParabolaResult {
  /** Current vertex form parameters */
  readonly vertexForm: VertexFormParams;
  /** Derived normal form parameters */
  readonly normalForm: NormalFormParams;
  /** Derived vertex point */
  readonly vertex: Point;
  /** Update parameter 'a' (stretch/compression/reflection) */
  readonly setA: (value: number) => void;
  /** Update parameter 'd' (horizontal shift) */
  readonly setD: (value: number) => void;
  /** Update parameter 'e' (vertical shift) */
  readonly setE: (value: number) => void;
  /** Reset all parameters to defaults */
  readonly reset: () => void;
}

/**
 * Custom hook for managing parabola state and derived values.
 *
 * Maintains vertex form parameters as state and automatically computes:
 * - Normal form via conversion
 * - Vertex point
 *
 * Provides individual setters for each parameter plus a reset function.
 */
export function useParabola(): UseParabolaResult {
  const [vertexForm, setVertexForm] = useState<VertexFormParams>(DEFAULT_PARAMS);

  // Derive normal form (memoized to avoid recomputation on every render)
  // Handle a=0 case gracefully to avoid crashes
  const normalForm = useMemo<NormalFormParams>(() => {
    if (vertexForm.a === 0) {
      // Return a safe fallback for a=0 (degenerate case)
      return { a: 0, b: 0, c: 0 };
    }
    return vertexToNormal(vertexForm);
  }, [vertexForm]);

  // Derive vertex point
  const vertex = useMemo<Point>(() => {
    return computeVertex(vertexForm);
  }, [vertexForm]);

  // Setter for parameter 'a'
  const setA = (value: number): void => {
    setVertexForm((prev) => ({ ...prev, a: value }));
  };

  // Setter for parameter 'd'
  const setD = (value: number): void => {
    setVertexForm((prev) => ({ ...prev, d: value }));
  };

  // Setter for parameter 'e'
  const setE = (value: number): void => {
    setVertexForm((prev) => ({ ...prev, e: value }));
  };

  // Reset to default parameters
  const reset = (): void => {
    setVertexForm(DEFAULT_PARAMS);
  };

  return {
    vertexForm,
    normalForm,
    vertex,
    setA,
    setD,
    setE,
    reset,
  };
}
