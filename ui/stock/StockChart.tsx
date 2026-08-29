"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/stock/StockChart.tsx
//
// Pure SVG polyline chart — no external library dependency.
// Responsive via viewBox. Gradient fill below the line.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useId } from "react";

interface StockChartProps {
  data: number[];
  /** Height in px (viewBox height) */
  height?: number;
  /** Line color */
  color?: string;
  /** Show horizontal guide lines */
  showGrid?: boolean;
  /** Show min/max labels */
  showLabels?: boolean;
}

// Normalize data to svg coordinates
function toPoints(
  data: number[],
  W: number,
  H: number,
  pad: { x: number; y: number }
): string {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const innerW = W - pad.x * 2;
  const innerH = H - pad.y * 2;

  return data
    .map((v, i) => {
      const x = pad.x + (i / (data.length - 1)) * innerW;
      const y = pad.y + innerH - ((v - min) / range) * innerH;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export default function StockChart({
  data,
  height = 160,
  color = "#6366f1",
  showGrid = true,
  showLabels = true,
}: StockChartProps) {
  const id = useId().replace(/:/g, "");
  const W = 600;
  const H = height;
  const pad = { x: 48, y: 16 };

  if (!data || data.length < 2) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center text-gray-700 text-xs"
      >
        No data
      </div>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const innerH = H - pad.y * 2;
  const innerW = W - pad.x * 2;

  const points = toPoints(data, W, H, pad);
  const firstPt = points.split(" ")[0];
  const lastPt = points.split(" ").slice(-1)[0];
  const [lastX, lastY] = lastPt.split(",").map(Number);

  // Area path (close bottom)
  const [firstX] = firstPt.split(",").map(Number);
  const areaPath = `M ${firstX},${H - pad.y} L ${points
    .split(" ")
    .join(" L ")} L ${lastX},${H - pad.y} Z`;

  // Horizontal grid lines (4)
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    y: pad.y + innerH * (1 - f),
    value: (min + range * f).toFixed(0),
  }));

  const isPositive = data[data.length - 1] >= data[0];
  const lineColor = isPositive ? "#34d399" : "#f87171"; // override with green/red if positive/negative
  const fillId = `chart-fill-${id}`;
  const lineColorFinal = color === "#6366f1" ? lineColor : color;

  return (
    <div className="relative w-full" style={{ aspectRatio: `${W}/${H}` }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-full"
        aria-label="Stock price chart"
        role="img"
      >
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={lineColorFinal}
              stopOpacity="0.18"
            />
            <stop
              offset="100%"
              stopColor={lineColorFinal}
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {showGrid &&
          gridLines.map(({ y }, i) => (
            <line
              key={i}
              x1={pad.x}
              y1={y}
              x2={W - pad.x / 2}
              y2={y}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          ))}

        {/* Y-axis labels */}
        {showLabels &&
          gridLines.map(({ y, value }, i) => (
            <text
              key={i}
              x={pad.x - 6}
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fill="rgba(156,163,175,0.5)"
              fontFamily="monospace"
            >
              {Number(value).toLocaleString("en-IN")}
            </text>
          ))}

        {/* Area fill */}
        <path d={areaPath} fill={`url(#${fillId})`} />

        {/* Price line */}
        <polyline
          points={points}
          fill="none"
          stroke={lineColorFinal}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Last price dot */}
        <circle
          cx={lastX}
          cy={lastY}
          r="4"
          fill={lineColorFinal}
          stroke="rgba(7,10,17,0.8)"
          strokeWidth="2"
        />

        {/* Last price label */}
        {showLabels && (
          <text
            x={lastX + 8}
            y={lastY + 4}
            fontSize="11"
            fill={lineColorFinal}
            fontWeight="bold"
            fontFamily="monospace"
          >
            ₹{Number(data[data.length - 1]).toLocaleString("en-IN")}
          </text>
        )}
      </svg>
    </div>
  );
}
