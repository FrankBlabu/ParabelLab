/**
 * Tests for the CoordinateSystem composite component
 *
 * Validates that the CoordinateSystem component renders its sub-components
 * (grid, axes, parabola curve, vertex marker, special points) correctly
 * with various prop configurations. Uses React Testing Library to inspect
 * the rendered SVG DOM.
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CoordinateSystem from '../../../src/components/graph/CoordinateSystem';
import type { Viewport } from '../../../src/types/graph';

/** Standard parabola for most tests: f(x) = (x-0)² + 0 = x². */
const defaultParams = { a: 1, d: 0, e: 0 };

describe('CoordinateSystem', () => {
  /*
   * Smoke test: the component should mount without throwing and produce
   * the outer SVG element.
   */
  it('should render without crashing', () => {
    render(<CoordinateSystem parabolaParams={defaultParams} />);
    const svg = screen.getByTestId('coordinate-system-svg');
    expect(svg).toBeInTheDocument();
  });

  /*
   * The x-axis and y-axis SVG elements should be present by default.
   */
  it('should render both axes', () => {
    render(<CoordinateSystem parabolaParams={defaultParams} />);
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
  });

  /*
   * When showGrid is true (the default), grid lines should be rendered.
   */
  it('should render grid lines when showGrid is true', () => {
    render(<CoordinateSystem parabolaParams={defaultParams} showGrid={true} />);
    expect(screen.getByTestId('grid')).toBeInTheDocument();
  });

  /*
   * When showGrid is false, the grid group should not appear in the DOM.
   */
  it('should hide the grid when showGrid is false', () => {
    render(<CoordinateSystem parabolaParams={defaultParams} showGrid={false} />);
    expect(screen.queryByTestId('grid')).not.toBeInTheDocument();
  });

  /*
   * The parabola path element should always be present.
   */
  it('should render a parabola path element', () => {
    render(<CoordinateSystem parabolaParams={defaultParams} />);
    expect(screen.getByTestId('parabola-path')).toBeInTheDocument();
  });

  /*
   * The vertex marker should be visible by default (showVertex defaults to true).
   */
  it('should render the vertex marker by default', () => {
    render(<CoordinateSystem parabolaParams={defaultParams} />);
    expect(screen.getByTestId('vertex-marker')).toBeInTheDocument();
  });

  /*
   * When showVertex is false, the vertex marker should not appear.
   */
  it('should hide the vertex marker when showVertex is false', () => {
    render(<CoordinateSystem parabolaParams={defaultParams} showVertex={false} />);
    expect(screen.queryByTestId('vertex-marker')).not.toBeInTheDocument();
  });

  /*
   * Zero markers should appear when showZeros is enabled and the parabola
   * has real zeros. f(x) = x² - 4 has zeros at x = ±2.
   */
  it('should render zero markers when showZeros is true', () => {
    const paramsWithZeros = { a: 1, d: 0, e: -4 };
    render(<CoordinateSystem parabolaParams={paramsWithZeros} showZeros={true} />);
    expect(screen.getByTestId('zero-marker-0')).toBeInTheDocument();
    expect(screen.getByTestId('zero-marker-1')).toBeInTheDocument();
  });

  /*
   * The y-intercept marker should appear when showYIntercept is true.
   */
  it('should render y-intercept marker when showYIntercept is true', () => {
    render(<CoordinateSystem parabolaParams={defaultParams} showYIntercept={true} />);
    expect(screen.getByTestId('y-intercept-marker')).toBeInTheDocument();
  });

  /*
   * Changing the viewport should re-render the SVG with the new viewBox
   * dimensions.
   */
  it('should apply a custom viewport to the SVG viewBox', () => {
    const customViewport: Viewport = {
      xMin: -5,
      xMax: 5,
      yMin: -5,
      yMax: 5,
      width: 500,
      height: 500,
    };
    render(
      <CoordinateSystem parabolaParams={defaultParams} viewport={customViewport} />,
    );
    const svg = screen.getByTestId('coordinate-system-svg');
    expect(svg.getAttribute('viewBox')).toBe('0 0 500 500');
  });

  /*
   * The vertex label should display the correct coordinates in the
   * format "S(d|e)". For defaultParams (a=1, d=0, e=0) the vertex is (0,0).
   */
  it('should display the vertex label with correct coordinates', () => {
    const params = { a: 1, d: 3, e: -2 };
    render(<CoordinateSystem parabolaParams={params} />);
    const label = screen.getByTestId('vertex-label');
    expect(label.textContent).toBe('S(3|-2)');
  });
});
