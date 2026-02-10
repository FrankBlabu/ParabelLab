/**
 * Axes component for the coordinate system
 *
 * Renders the x-axis and y-axis as bold lines through the origin, with tick
 * marks at integer positions, numeric labels, axis endpoint labels ("x" / "y"),
 * and arrowheads at the positive ends. The 0 label is omitted to avoid visual
 * clutter at the origin.
 */

import React from 'react';
import type { Viewport } from '../../types/graph';
import { mathToSvg } from './coordinateTransform';

interface AxesProps {
  /** Viewport defining the visible math and SVG coordinate range. */
  readonly viewport: Viewport;
}

/** Size (half-side) of each tick mark in SVG pixels. */
const TICK_SIZE = 4;

/** Font size for numeric tick labels in SVG pixels. */
const LABEL_FONT_SIZE = 11;

/** Font size for axis endpoint labels ("x", "y") in SVG pixels. */
const AXIS_LABEL_FONT_SIZE = 14;

/**
 * Renders SVG axes, tick marks, labels, and arrowheads for the coordinate system.
 */
const Axes: React.FC<AxesProps> = React.memo(function Axes({ viewport }: AxesProps) {
  const { xMin, xMax, yMin, yMax } = viewport;

  // Compute SVG positions for the axis lines clamped to viewport
  const origin = mathToSvg({ x: 0, y: 0 }, viewport);
  const xAxisStart = mathToSvg({ x: xMin, y: 0 }, viewport);
  const xAxisEnd = mathToSvg({ x: xMax, y: 0 }, viewport);
  const yAxisStart = mathToSvg({ x: 0, y: yMin }, viewport);
  const yAxisEnd = mathToSvg({ x: 0, y: yMax }, viewport);

  const ticks: React.ReactElement[] = [];
  const labels: React.ReactElement[] = [];

  // X-axis tick marks and labels
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
    if (x === 0) continue; // skip 0 to avoid overlap at origin
    const pos = mathToSvg({ x, y: 0 }, viewport);
    ticks.push(
      <line
        key={`tx-${x}`}
        x1={pos.x}
        y1={origin.y - TICK_SIZE}
        x2={pos.x}
        y2={origin.y + TICK_SIZE}
        stroke="#1f2937"
        strokeWidth={1}
      />,
    );
    labels.push(
      <text
        key={`lx-${x}`}
        x={pos.x}
        y={origin.y + TICK_SIZE + LABEL_FONT_SIZE + 2}
        textAnchor="middle"
        fontSize={LABEL_FONT_SIZE}
        fill="#4b5563"
      >
        {x}
      </text>,
    );
  }

  // Y-axis tick marks and labels
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
    if (y === 0) continue; // skip 0 to avoid overlap at origin
    const pos = mathToSvg({ x: 0, y }, viewport);
    ticks.push(
      <line
        key={`ty-${y}`}
        x1={origin.x - TICK_SIZE}
        y1={pos.y}
        x2={origin.x + TICK_SIZE}
        y2={pos.y}
        stroke="#1f2937"
        strokeWidth={1}
      />,
    );
    labels.push(
      <text
        key={`ly-${y}`}
        x={origin.x - TICK_SIZE - 4}
        y={pos.y + LABEL_FONT_SIZE / 3}
        textAnchor="end"
        fontSize={LABEL_FONT_SIZE}
        fill="#4b5563"
      >
        {y}
      </text>,
    );
  }

  return (
    <g data-testid="axes">
      {/* Arrow marker definitions */}
      <defs>
        <marker
          id="arrowhead-x"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#1f2937" />
        </marker>
        <marker
          id="arrowhead-y"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#1f2937" />
        </marker>
      </defs>

      {/* X-axis line with arrowhead */}
      <line
        x1={xAxisStart.x}
        y1={origin.y}
        x2={xAxisEnd.x}
        y2={origin.y}
        stroke="#1f2937"
        strokeWidth={2}
        markerEnd="url(#arrowhead-x)"
        data-testid="x-axis"
      />

      {/* Y-axis line with arrowhead (points upward → toward lower SVG y) */}
      <line
        x1={origin.x}
        y1={yAxisStart.y}
        x2={origin.x}
        y2={yAxisEnd.y}
        stroke="#1f2937"
        strokeWidth={2}
        markerEnd="url(#arrowhead-y)"
        data-testid="y-axis"
      />

      {/* Tick marks */}
      {ticks}

      {/* Numeric labels */}
      {labels}

      {/* Axis endpoint labels */}
      <text
        x={xAxisEnd.x - 4}
        y={origin.y - 10}
        fontSize={AXIS_LABEL_FONT_SIZE}
        fontStyle="italic"
        fill="#1f2937"
        textAnchor="end"
        data-testid="x-axis-label"
      >
        x
      </text>
      <text
        x={origin.x + 14}
        y={yAxisEnd.y + 14}
        fontSize={AXIS_LABEL_FONT_SIZE}
        fontStyle="italic"
        fill="#1f2937"
        textAnchor="start"
        data-testid="y-axis-label"
      >
        y
      </text>
    </g>
  );
});

export default Axes;
