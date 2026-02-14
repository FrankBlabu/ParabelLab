import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import type { JSX } from 'react';
import Sidebar from './Sidebar';
import logoIcon from '/icon.png';

/**
 * AppShell Layout Component
 *
 * Provides the main application layout structure with:
 * - A header displaying the app title and logo
 * - A sidebar with navigation links (collapsible on mobile)
 * - A content area that renders the active route via Outlet
 *
 * The layout is responsive:
 * - On desktop (≥768px): sidebar is always visible
 * - On mobile (<768px): sidebar toggles via hamburger menu
 */
export default function AppShell(): JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = (): void => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = (): void => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Skip to Main Content Link - for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:font-semibold"
      >
        Zum Hauptinhalt springen
      </a>

      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md z-20">
        <div className="flex items-center px-4 py-3">
          {/* Hamburger Menu Button (Mobile Only) */}
          <button
            onClick={toggleSidebar}
            className="md:hidden mr-3 p-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Toggle navigation menu"
            data-testid="hamburger-button"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* App Icon and Title */}
          <div className="flex items-center gap-3">
            <img
              src={logoIcon}
              alt="Parabola Logo"
              className="w-8 h-8"
            />
            <h1 className="text-xl font-bold">Parabola</h1>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Overlay for Mobile (when sidebar is open) */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={closeSidebar}
            data-testid="sidebar-overlay"
          />
        )}

        {/* Content Area */}
        <main
          id="main-content"
          className="flex-1 overflow-auto bg-gray-50 p-6"
          data-testid="main-content"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
