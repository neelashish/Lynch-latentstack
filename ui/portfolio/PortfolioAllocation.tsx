"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/portfolio/PortfolioAllocation.tsx
//
// Displays portfolio allocation breakdown by holding and sector.
// Lightweight visual visualization built with CSS/SVG (no extra dependencies).
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import Card from "../components/Card";
import { Holding, SectorAllocation, getSectorAllocations } from "../data/portfolio";
import { PieChart, Layers } from "lucide-react";

interface PortfolioAllocationProps {
  holdings: Holding[];
}

const COLOR_PALETTE = [
  "#6366f1", // Indigo
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#8b5cf6", // Purple
];

export default function PortfolioAllocation({ holdings }: PortfolioAllocationProps) {
  const [viewMode, setViewMode] = useState<"holding" | "sector">("holding");
  const sectors: SectorAllocation[] = getSectorAllocations();

  return (
    <Card padding="md" className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <PieChart size={18} className="text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Portfolio Allocation</h3>
        </div>

        {/* View mode toggle */}
        <div className="flex bg-[#070a11] p-1 rounded-lg border border-white/[0.06]">
          <button
            onClick={() => setViewMode("holding")}
            className={[
              "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
              viewMode === "holding"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-400 hover:text-white",
            ].join(" ")}
          >
            By Holding
          </button>
          <button
            onClick={() => setViewMode("sector")}
            className={[
              "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
              viewMode === "sector"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-400 hover:text-white",
            ].join(" ")}
          >
            By Sector
          </button>
        </div>
      </div>

      {/* Visual Bar Allocation */}
      <div className="mt-4">
        <p className="text-xs text-gray-400 mb-2 font-medium">
          {viewMode === "holding" ? "Holding Breakdown" : "Sector Breakdown"}
        </p>
        <div className="h-3 w-full bg-[#070a11] rounded-full overflow-hidden flex p-0.5 border border-white/[0.06]">
          {viewMode === "holding"
            ? holdings.map((h, i) => (
                <div
                  key={h.symbol}
                  className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300"
                  style={{
                    width: `${h.allocationPct}%`,
                    backgroundColor: COLOR_PALETTE[i % COLOR_PALETTE.length],
                  }}
                  title={`${h.symbol}: ${h.allocationPct}%`}
                />
              ))
            : sectors.map((s, i) => (
                <div
                  key={s.sector}
                  className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300"
                  style={{
                    width: `${s.allocationPct}%`,
                    backgroundColor: COLOR_PALETTE[i % COLOR_PALETTE.length],
                  }}
                  title={`${s.sector}: ${s.allocationPct}%`}
                />
              ))}
        </div>
      </div>

      {/* Item List */}
      <div className="mt-5 space-y-3 flex-1 overflow-y-auto max-h-[260px] pr-1">
        {viewMode === "holding"
          ? holdings.map((h, i) => (
              <div
                key={h.symbol}
                className="flex items-center justify-between p-2 rounded-lg bg-[#070a11]/60 border border-white/[0.03] hover:border-white/[0.08] transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: COLOR_PALETTE[i % COLOR_PALETTE.length] }}
                  />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-white truncate">{h.symbol}</p>
                    <p className="text-[10px] text-gray-500 truncate">{h.name}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-indigo-300">{h.allocationPct}%</p>
                  <p className="text-[10px] text-gray-500">
                    ₹{( (1245000 * h.allocationPct) / 100 ).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))
          : sectors.map((s, i) => (
              <div
                key={s.sector}
                className="flex items-center justify-between p-2 rounded-lg bg-[#070a11]/60 border border-white/[0.03] hover:border-white/[0.08] transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: COLOR_PALETTE[i % COLOR_PALETTE.length] }}
                  />
                  <div className="flex items-center gap-1.5 truncate">
                    <Layers size={12} className="text-gray-500 shrink-0" />
                    <p className="text-xs font-semibold text-white truncate">{s.sector}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-indigo-300">{s.allocationPct}%</p>
                  <p className="text-[10px] text-gray-500">
                    ₹{s.value.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
      </div>
    </Card>
  );
}
