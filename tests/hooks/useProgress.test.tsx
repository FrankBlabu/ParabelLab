/**
 * useProgress.test.ts - Tests for progress tracking hook
 *
 * Tests the useProgress hook, helper functions, and ProgressContext integration.
 * Verifies that exercise completions are recorded correctly and progress persists
 * across component remounts.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import type { ReactNode, JSX } from 'react';
import { ProgressProvider } from '../../src/context/ProgressContext';
import {
  useProgress,
  getModuleProgress,
  getModuleCompletionPercentage,
  getModuleSuccessRate,
} from '../../src/hooks/useProgress';
import type { AppProgress, ModuleProgress } from '../../src/types/progress';

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

/**
 * Wrapper component for testing the ProgressProvider
 */
function wrapper({ children }: { children: ReactNode }): JSX.Element {
  return <ProgressProvider>{children}</ProgressProvider>;
}

describe('useProgress hook', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  /**
   * Test: Initial state has no progress
   *
   * Expected outcome: When the app first loads with no saved data, the progress
   * object should have zero exercises completed and an empty modules object.
   */
  it('should have initial state with no progress', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });

    expect(result.current.progress.totalExercisesCompleted).toBe(0);
    expect(result.current.progress.modules).toEqual({});
  });

  /**
   * Test: Records exercise completion
   *
   * Expected outcome: Calling recordExerciseCompletion should increment the
   * module's exercise count and the total exercise count.
   */
  it('should record exercise completion', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });

    act(() => {
      result.current.recordExerciseCompletion('module1', 'easy', true);
    });

    expect(result.current.progress.totalExercisesCompleted).toBe(1);
    expect(result.current.progress.modules.module1).toBeDefined();
    expect(result.current.progress.modules.module1.exercisesCompleted).toBe(1);
    expect(result.current.progress.modules.module1.exercisesCorrectFirstTry).toBe(1);
  });

  /**
   * Test: Records multiple completions
   *
   * Expected outcome: Multiple exercise completions should accumulate correctly,
   * incrementing the counts each time.
   */
  it('should record multiple completions', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });

    act(() => {
      result.current.recordExerciseCompletion('module1', 'easy', true);
      result.current.recordExerciseCompletion('module1', 'medium', false);
      result.current.recordExerciseCompletion('module1', 'hard', true);
    });

    expect(result.current.progress.totalExercisesCompleted).toBe(3);
    expect(result.current.progress.modules.module1.exercisesCompleted).toBe(3);
    expect(result.current.progress.modules.module1.exercisesCorrectFirstTry).toBe(2);
    expect(result.current.progress.modules.module1.lastDifficulty).toBe('hard');
  });

  /**
   * Test: Tracks multiple modules independently
   *
   * Expected outcome: Exercise completions in different modules should be
   * tracked independently with separate counts per module.
   */
  it('should track multiple modules independently', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });

    act(() => {
      result.current.recordExerciseCompletion('module1', 'easy', true);
      result.current.recordExerciseCompletion('module2', 'medium', true);
      result.current.recordExerciseCompletion('module1', 'easy', false);
    });

    expect(result.current.progress.totalExercisesCompleted).toBe(3);
    expect(result.current.progress.modules.module1.exercisesCompleted).toBe(2);
    expect(result.current.progress.modules.module2.exercisesCompleted).toBe(1);
    expect(result.current.progress.modules.module1.exercisesCorrectFirstTry).toBe(1);
    expect(result.current.progress.modules.module2.exercisesCorrectFirstTry).toBe(1);
  });

  /**
   * Test: Resets progress
   *
   * Expected outcome: Calling resetProgress should clear all module data
   * and reset the total exercise count to zero.
   */
  it('should reset progress', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });

    act(() => {
      result.current.recordExerciseCompletion('module1', 'easy', true);
      result.current.recordExerciseCompletion('module2', 'medium', true);
    });

    expect(result.current.progress.totalExercisesCompleted).toBe(2);

    act(() => {
      result.current.resetProgress();
    });

    expect(result.current.progress.totalExercisesCompleted).toBe(0);
    expect(result.current.progress.modules).toEqual({});
  });

  /**
   * Test: Persists progress across remount
   *
   * Expected outcome: Progress saved before unmounting the component should
   * be loaded correctly when the component is remounted (simulating page refresh).
   */
  it('should persist progress across remount', async () => {
    const { result, unmount } = renderHook(() => useProgress(), { wrapper });

    act(() => {
      result.current.recordExerciseCompletion('module1', 'medium', true);
    });

    // Wait for localStorage to be updated
    await waitFor(() => {
      expect(localStorageMock.getItem('parabellab-progress')).toBeTruthy();
    });

    unmount();

    // Remount with fresh hook
    const { result: newResult } = renderHook(() => useProgress(), { wrapper });

    expect(newResult.current.progress.totalExercisesCompleted).toBe(1);
    expect(newResult.current.progress.modules.module1.exercisesCompleted).toBe(1);
  });

  /**
   * Test: Throws error when used outside ProgressProvider
   *
   * Expected outcome: useProgress should throw an error with a helpful message
   * if it's used in a component that's not wrapped in a ProgressProvider.
   */
  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleError = console.error;
    console.error = () => {};

    expect(() => {
      renderHook(() => useProgress());
    }).toThrow('useProgress must be used within a ProgressProvider');

    console.error = consoleError;
  });
});

