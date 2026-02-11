/**
 * Exercise type definitions
 *
 * Types for reusable learning module exercises with fill-in-the-blank steps.
 */

import type { VertexFormParams } from './parabola';

/** A single blank (gap) in a fill-in-the-blanks exercise. */
export interface ExerciseBlank {
  readonly id: string;
  readonly correctAnswer: number;
  readonly tolerance?: number;
  readonly label?: string;
}

/** A single exercise step. */
export interface ExerciseStep {
  readonly id: string;
  readonly instruction: string;
  readonly explanation: string;
  readonly template: string;
  readonly blanks: readonly ExerciseBlank[];
  readonly hint?: string;
}

/** A complete exercise consisting of multiple steps. */
export interface Exercise {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly steps: readonly ExerciseStep[];
  readonly parabolaParams?: VertexFormParams;
}

/** Possible states for an exercise answer. */
export type AnswerState = 'empty' | 'correct' | 'incorrect' | 'hint-shown';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type TransformationType = 'shift' | 'stretch' | 'reflect';

export type Module3Category = 'expanding' | 'factoring' | 'rearranging';
