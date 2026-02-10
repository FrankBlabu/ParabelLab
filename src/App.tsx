import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import type { JSX } from 'react';
import ExplorerPage from './pages/ExplorerPage';

/**
 * Root application component.
 *
 * Provides the main routing structure and layout for the ParabelLab application.
 * Routes the home page to the interactive Parabola Explorer.
 */
export default function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ExplorerPage />} />
      </Routes>
    </Router>
  );
}
