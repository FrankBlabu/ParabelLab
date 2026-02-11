/**
 * storage.test.ts - Tests for LocalStorage utilities
 *
 * Tests the save, load, and reset functions for progress persistence,
 * including error handling for corrupted data and storage failures.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadProgress, saveProgress, resetProgress } from '../../src/utils/storage';
import type { AppProgress } from '../../src/types/progress';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
});

describe('storage utilities', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('loadProgress', () => {
    /**
     * Test: Returns default progress when no data exists
     *
     * Expected outcome: loadProgress() should return a default AppProgress
     * object with empty modules and zero exercises completed when localStorage
     * is empty.
     */
    it('should return default progress when no data exists', () => {
      const progress = loadProgress();

      expect(progress).toBeDefined();
      expect(progress.modules).toEqual({});
      expect(progress.totalExercisesCompleted).toBe(0);
      expect(progress.firstVisitDate).toBeDefined();
      expect(progress.lastVisitDate).toBeDefined();
    });

    /**
     * Test: Returns saved progress when valid data exists
     *
     * Expected outcome: loadProgress() should correctly deserialize and return
     * the AppProgress object that was previously saved to localStorage.
     */
    it('should return saved progress when valid data exists', () => {
      const mockProgress: AppProgress = {
        modules: {
          module1: {
            moduleId: 'module1',
            exercisesCompleted: 5,
            exercisesCorrectFirstTry: 3,
            lastDifficulty: 'medium',
            lastAttemptDate: '2026-02-11T10:00:00Z',
          },
        },
        totalExercisesCompleted: 5,
        firstVisitDate: '2026-02-10T08:00:00Z',
        lastVisitDate: '2026-02-11T10:00:00Z',
      };

      saveProgress(mockProgress);
      const loaded = loadProgress();

      expect(loaded).toEqual(mockProgress);
    });

    /**
     * Test: Returns default progress when data is corrupted
     *
     * Expected outcome: When localStorage contains invalid JSON or malformed
     * data, loadProgress() should gracefully return default progress instead
     * of throwing an error.
     */
    it('should return default progress when data is corrupted', () => {
      // Set invalid JSON
      localStorageMock.setItem('parabellab-progress', 'invalid json');

      const progress = loadProgress();

      expect(progress).toBeDefined();
      expect(progress.modules).toEqual({});
      expect(progress.totalExercisesCompleted).toBe(0);
    });

    /**
     * Test: Returns default progress when data structure is invalid
     *
     * Expected outcome: When localStorage contains valid JSON but with an
     * invalid structure (missing or wrong-typed fields), loadProgress()
     * should return default progress.
     */
    it('should return default progress when data structure is invalid', () => {
      const invalidData = {
        modules: 'not an object',
        totalExercisesCompleted: 'not a number',
      };

      localStorageMock.setItem('parabellab-progress', JSON.stringify(invalidData));

      const progress = loadProgress();

      expect(progress).toBeDefined();
      expect(progress.modules).toEqual({});
      expect(progress.totalExercisesCompleted).toBe(0);
    });
  });

  describe('saveProgress', () => {
    /**
     * Test: Saves progress to localStorage
     *
     * Expected outcome: saveProgress() should serialize the AppProgress
     * object to JSON and store it in localStorage under the correct key.
     */
    it('should save progress to localStorage', () => {
      const progress: AppProgress = {
        modules: {
          module1: {
            moduleId: 'module1',
            exercisesCompleted: 10,
            exercisesCorrectFirstTry: 8,
            lastDifficulty: 'hard',
            lastAttemptDate: '2026-02-11T12:00:00Z',
          },
        },
        totalExercisesCompleted: 10,
        firstVisitDate: '2026-02-10T08:00:00Z',
        lastVisitDate: '2026-02-11T12:00:00Z',
      };

      saveProgress(progress);

      const stored = localStorageMock.getItem('parabellab-progress');
      expect(stored).toBeDefined();
      expect(JSON.parse(stored!)).toEqual(progress);
    });

    /**
     * Test: Handles storage quota exceeded gracefully
     *
     * Expected outcome: When localStorage.setItem throws an error (e.g., quota
     * exceeded), saveProgress() should not crash but log a warning and continue.
     */
    it('should handle storage quota exceeded gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const setItemSpy = vi.spyOn(localStorageMock, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const progress: AppProgress = {
        modules: {},
        totalExercisesCompleted: 0,
        firstVisitDate: '2026-02-11T10:00:00Z',
        lastVisitDate: '2026-02-11T10:00:00Z',
      };

      // Should not throw
      expect(() => saveProgress(progress)).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();

      setItemSpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  describe('resetProgress', () => {
    /**
     * Test: Removes progress from localStorage
     *
     * Expected outcome: resetProgress() should delete the progress data from
     * localStorage, and subsequent loadProgress() calls should return default
     * progress.
     */
    it('should remove progress from localStorage', () => {
      const progress: AppProgress = {
        modules: {
          module1: {
            moduleId: 'module1',
            exercisesCompleted: 5,
            exercisesCorrectFirstTry: 3,
            lastDifficulty: 'medium',
            lastAttemptDate: '2026-02-11T10:00:00Z',
          },
        },
        totalExercisesCompleted: 5,
        firstVisitDate: '2026-02-10T08:00:00Z',
        lastVisitDate: '2026-02-11T10:00:00Z',
      };

      saveProgress(progress);
      expect(localStorageMock.getItem('parabellab-progress')).toBeDefined();

      resetProgress();
      expect(localStorageMock.getItem('parabellab-progress')).toBeNull();

      const loaded = loadProgress();
      expect(loaded.totalExercisesCompleted).toBe(0);
      expect(loaded.modules).toEqual({});
    });
  });

  describe('round-trip', () => {
    /**
     * Test: Save and load preserves data
     *
     * Expected outcome: Data saved via saveProgress() and loaded via loadProgress()
     * should be identical (round-trip integrity).
     */
    it('should preserve data through save and load cycle', () => {
      const original: AppProgress = {
        modules: {
          module1: {
            moduleId: 'module1',
            exercisesCompleted: 3,
            exercisesCorrectFirstTry: 2,
            lastDifficulty: 'easy',
            lastAttemptDate: '2026-02-11T09:00:00Z',
          },
          module2: {
            moduleId: 'module2',
            exercisesCompleted: 7,
            exercisesCorrectFirstTry: 5,
            lastDifficulty: 'medium',
            lastAttemptDate: '2026-02-11T10:00:00Z',
          },
        },
        totalExercisesCompleted: 10,
        firstVisitDate: '2026-02-10T08:00:00Z',
        lastVisitDate: '2026-02-11T10:00:00Z',
      };

      saveProgress(original);
      const loaded = loadProgress();

      expect(loaded).toEqual(original);
    });
  });
});
