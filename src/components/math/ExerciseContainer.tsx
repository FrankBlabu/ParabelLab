/**
 * ExerciseContainer component
 *
 * Composes exercise UI elements into a reusable learning module frame.
 */

import React, { useMemo, useState, useEffect } from 'react';
import type { Exercise } from '../../types/exercise';
import FillInBlank from './FillInBlank';
import StepIndicator from './StepIndicator';
import FeedbackMessage from '../ui/FeedbackMessage';
import type { FeedbackVariant } from '../ui/FeedbackMessage';
import { useExercise } from '../../hooks/useExercise';
import CoordinateSystem from '../graph/CoordinateSystem';

export interface ExerciseContainerProps {
  readonly exercise: Exercise;
  readonly onComplete?: () => void;
}

const ExerciseContainer: React.FC<ExerciseContainerProps> = function ExerciseContainer({
  exercise,
  onComplete,
}: ExerciseContainerProps) {
  const {
    currentStepIndex,
    currentStep,
    answers,
    answerStates,
    submitAnswer,
    requestHint,
    nextStep,
    resetExercise,
    goToStep,
    setAnswer,
  } = useExercise(exercise);
  const [showHelp, setShowHelp] = useState(false);
  const [feedback, setFeedback] = useState<{
    variant: FeedbackVariant;
    message?: string;
  } | null>(null);

  useEffect(() => {
    setFeedback(null);
    setShowHelp(false);
  }, [currentStepIndex]);

  const completedSteps = useMemo(() => {
    return exercise.steps
      .map((step, index) => {
        const isComplete = step.blanks.every(
          (blank) => answerStates[blank.id] === 'correct',
        );
        return isComplete ? index : null;
      })
      .filter((value): value is number => value !== null);
  }, [exercise.steps, answerStates]);

  const isCurrentStepComplete = currentStep.blanks.every(
    (blank) => answerStates[blank.id] === 'correct',
  );

  const blanksById = useMemo(() => {
    return new Map(currentStep.blanks.map((blank) => [blank.id, blank]));
  }, [currentStep.blanks]);

  const handleCheck = (): void => {
    const results = currentStep.blanks.map((blank) =>
      submitAnswer(blank.id, answers[blank.id] ?? ''),
    );
    const allCorrect = results.every((state) => state === 'correct');
    setFeedback({ variant: allCorrect ? 'correct' : 'incorrect' });
  };

  const handleHint = (): void => {
    requestHint();
    setFeedback({
      variant: 'hint',
      message: currentStep.hint ?? 'Schau dir die Regel noch einmal an.',
    });
  };

  const handleNext = (): void => {
    if (!isCurrentStepComplete) {
      return;
    }
    if (currentStepIndex === exercise.steps.length - 1) {
      // Exercise is complete, call the completion callback
      onComplete?.();
    }
    nextStep();
  };

  const handleReset = (): void => {
    resetExercise();
  };

  const renderTemplate = (): React.ReactNode => {
    const template = currentStep.template;
    const regex = /\{([^}]+)\}/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null = regex.exec(template);

    while (match) {
      if (match.index > lastIndex) {
        parts.push(template.slice(lastIndex, match.index));
      }

      const blankId = match[1];
      const blank = blanksById.get(blankId);
      if (blank) {
        parts.push(
          <FillInBlank
            key={`blank-${blankId}`}
            blank={blank}
            value={answers[blankId] ?? ''}
            state={answerStates[blankId] ?? 'empty'}
            onChange={setAnswer}
            onSubmit={submitAnswer}
          />,
        );
      } else {
        parts.push(match[0]);
      }

      lastIndex = match.index + match[0].length;
      match = regex.exec(template);
    }

    if (lastIndex < template.length) {
      parts.push(template.slice(lastIndex));
    }

    return <span className="text-lg font-mono">{parts}</span>;
  };

  return (
    <div
      className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow-lg"
      data-testid="exercise-container"
    >
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-gray-900">
          {exercise.title}
        </h2>
        <p className="text-gray-600">{exercise.description}</p>
      </header>

      <StepIndicator
        currentStepIndex={currentStepIndex}
        totalSteps={exercise.steps.length}
        completedSteps={completedSteps}
        onStepSelect={(index) => {
          if (completedSteps.includes(index)) {
            goToStep(index);
          }
        }}
      />

      <section className="rounded-lg border border-gray-200 p-4">
        <p className="text-sm uppercase text-gray-500 tracking-wide mb-2">
          Schritt {currentStepIndex + 1} von {exercise.steps.length}
        </p>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {currentStep.instruction}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {renderTemplate()}
        </div>
        {showHelp && (
          <div className="mt-3 text-sm text-gray-600">
            {currentStep.explanation}
          </div>
        )}
      </section>

      {feedback && (
        <FeedbackMessage
          variant={feedback.variant}
          message={feedback.message}
          onDismiss={() => setFeedback(null)}
        />
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setShowHelp((prev) => !prev)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          data-testid="exercise-help"
        >
          Hilfe
        </button>
        <button
          type="button"
          onClick={handleCheck}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          data-testid="exercise-check"
        >
          Pruefen
        </button>
        <button
          type="button"
          onClick={handleHint}
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          data-testid="exercise-hint"
        >
          Tipp
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          disabled={!isCurrentStepComplete}
          data-testid="exercise-next"
        >
          Weiter -&gt;
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          data-testid="exercise-reset"
        >
          Zuruecksetzen
        </button>
      </div>

      {exercise.parabolaParams && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm uppercase text-gray-500 tracking-wide mb-3">
            Parabel-Vorschau
          </p>
          <div className="h-64">
            <CoordinateSystem
              parabolaParams={exercise.parabolaParams}
              showGrid={true}
              showVertex={true}
              showZeros={false}
              showYIntercept={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseContainer;
