/**
 * Tests for the FillInBlank component
 *
 * Validates input rendering, change handling, and visual state styling.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FillInBlank from '../../../src/components/math/FillInBlank';
import type { ExerciseBlank } from '../../../src/types/exercise';

const blank: ExerciseBlank = {
  id: 'blank-1',
  correctAnswer: 3,
  label: 'b',
};

describe('FillInBlank', () => {
  /*
   * Renders input field with the expected test id.
   */
  it('renders the input field', () => {
    render(
      <FillInBlank
        blank={blank}
        value=""
        state="empty"
        onChange={() => undefined}
        onSubmit={() => undefined}
      />,
    );

    expect(screen.getByTestId('fill-blank-blank-1')).toBeInTheDocument();
  });

  /*
   * Calls onChange when the user types in the input.
   */
  it('accepts input and calls onChange', () => {
    const handleChange = vi.fn();

    render(
      <FillInBlank
        blank={blank}
        value=""
        state="empty"
        onChange={handleChange}
        onSubmit={() => undefined}
      />,
    );

    const input = screen.getByTestId('fill-blank-blank-1');
    fireEvent.change(input, { target: { value: '5' } });

    expect(handleChange).toHaveBeenCalledWith('blank-1', '5');
  });

  /*
   * Correct state should apply the green border styling.
   */
  it('applies correct state styling', () => {
    render(
      <FillInBlank
        blank={blank}
        value="3"
        state="correct"
        onChange={() => undefined}
        onSubmit={() => undefined}
      />,
    );

    const input = screen.getByTestId('fill-blank-blank-1');
    expect(input.className).toContain('border-green-600');
  });

  /*
   * Incorrect state should apply the red border styling.
   */
  it('applies incorrect state styling', () => {
    render(
      <FillInBlank
        blank={blank}
        value="2"
        state="incorrect"
        onChange={() => undefined}
        onSubmit={() => undefined}
      />,
    );

    const input = screen.getByTestId('fill-blank-blank-1');
    expect(input.className).toContain('border-red-600');
  });
});
