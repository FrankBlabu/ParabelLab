import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import type { JSX } from 'react';
import AppShell from './layouts/AppShell';
import HomePage from './pages/HomePage';
import ExplorerPage from './pages/ExplorerPage';
import Module1Page from './pages/Module1Page';
import Module2Page from './pages/Module2Page';
import Module3Page from './pages/Module3Page';

/**
 * Root application component.
 *
 * Provides the main routing structure and layout for the ParabelLab application.
 * Uses AppShell as the parent layout with sidebar navigation and header.
 *
 * Routes:
 * - `/`: Home page with welcome and module cards
 * - `/explorer`: Interactive Parabola Explorer
 * - `/modul/1`: Vertex form to normal form conversion module
 * - `/modul/2`: Normal form to vertex form conversion module
 * - `/modul/3`: Basic term transformations module
 * - `*`: 404 fallback redirects to home
 */
export default function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explorer" element={<ExplorerPage />} />
          <Route path="/modul/1" element={<Module1Page />} />
          <Route path="/modul/2" element={<Module2Page />} />
          <Route path="/modul/3" element={<Module3Page />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
