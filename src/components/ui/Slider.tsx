/**
 * Slider component
 *
 * A labeled range input control for adjusting numeric parameters.
 * Includes parameter name display, current value, and accessible ARIA attributes.
 * Styled with Tailwind for a modern, responsive appearance.
 */

import React from 'react';

export interface SliderProps {
  /** Parameter name (e.g., "a", "d", "e") displayed as label */
  readonly label: string;
  /** Current value of the parameter */
  readonly value: number;
  /** Minimum allowed value */
  readonly min: number;
  /** Maximum allowed value */
  readonly max: number;
  /** Step size for slider increments */
  readonly step: number;
  /** Callback invoked when the slider value changes */
  readonly onChange: (value: number) => void;
  /** Optional additional CSS classes for the container */
  readonly className?: string;
}

/**
 * Renders a labeled slider control with accessible attributes.
 *
 * The slider displays:
 * - Parameter label
 * - Current value with appropriate precision
 * - Range input with configurable min, max, and step
 */
const Slider: React.FC<SliderProps> = function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  className = '',
}: SliderProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseFloat(event.target.value);
    onChange(newValue);
  };

  // Format the value to avoid unnecessary decimal places
  const formattedValue = Number.isInteger(value) ? value.toString() : value.toFixed(2);

  return (
    <div className={`flex flex-col gap-2 ${className}`} data-testid={`slider-${label}`}>
      <div className="flex justify-between items-center">
        <label
          htmlFor={`slider-input-${label}`}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <span className="text-sm font-semibold text-primary-700 min-w-[4rem] text-right">
          {formattedValue}
        </span>
      </div>
      <input
        id={`slider-input-${label}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        aria-label={`${label} parameter`}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 transition-colors"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default Slider;
