/**
 * SpecialPoints component — zero markers and y-intercept marker
 *
 * Renders small markers at the x-intercepts (zeros / Nullstellen) and the
 * y-intercept of a parabola. Each marker is a small coloured dot with an
 * optional coordinate label. Visibility of zeros and y-intercept can be
 * toggled independently via props.
 */

import React from 'react';
import type { Point } from '../../types/parabola';
import type { Viewport } from '../../types/graph';
import { mathToSvg } from './coordinateTransform';

/** Radius of a special-point dot in SVG pixels. */
const DOT_RADIUS = 4;

/** Font size for coordinate labels in SVG pixels. */
const LABEL_FONT_SIZE = 11;

/** Offset of the label from the dot center in SVG pixels. */
const LABEL_OFFSET = 10;

interface SpecialPointsProps {
  /** Array of zero-point (x-intercept) positions in math coordinates. */
  readonly zeros: readonly Point[];
  /** Y-intercept position in math coordinates. */
  readonly yIntercept: Point;
  /** Whether to render zero markers. */
  readonly showZeros: boolean;
  /** Whether to render the y-intercept marker. */
  readonly showYIntercept: boolean;
  /** Viewport defining the visible math and SVG coordinate range. */
  readonly viewport: Viewport;
  /** Whether to always show coordinate labels (default: true). */
  readonly showLabels?: boolean;
}

/**
 * Formats a number for display in a coordinate label, rounding to at most
 * two decimal places and stripping trailing zeros.
 */
function formatCoord(value: number): string {
  return Number(value.toFixed(2)).toString();
}

/**
 * Renders a single marker dot with an optional coordinate label.
 */
function renderMarker(
  point: Point,
  viewport: Viewport,
  color: string,
  testId: string,
  showLabel: boolean,
): React.ReactElement {
  const svgPos = mathToSvg(point, viewport);

  return (
    <g key={testId} data-testid={testId}>
      <circle
        cx={svgPos.x}
        cy={svgPos.y}
        r={DOT_RADIUS}
        fill={color}
        stroke="#fff"
        strokeWidth={1}
      />
      {showLabel && (
        <text
          x={svgPos.x + LABEL_OFFSET}
          y={svgPos.y - LABEL_OFFSET}
          fontSize={LABEL_FONT_SIZE}
          fill={color}
        >
          ({formatCoord(point.x)}|{formatCoord(point.y)})
        </text>
      )}
    </g>
  );
}

/**
 * Renders zero markers and/or the y-intercept marker for the parabola.
 */
const SpecialPoints: React.FC<SpecialPointsProps> = function SpecialPoints({
  zeros,
  yIntercept,
  showZeros,
  showYIntercept,
  viewport,
  showLabels = true,
}: SpecialPointsProps) {
  return (
    <g data-testid="special-points">
      {showZeros &&
        zeros.map((z, i) =>
          renderMarker(z, viewport, '#16a34a', `zero-marker-${i}`, showLabels),
        )}
      {showYIntercept &&
        renderMarker(yIntercept, viewport, '#9333ea', 'y-intercept-marker', showLabels)}
    </g>
  );
};

export default SpecialPoints;
