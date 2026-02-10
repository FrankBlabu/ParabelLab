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
    stateClasses = 'border-green-500 text-green-700';
  } else if (state === 'incorrect') {
    stateClasses = 'border-red-500 text-red-700 animate-shake';
  } else if (state === 'hint-shown') {
    stateClasses = 'border-yellow-500 text-yellow-700';
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
