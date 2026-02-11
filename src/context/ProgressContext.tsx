/**
 * ProgressContext.tsx - React Context for progress tracking
 *
 * Provides app-wide access to student progress data and functions to update it.
 * Automatically saves progress to localStorage on every update.
 */

import { createContext, useState, useEffect, ReactNode } from 'react';
import type { JSX } from 'react';
import { AppProgress, ModuleProgress } from '../types/progress';
import { Difficulty } from '../types/exercise';
import { loadProgress, saveProgress, resetProgress as resetStoredProgress } from '../utils/storage';

/**
 * Shape of the ProgressContext value.
 */
export interface ProgressContextValue {
  progress: AppProgress;
  recordExerciseCompletion: (moduleId: string, difficulty: Difficulty, correctFirstTry: boolean) => void;
  resetProgress: () => void;
}

/**
 * React Context providing progress state and update functions.
 */
export const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

/**
 * Props for the ProgressProvider component.
 */
interface ProgressProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps the app and provides progress state.
 *
 * Loads initial progress from localStorage and auto-saves on every update.
 */
export function ProgressProvider({ children }: ProgressProviderProps): JSX.Element {
  const [progress, setProgress] = useState<AppProgress>(() => loadProgress());

  // Auto-save to localStorage whenever progress changes
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  /**
   * Records that a student completed an exercise in a specific module.
   *
   * Updates the module's exercise count, tracks first-try correctness,
   * and updates timestamps.
   */
  const recordExerciseCompletion = (
    moduleId: string,
    difficulty: Difficulty,
    correctFirstTry: boolean
  ): void => {
    setProgress((prev) => {
      const now = new Date().toISOString();

      // Get existing module progress or create new
      const existingModule = prev.modules[moduleId];
      const updatedModule: ModuleProgress = {
        moduleId,
        exercisesCompleted: (existingModule?.exercisesCompleted ?? 0) + 1,
        exercisesCorrectFirstTry:
          (existingModule?.exercisesCorrectFirstTry ?? 0) + (correctFirstTry ? 1 : 0),
        lastDifficulty: difficulty,
        lastAttemptDate: now,
      };

      return {
        modules: {
          ...prev.modules,
          [moduleId]: updatedModule,
        },
        totalExercisesCompleted: prev.totalExercisesCompleted + 1,
        firstVisitDate: prev.firstVisitDate,
        lastVisitDate: now,
      };
    });
  };

  /**
   * Resets all progress data to defaults.
   *
   * Clears localStorage and resets the in-memory state.
   */
  const resetProgress = (): void => {
    resetStoredProgress();
    const now = new Date().toISOString();
    setProgress({
      modules: {},
      totalExercisesCompleted: 0,
      firstVisitDate: now,
      lastVisitDate: now,
    });
  };

  return (
    <ProgressContext.Provider value={{ progress, recordExerciseCompletion, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}
