"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/stock/StockMetrics.tsx
//
// Grid of key financial metrics for a stock.
// Accepts a flat array of { label, value } pairs via props.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { BarChart2 } from "lucide-react";

export interface Metric {
  label: string;
  value: string;
}

interface StockMetricsProps {
  metrics: Metric[];
}

export default function StockMetrics({ metrics }: StockMetricsProps) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 size={13} className="text-indigo-500/70" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.14em] text-gray-500">
          Key Metrics
        </h3>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {metrics.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-white/[0.06] bg-[#0d1117] px-4 py-3"
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-600">
              {label}
            </p>
            <p className="text-base font-black text-white mt-1 tabular-nums">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