describe('getModuleProgress', () => {
  /**
   * Test: Returns module progress when it exists
   *
   * Expected outcome: getModuleProgress should return the ModuleProgress object
   * for a module that has recorded progress.
   */
  it('should return module progress when it exists', () => {
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

    const moduleProgress = getModuleProgress(progress, 'module1');

    expect(moduleProgress).toBeDefined();
    expect(moduleProgress?.exercisesCompleted).toBe(5);
    expect(moduleProgress?.exercisesCorrectFirstTry).toBe(3);
  });

  /**
   * Test: Returns undefined when module has no progress
   *
   * Expected outcome: getModuleProgress should return undefined for a module
   * that hasn't been practiced yet.
   */
  it('should return undefined when module has no progress', () => {
    const progress: AppProgress = {
      modules: {},
      totalExercisesCompleted: 0,
      firstVisitDate: '2026-02-10T08:00:00Z',
      lastVisitDate: '2026-02-11T10:00:00Z',
    };

    const moduleProgress = getModuleProgress(progress, 'module1');

    expect(moduleProgress).toBeUndefined();
  });
});

describe('getModuleCompletionPercentage', () => {
  /**
   * Test: Calculates percentage correctly
   *
   * Expected outcome: getModuleCompletionPercentage should return the correct
   * percentage based on exercises completed vs total available.
   */
  it('should calculate percentage correctly', () => {
    const moduleProgress: ModuleProgress = {
      moduleId: 'module1',
      exercisesCompleted: 5,
      exercisesCorrectFirstTry: 3,
      lastDifficulty: 'medium',
      lastAttemptDate: '2026-02-11T10:00:00Z',
    };

    const percentage = getModuleCompletionPercentage(moduleProgress, 10);

    expect(percentage).toBe(50);
  });

  /**
   * Test: Returns 0 when no progress
   *
   * Expected outcome: When module progress is undefined, the completion
   * percentage should be 0.
   */
  it('should return 0 when no progress', () => {
    const percentage = getModuleCompletionPercentage(undefined, 10);

    expect(percentage).toBe(0);
  });

  /**
   * Test: Returns 0 when total is 0
   *
   * Expected outcome: When total exercises is 0 (edge case), the percentage
   * should be 0 to avoid division by zero.
   */
  it('should return 0 when total is 0', () => {
    const moduleProgress: ModuleProgress = {
      moduleId: 'module1',
      exercisesCompleted: 5,
      exercisesCorrectFirstTry: 3,
      lastDifficulty: 'medium',
      lastAttemptDate: '2026-02-11T10:00:00Z',
    };

    const percentage = getModuleCompletionPercentage(moduleProgress, 0);

    expect(percentage).toBe(0);
  });

  /**
   * Test: Caps at 100%
   *
   * Expected outcome: If exercises completed exceeds total (edge case), the
   * percentage should be capped at 100.
   */
  it('should cap at 100%', () => {
    const moduleProgress: ModuleProgress = {
      moduleId: 'module1',
      exercisesCompleted: 15,
      exercisesCorrectFirstTry: 10,
      lastDifficulty: 'hard',
      lastAttemptDate: '2026-02-11T10:00:00Z',
    };

    const percentage = getModuleCompletionPercentage(moduleProgress, 10);

    expect(percentage).toBe(100);
  });
});

describe('getModuleSuccessRate', () => {
  /**
   * Test: Calculates success rate correctly
   *
   * Expected outcome: getModuleSuccessRate should return the percentage of
   * exercises solved correctly on the first try.
   */
  it('should calculate success rate correctly', () => {
    const moduleProgress: ModuleProgress = {
      moduleId: 'module1',
      exercisesCompleted: 10,
      exercisesCorrectFirstTry: 7,
      lastDifficulty: 'medium',
      lastAttemptDate: '2026-02-11T10:00:00Z',
    };

    const successRate = getModuleSuccessRate(moduleProgress);

    expect(successRate).toBe(70);
  });

  /**
   * Test: Returns 0 when no progress
   *
   * Expected outcome: When module progress is undefined, the success rate
   * should be 0.
   */
  it('should return 0 when no progress', () => {
    const successRate = getModuleSuccessRate(undefined);

    expect(successRate).toBe(0);
  });

  /**
   * Test: Returns 0 when no exercises completed
   *
   * Expected outcome: When no exercises have been completed yet, the success
   * rate should be 0 to avoid division by zero.
   */
  it('should return 0 when no exercises completed', () => {
    const moduleProgress: ModuleProgress = {
      moduleId: 'module1',
      exercisesCompleted: 0,
      exercisesCorrectFirstTry: 0,
      lastDifficulty: 'easy',
      lastAttemptDate: '2026-02-11T10:00:00Z',
    };

    const successRate = getModuleSuccessRate(moduleProgress);

    expect(successRate).toBe(0);
  });
});
