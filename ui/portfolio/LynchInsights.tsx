"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/portfolio/LynchInsights.tsx
//
// Shows deterministic research insights derived from the demo portfolio data.
// Features explicit required disclaimer: "DEMO DATA — NOT REAL-TIME FINANCIAL ADVICE"
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import Card from "../components/Card";
import { getDeterministicRiskRules } from "../data/portfolio";
import { Zap, AlertCircle } from "lucide-react";

export default function LynchInsights() {
  const { insights } = getDeterministicRiskRules();

  return (
    <Card padding="md" className="flex flex-col justify-between h-full bg-gradient-to-br from-[#0d1117] via-[#0d1117] to-[#131b2a] border border-indigo-500/20">
      <div>
        {/* Title */}
        <div className="flex items-center justify-between pb-3 border-b border-indigo-500/15">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-indigo-600/20 text-indigo-400">
              <Zap size={16} />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              LYNCH Insights
            </h3>
          </div>
          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
            DETERMINISTIC
          </span>
        </div>

        {/* Bullet Observations */}
        <ul className="mt-4 space-y-2.5">
          {insights.map((insight, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-xs text-gray-200 leading-relaxed font-medium"
            >
              <span className="text-indigo-400 font-bold shrink-0 mt-0.5">→</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="mt-5 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
          <AlertCircle size={14} className="shrink-0 text-amber-400" />
          <p className="text-[10px] font-bold tracking-wide uppercase">
            DEMO DATA — NOT REAL-TIME FINANCIAL ADVICE
          </p>
        </div>
      </div>
    </Card>
  );
}
