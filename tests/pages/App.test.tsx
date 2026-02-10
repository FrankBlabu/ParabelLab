import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../../src/App';

/**
 * Smoke test for the App component
 *
 * Tests that the main App component renders without crashing and displays
 * the ExplorerPage. This validates that the application routing and shell
 * initialize properly.
 */
describe('App Component', () => {
  it('should render without crashing', () => {
    render(<App />);

    // Verify that the ExplorerPage heading is present
    const heading = screen.getByRole('heading', {
      name: /Parabel-Explorer/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('should display the ExplorerPage by default', () => {
    render(<App />);

    // Verify ExplorerPage components are present
    expect(screen.getByTestId('explorer-page')).toBeInTheDocument();
    expect(screen.getByTestId('parameter-controls')).toBeInTheDocument();
    expect(screen.getByTestId('formula-display')).toBeInTheDocument();
  });
});
