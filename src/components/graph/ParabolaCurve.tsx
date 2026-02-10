/**
 * ParabolaCurve component
 *
 * Renders a parabola as an SVG `<path>` element. Uses the math engine's
 * `generateParabolaPoints()` to sample the curve, converts the points into
 * SVG coordinates, and draws a smooth polyline. The curve is clipped to the
 * visible viewport using an SVG `<clipPath>`.
 */

import React from 'react';
import type { VertexFormParams } from '../../types/parabola';
import type { Viewport } from '../../types/graph';
import { generateParabolaPoints } from '../../engine/parabola';
import { mathToSvg } from './coordinateTransform';

/** Number of sample intervals for curve smoothness. */
const DEFAULT_STEPS = 300;

interface ParabolaCurveProps {
  /** Vertex form parameters defining the parabola. */
  readonly params: VertexFormParams;
  /** Viewport defining the visible math and SVG coordinate range. */
  readonly viewport: Viewport;
  /** Stroke color for the curve. Defaults to a distinct blue. */
  readonly color?: string;
  /** Stroke width for the curve in SVG pixels. Defaults to 2.5. */
  readonly strokeWidth?: number;
}

/**
 * Builds an SVG path `d` attribute string from an array of math-space points.
 *
 * Each point is converted to SVG coordinates and connected with line segments
 * (`L` commands). The first point uses a `M` (move-to) command.
 */
function buildPathData(
  params: VertexFormParams,
  viewport: Viewport,
): string {
  const { xMin, xMax } = viewport;
  const points = generateParabolaPoints(params, xMin, xMax, DEFAULT_STEPS);

  if (points.length === 0) return '';

  const svgPoints = points.map((p) => mathToSvg(p, viewport));
  const first = svgPoints[0];
  const segments = svgPoints
    .slice(1)
    .map((p) => `L ${p.x} ${p.y}`)
    .join(' ');

  return `M ${first.x} ${first.y} ${segments}`;
}

/**
 * Renders the parabola curve as a clipped SVG path.
 */
const ParabolaCurve: React.FC<ParabolaCurveProps> = function ParabolaCurve({
  params,
  viewport,
  color = '#2563eb',
  strokeWidth = 2.5,
}: ParabolaCurveProps) {
  const pathData = buildPathData(params, viewport);

  // Unique clip-path id to avoid clashes if multiple instances exist
  const clipId = 'parabola-clip';

  return (
    <g data-testid="parabola-curve">
      <defs>
        <clipPath id={clipId}>
          <rect x={0} y={0} width={viewport.width} height={viewport.height} />
        </clipPath>
      </defs>
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        clipPath={`url(#${clipId})`}
        data-testid="parabola-path"
      />
    </g>
  );
};

export default ParabolaCurve;
