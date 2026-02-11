/**
 * FillInBlank component
 *
 * Inline input field used inside exercise templates.
 */

import React from 'react';
import type { ExerciseBlank, AnswerState } from '../../types/exercise';

export interface FillInBlankProps {
  readonly blank: ExerciseBlank;
  readonly value: string;
  readonly state: AnswerState;
  readonly onChange: (blankId: string, value: string) => void;
  readonly onSubmit: (blankId: string, value: string) => void;
}

const FillInBlank: React.FC<FillInBlankProps> = function FillInBlank({
  blank,
  value,
  state,
  onChange,
  onSubmit,
}: FillInBlankProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(blank.id, event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      onSubmit(blank.id, value);
    }
  };

  let stateClasses = 'border-gray-300';
  if (state === 'correct') {
    stateClasses = 'border-green-600 bg-green-50 text-green-900';
  } else if (state === 'incorrect') {
    stateClasses = 'border-red-600 bg-red-50 text-red-900 animate-shake';
  } else if (state === 'hint-shown') {
    stateClasses = 'border-yellow-600 bg-yellow-50 text-yellow-900';
  }

  return (
    <input
      type="text"
      inputMode="decimal"
      aria-label={blank.label ?? `Antwort ${blank.id}`}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={blank.label ?? ''}
      className={`inline-block w-20 px-2 py-1 mx-1 border-2 rounded-md text-center font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 ${stateClasses}`}
      data-testid={`fill-blank-${blank.id}`}
    />
  );
};

export default FillInBlank;
