/**
 * Parabola type definitions
 *
 * Core mathematical types for representing parabolas in vertex form and
 * normal form, along with supporting types for points and validation results.
 * These types form the foundation of the math engine used across the
 * explorer and all learning modules.
 */

/**
 * Parameters for the vertex form of a parabola: f(x) = a(x - d)² + e
 *
 * The vertex (Scheitelpunkt) is located at S(d | e).
 * - `a` controls the opening width and direction (a > 0 opens upward, a < 0 downward).
 *   Must not be zero (degenerate case — not a parabola).
 * - `d` is the x-coordinate of the vertex (horizontal shift).
 * - `e` is the y-coordinate of the vertex (vertical shift).
 */
export interface VertexFormParams {
  readonly a: number;
  readonly d: number;
  readonly e: number;
}

/**
 * Parameters for the normal (standard) form of a parabola: f(x) = ax² + bx + c
 *
 * - `a` controls the opening width and direction (must not be zero).
 * - `b` is the linear coefficient.
 * - `c` is the constant term (y-intercept).
 */
export interface NormalFormParams {
  readonly a: number;
  readonly b: number;
  readonly c: number;
}

/**
 * A point in 2D Cartesian space.
 */
export interface Point {
  readonly x: number;
  readonly y: number;
}

/**
 * Complete parabola data combining both representation forms and the vertex.
 */
export interface ParabolaData {
  readonly vertexForm: VertexFormParams;
  readonly normalForm: NormalFormParams;
  readonly vertex: Point;
}

/**
 * Result of a parameter validation check.
 *
 * - `valid`: whether the parameters passed all checks.
 * - `errors`: human-readable list of problems found (empty when valid).
 */
export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

/**
 * Sensible default bounds for interactive parameter sliders.
 */
export const PARAMETER_BOUNDS = {
  a: { min: -5, max: 5 },
  d: { min: -10, max: 10 },
  e: { min: -10, max: 10 },
} as const;
