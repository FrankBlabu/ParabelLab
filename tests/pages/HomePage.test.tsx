/**
 * HomePage Component Tests
 *
 * Tests for the landing page that displays:
 * - Welcome heading and description
 * - App logo
 * - Module cards with links to all modules
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../../src/pages/HomePage';

/**
 * Test helper: Renders HomePage wrapped in a Router
 * (Required because HomePage uses Link components)
 */
function renderHomePage() {
  return render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>,
  );
}

describe('HomePage', () => {
  /**
   * Test: HomePage renders the welcome heading
   *
   * Expected outcome:
   * - The main heading "Willkommen bei ParabelLab!" is displayed
   */
  it('renders welcome heading', () => {
    renderHomePage();

    expect(screen.getByText('Willkommen bei ParabelLab!')).toBeInTheDocument();
  });

  /**
   * Test: HomePage renders the app logo
   *
   * Expected outcome:
   * - The logo image is displayed with correct alt text
   */
  it('renders app logo', () => {
    renderHomePage();

    const logos = screen.getAllByAltText('ParabelLab Logo');
    expect(logos.length).toBeGreaterThan(0);
  });

  /**
   * Test: HomePage renders the descriptive text
   *
   * Expected outcome:
   * - The description paragraph is present explaining the app's purpose
   */
  it('renders descriptive text', () => {
    renderHomePage();

    expect(
      screen.getByText(/ParabelLab ist deine interaktive Lernplattform/),
    ).toBeInTheDocument();
  });

  /**
   * Test: HomePage renders all module cards
   *
   * Expected outcome:
   * - All four module cards are displayed:
   *   1. Parabel-Explorer
   *   2. Scheitelpunkt → Normalform
   *   3. Normal → Scheitelpunkt
   *   4. Termumformungen
   */
  it('renders all module cards', () => {
    renderHomePage();

    expect(screen.getByText('Parabel-Explorer')).toBeInTheDocument();
    expect(screen.getByText('Scheitelpunkt → Normalform')).toBeInTheDocument();
    expect(screen.getByText('Normal → Scheitelpunkt')).toBeInTheDocument();
    expect(screen.getByText('Termumformungen')).toBeInTheDocument();
  });

  /**
   * Test: Module cards contain descriptions
   *
   * Expected outcome:
   * - Each module card displays a short description text
   */
  it('renders module descriptions', () => {
    renderHomePage();

    expect(
      screen.getByText(/Erkunde Parabeln interaktiv/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Lerne, wie man die Scheitelpunktform/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Übe die quadratische Ergänzung/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Trainiere grundlegende algebraische Umformungen/),
    ).toBeInTheDocument();
  });

  /**
   * Test: Module cards display difficulty indicators
   *
   * Expected outcome:
   * - Each card shows a difficulty badge (Einfach, Mittel, or Schwer)
   */
  it('renders difficulty indicators', () => {
    renderHomePage();

    const einfachBadges = screen.getAllByText('Einfach');
    const mittelBadges = screen.getAllByText('Mittel');

    // There should be 3 "Einfach" modules (Explorer, Module 1, Module 3)
    expect(einfachBadges).toHaveLength(3);

    // There should be 1 "Mittel" module (Module 2)
    expect(mittelBadges).toHaveLength(1);
  });

  /**
   * Test: Module cards are clickable links to correct routes
   *
   * Expected outcome:
   * - Each module card contains a link to the correct route
   */
  it('renders links to modules', () => {
    renderHomePage();

    const explorerLink = screen.getByText('Parabel-Explorer').closest('a');
    const module1Link = screen
      .getByText('Scheitelpunkt → Normalform')
      .closest('a');
    const module2Link = screen
      .getByText('Normal → Scheitelpunkt')
      .closest('a');
    const module3Link = screen.getByText('Termumformungen').closest('a');

    expect(explorerLink).toHaveAttribute('href', '/explorer');
    expect(module1Link).toHaveAttribute('href', '/modul/1');
    expect(module2Link).toHaveAttribute('href', '/modul/2');
    expect(module3Link).toHaveAttribute('href', '/modul/3');
  });
});
