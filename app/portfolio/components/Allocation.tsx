"use client";

// ─────────────────────────────────────────────────────────────────────────────
// app/portfolio/components/Allocation.tsx
//
// Clean visualization for Portfolio Allocation by Holding or Sector.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import Card from "@/ui/components/Card";
import { Holding } from "../types";
import { getSectorAllocations } from "../utils";
import { PieChart } from "lucide-react";

interface AllocationProps {
  holdings: Holding[];
  totalValue: number;
}

const PALETTE = ["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#14b8a6"];

export default function Allocation({ holdings, totalValue }: AllocationProps) {
  const [viewMode, setViewMode] = useState<"holding" | "sector">("holding");
  const sectors = getSectorAllocations(holdings);

  return (
    <Card padding="md" className="flex flex-col h-full bg-[#0d1117]/80">
      {/* Title & View Switch */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <PieChart size={16} className="text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Portfolio Allocation</h3>
        </div>

        <div className="flex bg-[#070a11] p-1 rounded-lg border border-white/[0.06]">
          <button
            onClick={() => setViewMode("holding")}
            className={[
              "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
              viewMode === "holding"
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-400 hover:text-white",
            ].join(" ")}
          >
            Holding
          </button>
          <button
            onClick={() => setViewMode("sector")}
            className={[
              "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
              viewMode === "sector"
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-400 hover:text-white",
            ].join(" ")}
          >
            Sector
          </button>
        </div>
      </div>

      {/* Stacked Progress Bar */}
      <div className="mt-4">
        <div className="h-3 w-full bg-[#070a11] rounded-full overflow-hidden flex p-0.5 border border-white/[0.06]">
          {viewMode === "holding"
            ? holdings.map((h, i) => (
                <div
                  key={h.symbol}
                  className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300"
                  style={{
                    width: `${h.allocationPct}%`,
                    backgroundColor: PALETTE[i % PALETTE.length],
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
                    backgroundColor: PALETTE[i % PALETTE.length],
                  }}
                  title={`${s.sector}: ${s.allocationPct}%`}
                />
              ))}
        </div>
      </div>

      {/* List items */}
      <div className="mt-4 space-y-2.5 flex-1 overflow-y-auto max-h-[220px] pr-1">
        {viewMode === "holding"
          ? holdings.map((h, i) => (
              <div
                key={h.symbol}
                className="flex items-center justify-between p-2 rounded-lg bg-[#070a11]/60 border border-white/[0.03]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                  />
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate">{h.symbol}</p>
                    <p className="text-[10px] text-gray-500 truncate">{h.name}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-indigo-300">{h.allocationPct}%</p>
                  <p className="text-[10px] text-gray-500">
                    ₹{Math.round((totalValue * h.allocationPct) / 100).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))
          : sectors.map((s, i) => (
              <div
                key={s.sector}
                className="flex items-center justify-between p-2 rounded-lg bg-[#070a11]/60 border border-white/[0.03]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                  />
                  <p className="text-xs font-bold text-white truncate">{s.sector}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-indigo-300">{s.allocationPct}%</p>
                  <p className="text-[10px] text-gray-500">
                    ₹{Math.round(s.value).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
      </div>
    </Card>
  );
}
