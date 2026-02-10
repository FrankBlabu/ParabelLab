/**
 * Grid component for the coordinate system
 *
 * Renders vertical and horizontal grid lines at integer intervals within the
 * visible viewport. Every 5th grid line is highlighted with a stronger stroke
 * to aid visual orientation. Grid lines use subtle colors so they don't
 * compete with the plotted curve and axes.
 */

import React from 'react';
import type { Viewport } from '../../types/graph';
import { mathToSvg } from './coordinateTransform';

interface GridProps {
  /** Viewport defining the visible math and SVG coordinate range. */
  readonly viewport: Viewport;
}

/**
 * Renders SVG grid lines for the coordinate system.
 *
 * Vertical lines are drawn for each integer x in [xMin, xMax], and horizontal
 * lines for each integer y in [yMin, yMax]. Lines at multiples of 5 receive
 * a stronger stroke for emphasis.
 */
const Grid: React.FC<GridProps> = React.memo(function Grid({ viewport }: GridProps) {
  const { xMin, xMax, yMin, yMax } = viewport;
  const lines: React.ReactElement[] = [];

  // Vertical grid lines (one per integer x)
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
    const top = mathToSvg({ x, y: yMax }, viewport);
    const bottom = mathToSvg({ x, y: yMin }, viewport);
    const isMajor = x % 5 === 0;

    lines.push(
      <line
        key={`v-${x}`}
        x1={top.x}
        y1={top.y}
        x2={bottom.x}
        y2={bottom.y}
        stroke="#d1d5db"
        strokeWidth={isMajor ? 1.0 : 0.5}
        opacity={isMajor ? 0.6 : 0.35}
        data-testid={`grid-line-v-${x}`}
      />,
    );
  }

  // Horizontal grid lines (one per integer y)
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
    const left = mathToSvg({ x: xMin, y }, viewport);
    const right = mathToSvg({ x: xMax, y }, viewport);
    const isMajor = y % 5 === 0;

    lines.push(
      <line
        key={`h-${y}`}
        x1={left.x}
        y1={left.y}
        x2={right.x}
        y2={right.y}
        stroke="#d1d5db"
        strokeWidth={isMajor ? 1.0 : 0.5}
        opacity={isMajor ? 0.6 : 0.35}
        data-testid={`grid-line-h-${y}`}
      />,
    );
  }

  return <g data-testid="grid">{lines}</g>;
});

export default Grid;
