/**
 * useExercise hook
 *
 * Manages exercise state, answers, and step navigation.
 */

import { useEffect, useMemo, useState } from 'react';
import type { Exercise, AnswerState, ExerciseBlank } from '../types/exercise';

const buildAnswerMaps = (exercise: Exercise): {
  answers: Record<string, string>;
  states: Record<string, AnswerState>;
} => {
  const answers: Record<string, string> = {};
  const states: Record<string, AnswerState> = {};

  exercise.steps.forEach((step) => {
    step.blanks.forEach((blank) => {
      answers[blank.id] = '';
      states[blank.id] = 'empty';
    });
  });

  return { answers, states };
};

const isAnswerCorrect = (blank: ExerciseBlank, value: string): AnswerState => {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return 'empty';
  }

  const parsed = Number(trimmed);
  if (Number.isNaN(parsed)) {
    return 'incorrect';
  }

  const tolerance = blank.tolerance ?? 0;
  const diff = Math.abs(parsed - blank.correctAnswer);

  return diff <= tolerance ? 'correct' : 'incorrect';
};

export interface UseExerciseResult {
  readonly currentStepIndex: number;
  readonly currentStep: Exercise['steps'][number];
  readonly answers: Record<string, string>;
  readonly answerStates: Record<string, AnswerState>;
  readonly hintShown: boolean;
  readonly submitAnswer: (blankId: string, value: string) => AnswerState;
  readonly requestHint: () => void;
  readonly nextStep: () => void;
  readonly resetExercise: () => void;
  readonly goToStep: (index: number) => void;
  readonly setAnswer: (blankId: string, value: string) => void;
}

export const useExercise = (exercise: Exercise): UseExerciseResult => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    buildAnswerMaps(exercise).answers,
  );
  const [answerStates, setAnswerStates] = useState<Record<string, AnswerState>>(() =>
    buildAnswerMaps(exercise).states,
  );
  const [hintShown, setHintShown] = useState(false);

  useEffect(() => {
    const { answers: newAnswers, states: newStates } = buildAnswerMaps(exercise);
    setCurrentStepIndex(0);
    setAnswers(newAnswers);
    setAnswerStates(newStates);
    setHintShown(false);
  }, [exercise]);

  const currentStep = useMemo(() => exercise.steps[currentStepIndex], [
    exercise.steps,
    currentStepIndex,
  ]);

  const setAnswer = (blankId: string, value: string): void => {
    setAnswers((prev) => ({ ...prev, [blankId]: value }));
  };

  const submitAnswer = (blankId: string, value: string): AnswerState => {
    const blank = currentStep.blanks.find((item) => item.id === blankId);
    if (!blank) {
      return 'empty';
    }

    const nextState = isAnswerCorrect(blank, value);
    setAnswers((prev) => ({ ...prev, [blankId]: value }));
    setAnswerStates((prev) => ({ ...prev, [blankId]: nextState }));
    return nextState;
  };

  const requestHint = (): void => {
    setHintShown(true);
    setAnswerStates((prev) => {
      const next = { ...prev };
      currentStep.blanks.forEach((blank) => {
        if (next[blank.id] !== 'correct') {
          next[blank.id] = 'hint-shown';
        }
      });
      return next;
    });
  };

  const nextStep = (): void => {
    setCurrentStepIndex((prev) => {
      const nextIndex = Math.min(prev + 1, exercise.steps.length - 1);
      return nextIndex;
    });
    setHintShown(false);
  };

  const goToStep = (index: number): void => {
    if (index < 0 || index >= exercise.steps.length) {
      return;
    }
    setCurrentStepIndex(index);
  };

  const resetExercise = (): void => {
    const { answers: newAnswers, states: newStates } = buildAnswerMaps(exercise);
    setCurrentStepIndex(0);
    setAnswers(newAnswers);
    setAnswerStates(newStates);
    setHintShown(false);
  };

  return {
    currentStepIndex,
    currentStep,
    answers,
    answerStates,
    hintShown,
    submitAnswer,
    requestHint,
    nextStep,
    resetExercise,
    goToStep,
    setAnswer,
  };
};
