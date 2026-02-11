/**
 * useProgress.ts - Hook for accessing and managing progress
 *
 * Provides convenient access to the ProgressContext and computed values
 * like module-specific progress and completion percentages.
 */

import { useContext } from 'react';
import { ProgressContext, ProgressContextValue } from '../context/ProgressContext';
import { ModuleProgress } from '../types/progress';

/**
 * Hook to access the progress context.
 *
 * Throws an error if used outside of a ProgressProvider.
 */
export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}

/**
 * Gets progress data for a specific module.
 *
 * Returns undefined if the module has no recorded progress yet.
 */
export function getModuleProgress(
  progress: ProgressContextValue['progress'],
  moduleId: string
): ModuleProgress | undefined {
  return progress.modules[moduleId];
}

/**
 * Computes the completion percentage for a module.
 *
 * @param moduleProgress - The module's progress data
 * @param totalExercises - Total number of exercises available in the module
 * @returns Percentage (0-100) of exercises completed
 */
export function getModuleCompletionPercentage(
  moduleProgress: ModuleProgress | undefined,
  totalExercises: number
): number {
  if (!moduleProgress || totalExercises === 0) {
    return 0;
  }
  return Math.min(100, Math.round((moduleProgress.exercisesCompleted / totalExercises) * 100));
}

/**
 * Computes the first-try success rate for a module.
 *
 * @param moduleProgress - The module's progress data
 * @returns Percentage (0-100) of exercises solved correctly on first try
 */
export function getModuleSuccessRate(moduleProgress: ModuleProgress | undefined): number {
  if (!moduleProgress || moduleProgress.exercisesCompleted === 0) {
    return 0;
  }
  return Math.round((moduleProgress.exercisesCorrectFirstTry / moduleProgress.exercisesCompleted) * 100);
}
