"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/stock/LynchAnalysis.tsx
//
// LYNCH VIEW section on the stock detail page.
// Shows signal, confidence, risk, and the reasoning breakdown.
// This is one of the strongest visual components in the app.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Minus,
  AlertTriangle,
  Shield,
  Zap,
  CheckCircle2,
} from "lucide-react";
import type { LynchView, RiskLevel } from "../data/demo";

export interface AnalysisReason {
  type: "positive" | "warning";
  text: string;
}

interface LynchAnalysisProps {
  signal: LynchView;
  confidence: number;
  risk: RiskLevel;
  reasons: AnalysisReason[];
}

// ---------------------------------------------------------------------------
// Config maps
// ---------------------------------------------------------------------------

const SIGNAL_CFG: Record<
  LynchView,
  { icon: React.ReactNode; label: string; cls: string; glow: string }
> = {
  BUY: {
    icon: <TrendingUp size={18} />,
    label: "BUY",
    cls: "text-emerald-400 border-emerald-500/30 bg-emerald-400/10",
    glow: "shadow-[0_0_20px_rgba(52,211,153,0.12)]",
  },
  HOLD: {
    icon: <Minus size={18} />,
    label: "HOLD",
    cls: "text-amber-400 border-amber-500/30 bg-amber-400/10",
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.10)]",
  },
  WATCH: {
    icon: <Eye size={18} />,
    label: "WATCH",
    cls: "text-sky-400 border-sky-500/30 bg-sky-400/10",
    glow: "shadow-[0_0_20px_rgba(56,189,248,0.10)]",
  },
  REDUCE: {
    icon: <TrendingDown size={18} />,
    label: "REDUCE",
    cls: "text-orange-400 border-orange-500/30 bg-orange-400/10",
    glow: "shadow-[0_0_20px_rgba(251,146,60,0.10)]",
  },
  AVOID: {
    icon: <AlertTriangle size={18} />,
    label: "AVOID",
    cls: "text-red-400 border-red-500/30 bg-red-400/10",
    glow: "shadow-[0_0_20px_rgba(248,113,113,0.10)]",
  },
};

const RISK_CFG: Record<RiskLevel, { cls: string; label: string; barW: string; bar: string }> = {
  LOW: {
    cls: "text-emerald-400",
    label: "LOW RISK",
    barW: "w-1/3",
    bar: "bg-emerald-400",
  },
  MEDIUM: {
    cls: "text-amber-400",
    label: "MEDIUM RISK",
    barW: "w-2/3",
    bar: "bg-amber-400",
  },
  HIGH: {
    cls: "text-red-400",
    label: "HIGH RISK",
    barW: "w-full",
    bar: "bg-red-400",
  },
};

// ---------------------------------------------------------------------------
// Confidence ring (SVG)
// ---------------------------------------------------------------------------

function ConfidenceRing({ value }: { value: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const progress = (value / 100) * circ;
  const color = value >= 75 ? "#34d399" : value >= 55 ? "#fbbf24" : "#f97316";

  return (
    <div className="relative flex items-center justify-center">
      <svg width="72" height="72" className="-rotate-90">
        {/* Track */}
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="4"
        />
        {/* Progress */}
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circ - progress}`}
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute flex flex-col items-center leading-none">
        <span className="text-base font-black text-white tabular-nums">
          {value}%
        </span>
        <span className="text-[8px] text-gray-600 uppercase tracking-widest mt-0.5">
          conf.
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LynchAnalysis
// ---------------------------------------------------------------------------

export default function LynchAnalysis({
  signal,
  confidence,
  risk,
  reasons,
}: LynchAnalysisProps) {
  const sig = SIGNAL_CFG[signal];
  const riskCfg = RISK_CFG[risk];

  const positives = reasons.filter((r) => r.type === "positive");
  const warnings = reasons.filter((r) => r.type === "warning");

  return (
    <div className={`rounded-2xl border ${sig.cls} ${sig.glow} overflow-hidden`}>
      {/* ── Header bar ── */}
      <div className="px-5 py-4 flex items-start justify-between gap-4 border-b border-white/[0.06]">
        {/* Left */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Zap size={11} className="text-indigo-400" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">
              LYNCH VIEW
            </span>
          </div>
          {/* Signal big badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-lg font-black tracking-widest ${sig.cls}`}
          >
            {sig.icon}
            {sig.label}
          </div>
        </div>

        {/* Right — confidence ring + risk */}
        <div className="flex flex-col items-center gap-2">
          <ConfidenceRing value={confidence} />
          <div className="flex items-center gap-1.5">
            <Shield size={10} className={riskCfg.cls} />
            <span className={`text-[9px] font-black uppercase tracking-widest ${riskCfg.cls}`}>
              {riskCfg.label}
            </span>
          </div>
        </div>
      </div>

      {/* ── Risk bar ── */}
      <div className="px-5 pt-3 pb-1">
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-gray-700 font-bold uppercase tracking-widest w-12 shrink-0">
            Risk
          </span>
          <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${riskCfg.bar} ${riskCfg.barW} transition-all duration-700`}
            />
          </div>
          <span className={`text-[10px] font-bold ${riskCfg.cls} shrink-0`}>
            {risk}
          </span>
        </div>
      </div>

      {/* ── Reasons ── */}
      <div className="px-5 pb-5 pt-3 space-y-4">
        <div>
          <p className="text-[9px] uppercase tracking-[0.18em] font-black text-gray-600 mb-2">
            Why LYNCH thinks this
          </p>

          {/* Positives */}
          {positives.length > 0 && (
            <ul className="space-y-1.5 mb-3">
              {positives.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px] text-gray-300 leading-snug">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                  {r.text}
                </li>
              ))}
            </ul>
          )}

          {/* Warnings */}
          {warnings.length > 0 && (
            <ul className="space-y-1.5">
              {warnings.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px] text-gray-400 leading-snug">
                  <AlertTriangle size={12} className="text-amber-400 shrink-0 mt-0.5" />
                  {r.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
