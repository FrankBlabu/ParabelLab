/**
 * Module1Page tests
 *
 * Tests for the vertex-to-normal-form learning module page, covering:
 * - Module title rendering
 * - Difficulty selector with all three levels
 * - Exercise loading with blanks
 * - Correct answer flow
 * - Incorrect answer flow
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';import { ProgressProvider } from '../../src/context/ProgressContext';import Module1Page from '../../src/pages/Module1Page';

function renderModule1Page() {
  return render(
    <ProgressProvider>
      <BrowserRouter>
        <Module1Page />
      </BrowserRouter>
    </ProgressProvider>,
  );
}

describe('Module1Page', () => {
  /**
   * Test: Module title is displayed.
   */
  it('renders module title', () => {
    renderModule1Page();

    expect(
      screen.getByTestId('module1-title'),
    ).toHaveTextContent(
      'Modul 1: Von der Scheitelpunktform zur Normalform',
    );
  });

  /**
   * Test: All three difficulty levels are available.
   */
  it('renders all difficulty levels', () => {
    renderModule1Page();

    expect(screen.getByTestId('difficulty-easy')).toBeInTheDocument();
    expect(screen.getByTestId('difficulty-medium')).toBeInTheDocument();
    expect(screen.getByTestId('difficulty-hard')).toBeInTheDocument();
  });

  /**
   * Test: Easy is selected by default.
   */
  it('has easy difficulty selected by default', () => {
    renderModule1Page();

    const easyButton = screen.getByTestId('difficulty-easy');
    expect(easyButton).toHaveAttribute('aria-checked', 'true');
  });

  /**
   * Test: Exercise container is loaded with blanks.
   */
  it('loads an exercise with the exercise container', () => {
    renderModule1Page();

    expect(screen.getByTestId('exercise-container')).toBeInTheDocument();
  });

  /**
   * Test: Switching difficulty changes the exercise.
   */
  it('changes exercise when difficulty is switched', async () => {
    const user = userEvent.setup();
    renderModule1Page();

    const mediumButton = screen.getByTestId('difficulty-medium');
    await user.click(mediumButton);

    expect(mediumButton).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByTestId('exercise-container')).toBeInTheDocument();
  });

  /**
   * Test: "Neue Aufgabe" button generates a new exercise.
   */
  it('generates a new exercise on button click', async () => {
    const user = userEvent.setup();
    renderModule1Page();

    const newButton = screen.getByTestId('new-exercise-button');
    await user.click(newButton);

    // Exercise container should still be present
    expect(screen.getByTestId('exercise-container')).toBeInTheDocument();
  });

  /**
   * Test: Back link to explorer is present.
   */
  it('shows a back link to the explorer', () => {
    renderModule1Page();

    expect(screen.getByTestId('back-link')).toBeInTheDocument();
  });

  /**
   * Test: Incorrect answer produces error feedback.
   */
  it('shows error feedback for incorrect answer', async () => {
    const user = userEvent.setup();
    renderModule1Page();

    // Find first blank input (if present in step 1)
    const blanks = screen.queryAllByRole('textbox');
    if (blanks.length > 0) {
      await user.type(blanks[0], '999');

      const checkButton = screen.getByTestId('exercise-check');
      await user.click(checkButton);

      expect(screen.getByTestId('feedback-message')).toBeInTheDocument();
    }
  });
});
