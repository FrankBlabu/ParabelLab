/**
 * VertexMarker component
 *
 * Renders a highlighted point at the vertex position of the parabola,
 * accompanied by a coordinate label in the German math notation "S(d|e)".
 * Uses a distinct red color to stand out from the curve and axes.
 */

import React from 'react';
import type { Point } from '../../types/parabola';
import type { Viewport } from '../../types/graph';
import { mathToSvg } from './coordinateTransform';

/** Radius of the vertex dot in SVG pixels. */
const DOT_RADIUS = 5;

/** Font size of the vertex label in SVG pixels. */
const LABEL_FONT_SIZE = 12;

/** Offset of the label from the dot center in SVG pixels. */
const LABEL_OFFSET = 12;

interface VertexMarkerProps {
  /** The vertex point in math coordinates. */
  readonly vertex: Point;
  /** Viewport defining the visible math and SVG coordinate range. */
  readonly viewport: Viewport;
}

/**
 * Formats a number for display in the vertex label, rounding to at most
 * two decimal places and stripping trailing zeros.
 */
function formatCoord(value: number): string {
  return Number(value.toFixed(2)).toString();
}

/**
 * Renders the vertex as a red dot with a coordinate label at the vertex position.
 */
const VertexMarker: React.FC<VertexMarkerProps> = function VertexMarker({
  vertex,
  viewport,
}: VertexMarkerProps) {
  const svgPos = mathToSvg(vertex, viewport);

  return (
    <g data-testid="vertex-marker">
      <circle
        cx={svgPos.x}
        cy={svgPos.y}
        r={DOT_RADIUS}
        fill="#dc2626"
        stroke="#fff"
        strokeWidth={1.5}
        data-testid="vertex-dot"
      />
      <text
        x={svgPos.x + LABEL_OFFSET}
        y={svgPos.y - LABEL_OFFSET}
        fontSize={LABEL_FONT_SIZE}
        fontWeight="bold"
        fill="#dc2626"
        data-testid="vertex-label"
      >
        S({formatCoord(vertex.x)}|{formatCoord(vertex.y)})
      </text>
    </g>
  );
};

export default VertexMarker;
