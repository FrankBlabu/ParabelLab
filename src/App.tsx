import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import type { JSX } from 'react';
import AppShell from './layouts/AppShell';
import HomePage from './pages/HomePage';

// Lazy-load module pages for better performance
const ExplorerPage = lazy(async () => import('./pages/ExplorerPage'));
const Module1Page = lazy(async () => import('./pages/Module1Page'));
const Module2Page = lazy(async () => import('./pages/Module2Page'));
const Module3Page = lazy(async () => import('./pages/Module3Page'));

/**
 * Loading component for lazy-loaded routes
 */
function LoadingFallback(): JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Lädt...</p>
      </div>
    </div>
  );
}

/**
 * Root application component.
 *
 * Provides the main routing structure and layout for the ParabelLab application.
 * Uses AppShell as the parent layout with sidebar navigation and header.
 *
 * Routes:
 * - `/`: Home page with welcome and module cards
 * - `/explorer`: Interactive Parabola Explorer (lazy-loaded)
 * - `/modul/1`: Vertex form to normal form conversion module (lazy-loaded)
 * - `/modul/2`: Normal form to vertex form conversion module (lazy-loaded)
 * - `/modul/3`: Basic term transformations module (lazy-loaded)
 * - `*`: 404 fallback redirects to home
 */
export default function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/explorer"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <ExplorerPage />
              </Suspense>
            }
          />
          <Route
            path="/modul/1"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Module1Page />
              </Suspense>
            }
          />
          <Route
            path="/modul/2"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Module2Page />
              </Suspense>
            }
          />
          <Route
            path="/modul/3"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Module3Page />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
