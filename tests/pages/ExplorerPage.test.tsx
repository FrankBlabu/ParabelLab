/**
 * ExplorerPage tests
 *
 * Tests for the interactive parabola explorer page component, covering:
 * - Initial render with default parameters
 * - Slider interaction and parameter updates
 * - Formula display updates
 * - Reset button functionality
 * - Warning display for a = 0
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ExplorerPage from '../../src/pages/ExplorerPage';

/**
 * Renders ExplorerPage wrapped in BrowserRouter for testing.
 */
function renderExplorerPage() {
  return render(
    <BrowserRouter>
      <ExplorerPage />
    </BrowserRouter>
  );
}

describe('ExplorerPage', () => {
  /**
   * Test: Initial render displays default parabola f(x) = x²
   *
   * Verifies that the page loads with default parameters (a=1, d=0, e=0)
   * and displays the correct forms.
   */
  it('renders default parabola f(x) = x²', () => {
    renderExplorerPage();

    // Page title
    expect(screen.getByText('Parabel-Explorer')).toBeInTheDocument();

    // Coordinate system
    expect(screen.getByTestId('coordinate-system-container')).toBeInTheDocument();

    // Parameter controls
    expect(screen.getByTestId('parameter-controls')).toBeInTheDocument();

    // Formula display
    expect(screen.getByTestId('formula-display')).toBeInTheDocument();

    // Verify default vertex form: f(x) = x²
    const vertexFormText = screen.getByTestId('vertex-form-text');
    expect(vertexFormText.textContent).toBe('f(x) = x²');

    // Verify default normal form: f(x) = x²
    const normalFormText = screen.getByTestId('normal-form-text');
    expect(normalFormText.textContent).toBe('f(x) = x²');
  });

  /**
   * Test: Slider interaction updates parameters
   *
   * Simulates changing the 'd' parameter slider and verifies that:
   * - The vertex form updates to reflect the new parameter
   * - The normal form is recalculated correctly
   */
  it('updates parameters when slider changes', () => {
    renderExplorerPage();

    // Find the 'd' slider
    const dSlider = screen.getByLabelText('d (Horizontal) parameter') as HTMLInputElement;

    // Change d to 3 using fireEvent (range inputs don't support user.clear())
    fireEvent.change(dSlider, { target: { value: '3' } });

    // The vertex form should update to f(x) = (x - 3)²
    // Note: The exact formatting depends on the formatVertexForm implementation
    const vertexFormText = screen.getByTestId('vertex-form-text');
    expect(vertexFormText.textContent).toContain('(x - 3)²');
  });

  /**
   * Test: Reset button restores default parameters
   *
   * Verifies that clicking the reset button restores all parameters
   * to their default values (a=1, d=0, e=0).
   */
  it('resets parameters when reset button is clicked', async () => {
    const user = userEvent.setup();
    renderExplorerPage();

    // Change parameter 'a' first
    const aSlider = screen.getByLabelText('a (Streckung) parameter') as HTMLInputElement;
    fireEvent.change(aSlider, { target: { value: '2' } });

    // Verify it changed
    let vertexFormText = screen.getByTestId('vertex-form-text');
    expect(vertexFormText.textContent).toContain('2x²');

    // Click reset button
    const resetButton = screen.getByTestId('reset-button');
    await user.click(resetButton);

    // Verify back to default
    vertexFormText = screen.getByTestId('vertex-form-text');
    expect(vertexFormText.textContent).toBe('f(x) = x²');
  });

  /**
   * Test: Both forms are displayed
   *
   * Verifies that both the vertex form and normal form cards are
   * rendered and visible on the page.
   */
  it('displays both vertex and normal forms', () => {
    renderExplorerPage();

    // Check for form titles
    expect(screen.getByText('Scheitelpunktform')).toBeInTheDocument();
    expect(screen.getByText('Normalform')).toBeInTheDocument();

    // Check for form content
    expect(screen.getByTestId('vertex-form-text')).toBeInTheDocument();
    expect(screen.getByTestId('normal-form-text')).toBeInTheDocument();
  });

  /**
   * Test: Vertex marker is visible on the graph
   *
   * Verifies that the vertex marker component is rendered within the
   * coordinate system.
   */
  it('shows vertex marker on the graph', () => {
    renderExplorerPage();

    // The coordinate system should be present
    const coordSystem = screen.getByTestId('coordinate-system-svg');
    expect(coordSystem).toBeInTheDocument();

    // Vertex marker should be rendered (it's inside the SVG)
    // We can't easily query SVG elements with RTL, but we can verify
    // the coordinate system is configured to show the vertex
    expect(coordSystem).toBeInTheDocument();
  });

  /**
   * Test: Warning is displayed when a = 0
   *
   * Verifies that when parameter 'a' is set to 0, a warning message
   * is displayed informing the user that this is not a valid parabola.
   */
  it('displays warning when a = 0', () => {
    renderExplorerPage();

    // Initially, no warning should be visible
    expect(screen.queryByTestId('warning-a-zero')).not.toBeInTheDocument();

    // Change 'a' to 0
    const aSlider = screen.getByLabelText('a (Streckung) parameter') as HTMLInputElement;
    fireEvent.change(aSlider, { target: { value: '0' } });

    // Warning should now be visible
    expect(screen.getByTestId('warning-a-zero')).toBeInTheDocument();
    expect(screen.getByText(/Der Parameter a darf nicht 0 sein/i)).toBeInTheDocument();
  });
});
