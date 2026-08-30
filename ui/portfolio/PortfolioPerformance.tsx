"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/portfolio/PortfolioPerformance.tsx
//
// Shows a lightweight portfolio performance chart using SVG path visualization.
// Static 6-month historical demo trend series.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import Card from "../components/Card";
import { DEMO_PERFORMANCE_SERIES } from "../data/portfolio";
import { TrendingUp, Calendar } from "lucide-react";

export default function PortfolioPerformance() {
  const data = DEMO_PERFORMANCE_SERIES;
  const values = data.map((d) => d.value);
  const min = Math.min(...values) * 0.98;
  const max = Math.max(...values) * 1.02;

  // SVG dimensions
  const width = 500;
  const height = 140;
  const padding = 20;

  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((d.value - min) / (max - min)) * (height - 2 * padding);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const areaD = `${pathD} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

  return (
    <Card padding="md" className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Portfolio Performance</h3>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium bg-[#070a11] px-2.5 py-1 rounded-md border border-white/[0.06]">
          <Calendar size={12} className="text-gray-500" />
          <span>Last 6 Months (Demo)</span>
        </div>
      </div>

      {/* SVG Chart Visualization */}
      <div className="mt-4 flex-1 flex flex-col justify-center">
        <div className="relative w-full h-[140px]">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gradient Fill */}
            <path d={areaD} fill="url(#performanceGradient)" />

            {/* Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points */}
            {data.map((d, index) => {
              const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
              const y = height - padding - ((d.value - min) / (max - min)) * (height - 2 * padding);
              return (
                <circle
                  key={d.date}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#10b981"
                  className="transition-transform duration-200 hover:scale-150 cursor-pointer"
                >
                  <title>{`${d.date}: ₹${d.value.toLocaleString("en-IN")}`}</title>
                </circle>
              );
            })}
          </svg>
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-between px-2 mt-2 text-[10px] text-gray-500 font-medium">
          {data.map((d) => (
            <span key={d.date}>{d.date}</span>
          ))}
        </div>
      </div>
    </Card>
  );
}
