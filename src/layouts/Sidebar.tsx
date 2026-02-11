import { NavLink } from 'react-router-dom';
import type { JSX } from 'react';

/**
 * Navigation item configuration
 */
interface NavItem {
  /** Route path */
  readonly path: string;
  /** Display label */
  readonly label: string;
  /** Icon (emoji or SVG) */
  readonly icon: string;
}

/**
 * Sidebar Navigation Component
 *
 * Displays the main navigation menu with links to all pages.
 * Uses NavLink for automatic active state highlighting.
 *
 * Props:
 * - isOpen: Whether the sidebar is visible (mobile only)
 * - onClose: Callback to close the sidebar (mobile only)
 */
interface SidebarProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

const navigationItems: readonly NavItem[] = [
  { path: '/', label: 'Startseite', icon: '🏠' },
  { path: '/explorer', label: 'Parabel-Explorer', icon: '📈' },
  { path: '/modul/1', label: 'Scheitelpunkt → Normal', icon: '📝' },
  { path: '/modul/2', label: 'Normal → Scheitelpunkt', icon: '📝' },
  { path: '/modul/3', label: 'Termumformungen', icon: '📝' },
] as const;

export default function Sidebar({ isOpen, onClose }: SidebarProps): JSX.Element {
  return (
    <aside
      className={`
        fixed md:static inset-y-0 left-0 z-20
        w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
      data-testid="sidebar"
    >
      <nav className="flex flex-col p-4 space-y-2" aria-label="Main navigation">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
            end={item.path === '/'}
          >
            <span className="text-2xl" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
