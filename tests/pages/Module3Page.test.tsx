/**
 * Tests for Module3Page component
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Module3Page from '../../src/pages/Module3Page';

describe('Module3Page', () => {
  const renderModule3Page = () => {
    return render(
      <BrowserRouter>
        <Module3Page />
      </BrowserRouter>,
    );
  };

  /*
   * The page should render with the correct title.
   */
  it('renders the module title', () => {
    renderModule3Page();
    expect(
      screen.getByText(/Modul 3: Grundlegende Termumformungen/i),
    ).toBeInTheDocument();
  });

  /*
   * The page should display all three category tabs.
   */
  it('renders all category tabs', () => {
    renderModule3Page();
    expect(screen.getByTestId('category-expanding')).toBeInTheDocument();
    expect(screen.getByTestId('category-factoring')).toBeInTheDocument();
    expect(screen.getByTestId('category-rearranging')).toBeInTheDocument();
  });

  /*
   * The expanding category should be selected by default.
   */
  it('has expanding category selected by default', () => {
    renderModule3Page();
    const expandingTab = screen.getByTestId('category-expanding');
    expect(expandingTab).toHaveClass('bg-primary-600');
  });

  /*
   * Clicking a category tab should change the active category.
   */
  it('changes category when tab is clicked', () => {
    renderModule3Page();
    const factoringTab = screen.getByTestId('category-factoring');

    fireEvent.click(factoringTab);

    expect(factoringTab).toHaveClass('bg-primary-600');
  });

  /*
   * The page should display difficulty selector buttons.
   */
  it('renders difficulty selector', () => {
    renderModule3Page();
    expect(screen.getByTestId('difficulty-easy')).toBeInTheDocument();
    expect(screen.getByTestId('difficulty-medium')).toBeInTheDocument();
    expect(screen.getByTestId('difficulty-hard')).toBeInTheDocument();
  });

  /*
   * Easy difficulty should be selected by default.
   */
  it('has easy difficulty selected by default', () => {
    renderModule3Page();
    const easyButton = screen.getByTestId('difficulty-easy');
    expect(easyButton).toHaveClass('bg-primary-600');
  });

  /*
   * Clicking difficulty should change the active difficulty.
   */
  it('changes difficulty when button is clicked', () => {
    renderModule3Page();
    const mediumButton = screen.getByTestId('difficulty-medium');

    fireEvent.click(mediumButton);

    expect(mediumButton).toHaveClass('bg-primary-600');
  });

  /*
   * The page should render the exercise container.
   */
  it('renders exercise container', () => {
    renderModule3Page();
    expect(screen.getByTestId('exercise-container')).toBeInTheDocument();
  });

  /*
   * The page should have a "New Exercise" button.
   */
  it('renders new exercise button', () => {
    renderModule3Page();
    expect(screen.getByTestId('new-exercise-button')).toBeInTheDocument();
  });

  /*
   * Clicking "New Exercise" should generate a new exercise.
   */
  it('generates new exercise when button is clicked', () => {
    renderModule3Page();
    const newExerciseButton = screen.getByTestId('new-exercise-button');

    fireEvent.click(newExerciseButton);

    // After clicking, the exercise should change (different seed)
    // The component should re-render with a new exercise
    expect(screen.getByTestId('exercise-container')).toBeInTheDocument();
  });

  /*
   * The page should have a back link to the explorer.
   */
  it('renders back link to explorer', () => {
    renderModule3Page();
    const backLink = screen.getByTestId('back-link');
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');
  });

  /*
   * Category tabs should show score when exercises are completed.
   */
  it('shows score on category tabs after completing exercises', () => {
    renderModule3Page();
    const newExerciseButton = screen.getByTestId('new-exercise-button');

    // Generate an exercise (increments total)
    fireEvent.click(newExerciseButton);

    // The expanding tab should show score "0 / 1"
    const expandingTab = screen.getByTestId('category-expanding');
    expect(expandingTab.textContent).toContain('0');
    expect(expandingTab.textContent).toContain('1');
  });

  /*
   * Score display should appear after generating exercises.
   */
  it('shows score display after generating exercises', () => {
    renderModule3Page();
    const newExerciseButton = screen.getByTestId('new-exercise-button');

    // Initially no score display
    expect(screen.queryByTestId('score-display')).not.toBeInTheDocument();

    // Generate an exercise
    fireEvent.click(newExerciseButton);

    // Score display should appear
    expect(screen.getByTestId('score-display')).toBeInTheDocument();
  });

  /*
   * Each category should maintain separate scores.
   */
  it('maintains separate scores for each category', () => {
    renderModule3Page();
    const newExerciseButton = screen.getByTestId('new-exercise-button');
    const factoringTab = screen.getByTestId('category-factoring');

    // Generate exercise in expanding category
    fireEvent.click(newExerciseButton);
    const expandingTab = screen.getByTestId('category-expanding');
    expect(expandingTab.textContent).toContain('1');

    // Switch to factoring category
    fireEvent.click(factoringTab);

    // Factoring should have no exercises yet
    expect(factoringTab.textContent).not.toContain('/');

    // Generate exercise in factoring category
    fireEvent.click(newExerciseButton);
    expect(factoringTab.textContent).toContain('1');
  });
});
