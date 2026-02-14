/**
 * CoordinateSystem component
 *
 * Composes Grid, Axes, ParabolaCurve, VertexMarker, and SpecialPoints into
 * a single reusable SVG-based coordinate system. Wraps the SVG in a
 * responsive container that maintains aspect ratio using `viewBox` and
 * `preserveAspectRatio`.
 *
 * This is the primary visualization component used across the explorer and
 * all learning modules of Parabola.
 */

import React from 'react';
import type { VertexFormParams } from '../../types/parabola';
import type { Viewport } from '../../types/graph';
import { DEFAULT_VIEWPORT } from '../../types/graph';
import { computeVertex, computeZeros, computeYIntercept } from '../../engine/parabola';
import Grid from './Grid';
import Axes from './Axes';
import ParabolaCurve from './ParabolaCurve';
import VertexMarker from './VertexMarker';
import SpecialPoints from './SpecialPoints';

interface CoordinateSystemProps {
  /** Vertex form parameters defining the parabola to render. */
  readonly parabolaParams: VertexFormParams;
  /** Viewport configuration. Defaults to x ∈ [-10,10], y ∈ [-10,10], 800×600. */
  readonly viewport?: Viewport;
  /** Whether to render grid lines. Defaults to true. */
  readonly showGrid?: boolean;
  /** Whether to render the vertex marker. Defaults to true. */
  readonly showVertex?: boolean;
  /** Whether to render zero (x-intercept) markers. Defaults to false. */
  readonly showZeros?: boolean;
  /** Whether to render the y-intercept marker. Defaults to false. */
  readonly showYIntercept?: boolean;
  /** Stroke color for the parabola curve. */
  readonly curveColor?: string;
  /**
   * Reserved for future drag/interaction support. Currently unused.
   * @default false
   */
  readonly interactive?: boolean;
}

/**
 * Renders a complete coordinate system with an optional parabola curve,
 * vertex marker, zero markers, y-intercept marker, grid, and axes.
 *
 * The SVG scales responsively to fill its parent container while preserving
 * the viewBox aspect ratio.
 */
const CoordinateSystem: React.FC<CoordinateSystemProps> = function CoordinateSystem({
  parabolaParams,
  viewport = DEFAULT_VIEWPORT,
  showGrid = true,
  showVertex = true,
  showZeros = false,
  showYIntercept = false,
  curveColor,
  interactive: _interactive = false,
}: CoordinateSystemProps) {
  const vertex = computeVertex(parabolaParams);
  const zeros = computeZeros(parabolaParams);
  const yIntercept = computeYIntercept(parabolaParams);

  // Generate descriptive aria-label for the graph
  const ariaLabel = `Koordinatensystem mit Parabel. Scheitelpunkt bei S(${vertex.x.toFixed(1)}|${vertex.y.toFixed(1)}). Parameter: a=${parabolaParams.a}, d=${parabolaParams.d}, e=${parabolaParams.e}`;

  return (
    <div
      data-testid="coordinate-system-container"
      className="w-full"
      style={{ minWidth: 280, minHeight: 210 }}
    >
      <svg
        viewBox={`0 0 ${viewport.width} ${viewport.height}`}
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        height="100%"
        role="img"
        aria-label={ariaLabel}
        data-testid="coordinate-system-svg"
        style={{ display: 'block' }}
      >
        {/* Background */}
        <rect
          x={0}
          y={0}
          width={viewport.width}
          height={viewport.height}
          fill="#fafafa"
        />

        {/* Grid (behind everything except background) */}
        {showGrid && <Grid viewport={viewport} />}

        {/* Axes */}
        <Axes viewport={viewport} />

        {/* Parabola curve */}
        <ParabolaCurve
          params={parabolaParams}
          viewport={viewport}
          color={curveColor}
        />

        {/* Special points (zeros and y-intercept) */}
        <SpecialPoints
          zeros={zeros}
          yIntercept={yIntercept}
          showZeros={showZeros}
          showYIntercept={showYIntercept}
          viewport={viewport}
        />

        {/* Vertex marker (rendered last to appear on top) */}
        {showVertex && <VertexMarker vertex={vertex} viewport={viewport} />}
      </svg>
    </div>
  );
};

export default CoordinateSystem;
