/**
 * FormulaDisplay component
 *
 * Displays both vertex form and normal form of a parabola side-by-side
 * (or stacked on mobile). Each form is shown in a visually distinct card
 * with formatted mathematical notation.
 */

import React from 'react';
import type { VertexFormParams, NormalFormParams } from '../../types/parabola';
import { formatVertexForm, formatNormalForm } from '../../utils/formatting';

export interface FormulaDisplayProps {
  /** Vertex form parameters */
  readonly vertexForm: VertexFormParams;
  /** Normal form parameters (derived from vertex form) */
  readonly normalForm: NormalFormParams;
}

/**
 * Renders both parabola forms in separate cards with formatted equations.
 *
 * - Scheitelpunktform (vertex form): f(x) = a(x - d)² + e
 * - Normalform (normal form): f(x) = ax² + bx + c
 *
 * Layout is responsive: side-by-side on larger screens, stacked on mobile.
 */
const FormulaDisplay: React.FC<FormulaDisplayProps> = function FormulaDisplay({
  vertexForm,
  normalForm,
}: FormulaDisplayProps) {
  const vertexFormText = formatVertexForm(vertexForm);
  const normalFormText = formatNormalForm(normalForm);

  return (
    <div
      className="flex flex-col md:flex-row gap-4 w-full"
      data-testid="formula-display"
    >
      {/* Vertex Form Card */}
      <div className="flex-1 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md border-2 border-blue-300">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Scheitelpunktform
        </h3>
        <p
          className="text-2xl font-mono text-blue-800 break-words"
          data-testid="vertex-form-text"
        >
          {vertexFormText}
        </p>
      </div>

      {/* Normal Form Card */}
      <div className="flex-1 p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md border-2 border-green-300">
        <h3 className="text-lg font-semibold text-green-900 mb-3">
          Normalform
        </h3>
        <p
          className="text-2xl font-mono text-green-800 break-words"
          data-testid="normal-form-text"
        >
          {normalFormText}
        </p>
      </div>
    </div>
  );
};

export default FormulaDisplay;
