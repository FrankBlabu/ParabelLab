/**
 * StepIndicator component
 *
 * Displays the current progress through an exercise.
 */

import React from 'react';

export interface StepIndicatorProps {
  readonly currentStepIndex: number;
  readonly totalSteps: number;
  readonly completedSteps: readonly number[];
  readonly onStepSelect?: (index: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = function StepIndicator({
  currentStepIndex,
  totalSteps,
  completedSteps,
  onStepSelect,
}: StepIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, index) => index);

  return (
    <div className="flex items-center gap-2" data-testid="step-indicator">
      {steps.map((index) => {
        const isCompleted = completedSteps.includes(index);
        const isCurrent = index === currentStepIndex;
        const baseClasses =
          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors';
        const stateClasses = isCompleted
          ? 'bg-green-500 border-green-500 text-white'
          : isCurrent
            ? 'bg-primary-600 border-primary-600 text-white'
            : 'bg-white border-gray-300 text-gray-500';
        const isClickable = isCompleted && onStepSelect;

        return (
          <button
            key={index}
            type="button"
            className={`${baseClasses} ${stateClasses}`}
            onClick={isClickable ? () => onStepSelect?.(index) : undefined}
            disabled={!isClickable}
            aria-current={isCurrent ? 'step' : undefined}
            data-testid={`step-indicator-${index}`}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
};

export default StepIndicator;
