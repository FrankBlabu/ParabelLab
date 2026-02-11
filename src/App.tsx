import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import type { JSX } from 'react';
import ExplorerPage from './pages/ExplorerPage';
import Module1Page from './pages/Module1Page';

/**
 * Root application component.
 *
 * Provides the main routing structure and layout for the ParabelLab application.
 * Routes the home page to the interactive Parabola Explorer and learning modules
 * to their respective pages.
 */
export default function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ExplorerPage />} />
        <Route path="/module1" element={<Module1Page />} />
      </Routes>
    </Router>
  );
}
