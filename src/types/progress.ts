/**
 * progress.ts - Types for progress tracking and persistence
 *
 * Defines the data model for tracking student progress across learning modules,
 * including exercise completion counts, last difficulty level, and timestamps.
 */

import { Difficulty } from './exercise';

/**
 * Progress data for a single module.
 *
 * Tracks how many exercises the student has completed in this module,
 * how many were solved correctly on the first attempt, and when they
 * last practiced this module.
 */
export interface ModuleProgress {
  readonly moduleId: string;
  readonly exercisesCompleted: number;
  readonly exercisesCorrectFirstTry: number;
  readonly lastDifficulty: Difficulty;
  readonly lastAttemptDate: string; // ISO date string
}

/**
 * Overall application progress state.
 *
 * Contains progress data for all modules and global statistics like
 * total exercises completed and first/last visit dates.
 */
export interface AppProgress {
  readonly modules: Record<string, ModuleProgress>;
  readonly totalExercisesCompleted: number;
  readonly firstVisitDate: string; // ISO date string
  readonly lastVisitDate: string; // ISO date string
}
