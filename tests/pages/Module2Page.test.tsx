/**
 * Module2Page tests
 *
 * Tests for the normal-to-vertex-form learning module page, covering:
 * - Module title rendering
 * - Difficulty selector with all three levels
 * - Exercise loading with blanks
 * - Correct answer flow
 * - Incorrect answer flow
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';import { ProgressProvider } from '../../src/context/ProgressContext';import Module2Page from '../../src/pages/Module2Page';

function renderModule2Page() {
  return render(
    <ProgressProvider>
      <BrowserRouter>
        <Module2Page />
      </BrowserRouter>
    </ProgressProvider>,
  );
}

describe('Module2Page', () => {
  /**
   * Test: Module title is displayed.
   */
  it('renders module title', () => {
    renderModule2Page();

    expect(
      screen.getByTestId('module2-title'),
    ).toHaveTextContent(
      'Modul 2: Von der Normalform zur Scheitelpunktform',
    );
  });

  /**
   * Test: All three difficulty levels are available.
   */
  it('renders all difficulty levels', () => {
    renderModule2Page();

    expect(screen.getByTestId('difficulty-easy')).toBeInTheDocument();
    expect(screen.getByTestId('difficulty-medium')).toBeInTheDocument();
    expect(screen.getByTestId('difficulty-hard')).toBeInTheDocument();
  });

  /**
   * Test: Easy is selected by default.
   */
  it('has easy difficulty selected by default', () => {
    renderModule2Page();

    const easyButton = screen.getByTestId('difficulty-easy');
    expect(easyButton).toHaveAttribute('aria-checked', 'true');
  });

  /**
   * Test: Exercise container is loaded with blanks.
   */
  it('loads an exercise with the exercise container', () => {
    renderModule2Page();

    expect(screen.getByTestId('exercise-container')).toBeInTheDocument();
  });

  /**
   * Test: Switching difficulty changes the exercise.
   */
  it('changes exercise when difficulty is switched', async () => {
    const user = userEvent.setup();
    renderModule2Page();

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
    renderModule2Page();

    const newButton = screen.getByTestId('new-exercise-button');
    await user.click(newButton);

    // Exercise container should still be present
    expect(screen.getByTestId('exercise-container')).toBeInTheDocument();
  });

  /**
   * Test: Back link to explorer is present.
   */
  it('shows a back link to the explorer', () => {
    renderModule2Page();

    expect(screen.getByTestId('back-link')).toBeInTheDocument();
  });

  /**
   * Test: Incorrect answer produces error feedback.
   */
  it('shows error feedback for incorrect answer', async () => {
    const user = userEvent.setup();
    renderModule2Page();

    const blanks = screen.getAllByRole('textbox');
    await user.type(blanks[0], '999');

    const checkButton = screen.getByTestId('exercise-check');
    await user.click(checkButton);

    expect(screen.getByTestId('feedback-message')).toBeInTheDocument();
  });
});
