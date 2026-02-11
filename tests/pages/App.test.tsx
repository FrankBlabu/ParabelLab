import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressProvider } from '../../src/context/ProgressContext';
import App from '../../src/App';

/**
 * Smoke test for the App component
 *
 * Tests that the main App component renders without crashing and displays
 * the HomePage with AppShell layout. This validates that the application
 * routing and shell initialize properly.
 */
describe('App Component', () => {
  it('should render without crashing', () => {
    render(
      <ProgressProvider>
        <App />
      </ProgressProvider>
    );

    // Verify that the AppShell and HomePage are present
    const heading = screen.getByText('Willkommen bei ParabelLab!');
    expect(heading).toBeInTheDocument();
  });

  it('should display the HomePage by default with AppShell', () => {
    render(
      <ProgressProvider>
        <App />
      </ProgressProvider>
    );

    // Verify AppShell components are present
    expect(screen.getByText('ParabelLab')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('main-content')).toBeInTheDocument();

    // Verify HomePage content is shown
    expect(screen.getByText('Willkommen bei ParabelLab!')).toBeInTheDocument();
    expect(
      screen.getByText(/ParabelLab ist deine interaktive Lernplattform/),
    ).toBeInTheDocument();
  });
});
