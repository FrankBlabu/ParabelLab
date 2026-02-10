/**
 * ParameterControls component
 *
 * Groups three SliderControl instances for adjusting parabola parameters (a, d, e).
 * Provides a "Zurücksetzen" (Reset) button to restore default values.
 * Responsive layout: vertical stack on mobile, horizontal on larger screens.
 */

import React from 'react';
import type { VertexFormParams } from '../../types/parabola';
import Slider from './Slider';

export interface ParameterControlsProps {
  /** Current vertex form parameters */
  readonly params: VertexFormParams;
  /** Callback for updating parameter 'a' */
  readonly onAChange: (value: number) => void;
  /** Callback for updating parameter 'd' */
  readonly onDChange: (value: number) => void;
  /** Callback for updating parameter 'e' */
  readonly onEChange: (value: number) => void;
  /** Callback for resetting all parameters to defaults */
  readonly onReset: () => void;
}

/**
 * Renders parameter controls for manipulating parabola vertex form.
 *
 * - Parameter 'a': stretch/compression/reflection (-5 to 5, step 0.1)
 * - Parameter 'd': horizontal shift (-10 to 10, step 0.5)
 * - Parameter 'e': vertical shift (-10 to 10, step 0.5)
 * - Reset button to restore defaults (a=1, d=0, e=0)
 */
const ParameterControls: React.FC<ParameterControlsProps> = function ParameterControls({
  params,
  onAChange,
  onDChange,
  onEChange,
  onReset,
}: ParameterControlsProps) {
  return (
    <div
      className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow-md"
      data-testid="parameter-controls"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Parameter</h2>

      <Slider
        label="a (Streckung)"
        value={params.a}
        min={-5}
        max={5}
        step={0.1}
        onChange={onAChange}
      />

      <Slider
        label="d (Horizontal)"
        value={params.d}
        min={-10}
        max={10}
        step={0.5}
        onChange={onDChange}
      />

      <Slider
        label="e (Vertikal)"
        value={params.e}
        min={-10}
        max={10}
        step={0.5}
        onChange={onEChange}
      />

      <button
        onClick={onReset}
        className="mt-4 px-6 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 active:bg-primary-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        data-testid="reset-button"
      >
        Zurücksetzen
      </button>
    </div>
  );
};

export default ParameterControls;
