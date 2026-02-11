/**
 * AppShell Layout Component Tests
 *
 * Tests for the main application shell that provides:
 * - Header with app title and logo
 * - Sidebar navigation with route links
 * - Content area for page rendering
 * - Responsive behavior (hamburger menu on mobile)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import AppShell from '../../src/layouts/AppShell';

/**
 * Test helper: Renders AppShell wrapped in a Router
 * (Required because AppShell uses Outlet and Sidebar uses NavLink)
 */
function renderAppShell() {
  return render(
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>,
  );
}

describe('AppShell', () => {
  /**
   * Test: AppShell renders the header with app title and logo
   *
   * Expected outcome:
   * - The header contains "ParabelLab" text
   * - The logo image is displayed with correct alt text
   */
  it('renders header with app title and logo', () => {
    renderAppShell();

    expect(screen.getByText('ParabelLab')).toBeInTheDocument();
    expect(screen.getByAltText('ParabelLab Logo')).toBeInTheDocument();
  });

  /**
   * Test: AppShell renders all navigation links
   *
   * Expected outcome:
   * - All expected navigation items are present:
   *   - Startseite (Home)
   *   - Parabel-Explorer
   *   - Scheitelpunkt → Normal (Module 1)
   *   - Normal → Scheitelpunkt (Module 2)
   *   - Termumformungen (Module 3)
   */
  it('renders all navigation links', () => {
    renderAppShell();

    expect(screen.getByText('Startseite')).toBeInTheDocument();
    expect(screen.getByText('Parabel-Explorer')).toBeInTheDocument();
    expect(screen.getByText('Scheitelpunkt → Normal')).toBeInTheDocument();
    expect(screen.getByText('Normal → Scheitelpunkt')).toBeInTheDocument();
    expect(screen.getByText('Termumformungen')).toBeInTheDocument();
  });

  /**
   * Test: AppShell renders the content outlet area
   *
   * Expected outcome:
   * - The main content area (where routes render) is present in the DOM
   */
  it('renders content outlet', () => {
    renderAppShell();

    const mainContent = screen.getByTestId('main-content');
    expect(mainContent).toBeInTheDocument();
  });

  /**
   * Test: Hamburger menu button is present (for mobile navigation)
   *
   * Expected outcome:
   * - The hamburger button exists with proper accessibility label
   */
  it('renders hamburger menu button', () => {
    renderAppShell();

    const hamburgerButton = screen.getByTestId('hamburger-button');
    expect(hamburgerButton).toBeInTheDocument();
    expect(hamburgerButton).toHaveAttribute(
      'aria-label',
      'Toggle navigation menu',
    );
  });

  /**
   * Test: Clicking hamburger button toggles sidebar visibility (mobile behavior)
   *
   * Expected outcome:
   * - Clicking the hamburger button shows the sidebar overlay
   * - The sidebar has the correct visibility class (translate-x-0)
   * - Clicking again (or the overlay) hides the sidebar
   */
  it('toggles sidebar on hamburger button click', async () => {
    const user = userEvent.setup();
    renderAppShell();

    const hamburgerButton = screen.getByTestId('hamburger-button');
    const sidebar = screen.getByTestId('sidebar');

    // Initially sidebar should have the hidden class (translate-x-full on small screens)
    expect(sidebar).toHaveClass('-translate-x-full');

    // Click to open
    await user.click(hamburgerButton);
    expect(sidebar).toHaveClass('translate-x-0');
    expect(screen.getByTestId('sidebar-overlay')).toBeInTheDocument();

    // Click to close
    await user.click(hamburgerButton);
    expect(sidebar).toHaveClass('-translate-x-full');
  });

  /**
   * Test: Clicking overlay closes the sidebar
   *
   * Expected outcome:
   * - When sidebar is open, clicking the overlay closes it
   */
  it('closes sidebar when clicking overlay', async () => {
    const user = userEvent.setup();
    renderAppShell();

    const hamburgerButton = screen.getByTestId('hamburger-button');

    // Open sidebar
    await user.click(hamburgerButton);
    expect(screen.getByTestId('sidebar-overlay')).toBeInTheDocument();

    // Click overlay to close
    const overlay = screen.getByTestId('sidebar-overlay');
    await user.click(overlay);

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveClass('-translate-x-full');
  });
});
