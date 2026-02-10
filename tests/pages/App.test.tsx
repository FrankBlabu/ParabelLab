import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../../src/App';

/**
 * Smoke test for the App component
 *
 * Tests that the main App component renders without crashing and displays
 * expected content. This is a basic validation that the application shell
 * initializes properly.
 */
describe('App Component', () => {
  it('should render without crashing', () => {
    render(<App />);

    // Verify that the main heading is present
    const heading = screen.getByRole('heading', {
      name: /ParabelLab/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('should display the application title and subtitle', () => {
    render(<App />);

    const title = screen.getByText('ParabelLab');
    const subtitle = screen.getByText(/Interactive Parabola Learning Application/i);

    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
  });
});
