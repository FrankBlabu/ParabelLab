/**
 * Tests for the useExercise hook
 *
 * Covers step navigation, answer validation, hints, and tolerance handling.
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useExercise } from '../../src/hooks/useExercise';
import type { Exercise } from '../../src/types/exercise';

const exercise: Exercise = {
  id: 'exercise-test',
  title: 'Test Exercise',
  description: 'Exercise for hook tests.',
  steps: [
    {
      id: 'step-1',
      instruction: 'Berechne b.',
      explanation: 'b ergibt sich aus -2ad.',
      template: 'b = {b}',
      blanks: [
        {
          id: 'b',
          correctAnswer: 4,
        },
      ],
      hint: 'Setze die Werte in die Formel ein.',
    },
    {
      id: 'step-2',
      instruction: 'Berechne c.',
      explanation: 'c ergibt sich aus ad^2 + e.',
      template: 'c = {c}',
      blanks: [
        {
          id: 'c',
          correctAnswer: 2.5,
          tolerance: 0.2,
        },
      ],
    },
  ],
};

describe('useExercise', () => {
  /*
   * Initial state should point to the first step with empty answers.
   */
  it('initializes with the first step and empty answers', () => {
    const { result } = renderHook(() => useExercise(exercise));

    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.currentStep.id).toBe('step-1');
    expect(result.current.answers.b).toBe('');
  });

  /*
   * Submitting a correct answer should mark the blank as correct.
   */
  it('marks answers as correct when they match', () => {
    const { result } = renderHook(() => useExercise(exercise));
    let returnedState: string | undefined;

    act(() => {
      returnedState = result.current.submitAnswer('b', '4');
    });

    expect(returnedState).toBe('correct');
    expect(result.current.answerStates.b).toBe('correct');
  });

  /*
   * Submitting an incorrect answer should mark the blank as incorrect.
   */
  it('marks answers as incorrect when they do not match', () => {
    const { result } = renderHook(() => useExercise(exercise));

    act(() => {
      result.current.submitAnswer('b', '7');
    });

    expect(result.current.answerStates.b).toBe('incorrect');
  });

  /*
   * Requesting a hint should flag the hint state and update blanks.
   */
  it('sets hint state when requestHint is called', () => {
    const { result } = renderHook(() => useExercise(exercise));

    act(() => {
      result.current.requestHint();
    });

    expect(result.current.hintShown).toBe(true);
    expect(result.current.answerStates.b).toBe('hint-shown');
  });

  /*
   * nextStep should advance to the next exercise step.
   */
  it('advances to the next step', () => {
    const { result } = renderHook(() => useExercise(exercise));

    act(() => {
      result.current.nextStep();
    });

    expect(result.current.currentStepIndex).toBe(1);
    expect(result.current.currentStep.id).toBe('step-2');
  });

  /*
   * Answers within tolerance should be accepted as correct.
   */
  it('accepts answers within tolerance', () => {
    const { result } = renderHook(() => useExercise(exercise));

    act(() => {
      result.current.nextStep();
    });

    act(() => {
      result.current.submitAnswer('c', '2.6');
    });

    expect(result.current.answerStates.c).toBe('correct');
  });
});
