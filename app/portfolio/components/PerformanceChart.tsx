"use client";

// ─────────────────────────────────────────────────────────────────────────────
// app/portfolio/components/PerformanceChart.tsx
//
// 6-Month portfolio performance chart.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import Card from "@/ui/components/Card";
import { DEMO_PERFORMANCE_SERIES } from "../data/demo-data";
import { TrendingUp, Calendar } from "lucide-react";

export default function PerformanceChart() {
  const data = DEMO_PERFORMANCE_SERIES;
  const values = data.map((d) => d.value);
  const min = Math.min(...values) * 0.98;
  const max = Math.max(...values) * 1.02;

  const width = 600;
  const height = 150;
  const padding = 20;

  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((d.value - min) / (max - min)) * (height - 2 * padding);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const areaD = `${pathD} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

  return (
    <Card padding="md" className="flex flex-col h-full bg-[#0d1117]/80">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Portfolio Performance</h3>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 bg-[#070a11] px-2.5 py-1 rounded-md border border-white/[0.06]">
          <Calendar size={12} className="text-gray-500" />
          <span>6 Months Trend (Demo)</span>
        </div>
      </div>

      <div className="mt-4 flex-1 flex flex-col justify-center">
        <div className="relative w-full h-[150px]">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <path d={areaD} fill="url(#perfGrad)" />
            <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />

            {data.map((d, i) => {
              const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
              const y = height - padding - ((d.value - min) / (max - min)) * (height - 2 * padding);
              return (
                <circle key={d.date} cx={x} cy={y} r="4" fill="#10b981" className="hover:scale-150 transition-transform">
                  <title>{`${d.date}: ₹${d.value.toLocaleString("en-IN")}`}</title>
                </circle>
              );
            })}
          </svg>
        </div>

        <div className="flex justify-between px-2 mt-2 text-[10px] text-gray-500 font-medium">
          {data.map((d) => (
            <span key={d.date}>{d.date}</span>
          ))}
        </div>
      </div>
    </Card>
  );
}
