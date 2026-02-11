/**
 * ExplorerPage component
 *
 * Main interactive explorer page where students manipulate parabola parameters
 * via sliders and see real-time updates on the coordinate system and in both
 * equation forms (vertex and normal).
 *
 * Layout:
 * - Top section: coordinate system (left/top 60%) + parameter controls (right/bottom 40%)
 * - Bottom section: formula display showing both forms (full width)
 *
 * Responsive: stacks vertically on mobile devices.
 */

import type { JSX } from 'react';
import { useParabola } from '../hooks/useParabola';
import CoordinateSystem from '../components/graph/CoordinateSystem';
import ParameterControls from '../components/ui/ParameterControls';
import FormulaDisplay from '../components/math/FormulaDisplay';

/**
 * Renders the interactive parabola explorer page.
 *
 * Students can:
 * - Adjust parameters a, d, e via sliders
 * - See the parabola update in real time
 * - View both vertex form and normal form
 * - See the vertex marker on the graph
 * - Reset parameters to defaults
 */
export default function ExplorerPage(): JSX.Element {
  const { vertexForm, normalForm, setA, setD, setE, reset } = useParabola();

  // Display warning when a = 0 (degenerate case)
  const showWarning = vertexForm.a === 0;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8"
      data-testid="explorer-page"
    >
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
          Parabel-Explorer
        </h1>

        {/* Warning for a = 0 */}
        {showWarning && (
          <div
            className="mb-6 p-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg text-yellow-900"
            role="alert"
            data-testid="warning-a-zero"
          >
            <strong>Warnung:</strong> Der Parameter a darf nicht 0 sein.
            Eine Parabel ist nur für a ≠ 0 definiert.
          </div>
        )}

        {/* Main Content: Graph + Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Left/Top: Coordinate System (60% on large screens) */}
          <div className="flex-1 lg:w-3/5 bg-white rounded-lg shadow-lg p-6">
            {!showWarning ? (
              <CoordinateSystem
                parabolaParams={vertexForm}
                showGrid={true}
                showVertex={true}
                showZeros={false}
                showYIntercept={false}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Graph nicht verfügbar für a = 0
              </div>
            )}
          </div>

          {/* Right/Bottom: Parameter Controls (40% on large screens) */}
          <div className="lg:w-2/5">
            <ParameterControls
              params={vertexForm}
              onAChange={setA}
              onDChange={setD}
              onEChange={setE}
              onReset={reset}
            />
          </div>
        </div>

        {/* Bottom: Formula Display (Full Width) */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <FormulaDisplay vertexForm={vertexForm} normalForm={normalForm} />
        </div>
      </div>
    </div>
  );
}
