"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/dashboard/LynchInsight.tsx
//
// Insight card shown on the dashboard for a specific stock.
// Displays signal, risk, insight text, and a "View Analysis" action.
// Does NOT implement agent reasoning — data comes through props.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Minus,
  AlertTriangle,
  ChevronRight,
  Zap,
} from "lucide-react";
import type { InsightData } from "../data/demo";

interface LynchInsightProps {
  insight: InsightData;
  onViewAnalysis?: (symbol: string) => void;
}

// ---------------------------------------------------------------------------
// Signal config
// ---------------------------------------------------------------------------

const SIGNAL_CFG = {
  BUY: {
    icon: <TrendingUp size={11} />,
    cls: "text-emerald-400 bg-emerald-400/10 border-emerald-500/30",
    bar: "bg-emerald-400",
  },
  HOLD: {
    icon: <Minus size={11} />,
    cls: "text-amber-400 bg-amber-400/10 border-amber-500/30",
    bar: "bg-amber-400",
  },
  WATCH: {
    icon: <Eye size={11} />,
    cls: "text-sky-400 bg-sky-400/10 border-sky-500/30",
    bar: "bg-sky-400",
  },
  REDUCE: {
    icon: <TrendingDown size={11} />,
    cls: "text-orange-400 bg-orange-400/10 border-orange-500/30",
    bar: "bg-orange-400",
  },
  AVOID: {
    icon: <AlertTriangle size={11} />,
    cls: "text-red-400 bg-red-400/10 border-red-500/30",
    bar: "bg-red-400",
  },
};

const RISK_CFG = {
  LOW: { cls: "text-emerald-400/80", label: "Low Risk" },
  MEDIUM: { cls: "text-amber-400/80", label: "Medium Risk" },
  HIGH: { cls: "text-red-400/80", label: "High Risk" },
};

// ---------------------------------------------------------------------------
// Confidence mini-bar
// ---------------------------------------------------------------------------

function ConfidenceBar({ value }: { value: number }) {
  const color =
    value >= 75
      ? "bg-emerald-400"
      : value >= 55
      ? "bg-amber-400"
      : "bg-orange-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[10px] tabular-nums text-gray-600 font-semibold w-7 text-right">
        {value}%
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LynchInsight
// ---------------------------------------------------------------------------

export default function LynchInsight({
  insight,
  onViewAnalysis,
}: LynchInsightProps) {
  const sig = SIGNAL_CFG[insight.signal];
  const risk = RISK_CFG[insight.risk];

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#0d1117] overflow-hidden transition-colors hover:border-white/[0.12]">
      {/* Header */}
      <div className="px-4 pt-3.5 pb-2.5 flex items-start justify-between gap-3 border-b border-white/[0.05]">
        <div className="min-w-0">
          {/* Insight label */}
          <div className="flex items-center gap-1.5 mb-1">
            <Zap size={10} className="text-indigo-500 shrink-0" />
            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-indigo-500/80">
              LYNCH INSIGHT
            </span>
          </div>
          {/* Symbol + name */}
          <p className="text-sm font-black text-white tracking-wide">
            {insight.symbol}
          </p>
          <p className="text-[11px] text-gray-600 mt-0.5 truncate">
            {insight.name}
          </p>
        </div>

        {/* Signal + risk badges */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full
              text-[9px] font-black uppercase tracking-widest border ${sig.cls}`}
          >
            {sig.icon}
            {insight.signal}
          </span>
          <span className={`text-[9px] font-semibold ${risk.cls}`}>
            {risk.label}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        {/* Confidence */}
        <div className="mb-2.5">
          <p className="text-[9px] uppercase tracking-widest text-gray-700 font-bold mb-1">
            Confidence
          </p>
          <ConfidenceBar value={insight.confidence} />
        </div>

        {/* Insight text */}
        <p className="text-[12px] text-gray-400 leading-relaxed">
          {insight.insight}
        </p>

        {/* View Analysis */}
        <button
          onClick={() => onViewAnalysis?.(insight.symbol)}
          className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-indigo-400
            hover:text-indigo-300 transition-colors group"
        >
          View Analysis
          <ChevronRight
            size={12}
            className="transition-transform duration-150 group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </div>
  );
}
