import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import type { JSX } from 'react';

/**
 * Root application component.
 *
 * Provides the main routing structure and layout for the ParabelLab application.
 * Currently renders a placeholder component while the application is being developed.
 */
export default function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-primary-50 to-primary-100">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-primary-900 mb-4">
                  ParabelLab
                </h1>
                <p className="text-lg text-primary-700">
                  Interactive Parabola Learning Application
                </p>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}
