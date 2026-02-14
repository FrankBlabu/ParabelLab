/**
 * storage.ts - LocalStorage utilities for progress persistence
 *
 * Handles saving, loading, and resetting student progress data in localStorage.
 * Includes graceful error handling for corrupted data, storage quota exceeded,
 * and private browsing mode.
 */

import { AppProgress } from '../types/progress';

const STORAGE_KEY = 'parabola-progress';

/**
 * Creates a default empty progress state.
 *
 * Used when no saved progress exists or when data is corrupted.
 */
function createDefaultProgress(): AppProgress {
  const now = new Date().toISOString();
  return {
    modules: {},
    totalExercisesCompleted: 0,
    firstVisitDate: now,
    lastVisitDate: now,
  };
}

/**
 * Validates that the loaded data matches the AppProgress structure.
 *
 * Returns true if the data is a valid AppProgress object, false otherwise.
 */
function isValidProgress(data: unknown): data is AppProgress {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const progress = data as Record<string, unknown>;

  // Check required fields
  if (
    typeof progress.totalExercisesCompleted !== 'number' ||
    typeof progress.firstVisitDate !== 'string' ||
    typeof progress.lastVisitDate !== 'string' ||
    typeof progress.modules !== 'object' ||
    progress.modules === null
  ) {
    return false;
  }

  // Validate each module entry
  const modules = progress.modules as Record<string, unknown>;
  for (const moduleData of Object.values(modules)) {
    if (typeof moduleData !== 'object' || moduleData === null) {
      return false;
    }

    const module = moduleData as Record<string, unknown>;
    if (
      typeof module.moduleId !== 'string' ||
      typeof module.exercisesCompleted !== 'number' ||
      typeof module.exercisesCorrectFirstTry !== 'number' ||
      typeof module.lastDifficulty !== 'string' ||
      typeof module.lastAttemptDate !== 'string'
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Loads progress from localStorage.
 *
 * Returns saved progress if it exists and is valid, otherwise returns
 * default progress. Never throws — handles corrupted data gracefully.
 */
export function loadProgress(): AppProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return createDefaultProgress();
    }

    const parsed = JSON.parse(stored);
    if (isValidProgress(parsed)) {
      return parsed;
    }

    // Data exists but is invalid — reset to defaults
    console.warn('Invalid progress data found in localStorage, resetting to defaults');
    return createDefaultProgress();
  } catch (error) {
    // JSON parse error or localStorage read error
    console.warn('Failed to load progress from localStorage:', error);
    return createDefaultProgress();
  }
}

/**
 * Saves progress to localStorage.
 *
 * If storage quota is exceeded, logs a warning but does not throw.
 * The app continues to function without persistence.
 */
export function saveProgress(progress: AppProgress): void {
  try {
    const serialized = JSON.stringify(progress);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    // Storage quota exceeded or other error
    console.warn('Failed to save progress to localStorage:', error);
    // Don't throw — the app should continue working even if persistence fails
  }
}

/**
 * Resets progress by removing all saved data from localStorage.
 *
 * After calling this, loadProgress() will return default progress.
 */
export function resetProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to reset progress in localStorage:', error);
  }
}
