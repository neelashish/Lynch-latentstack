"use client";

// ─────────────────────────────────────────────────────────────────────────────
// app/portfolio/components/RiskInsights.tsx
//
// Clean Risk Intelligence & LYNCH Observations panel.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import Card from "@/ui/components/Card";
import { Holding } from "../types";
import { evaluatePortfolioRisk } from "../utils";
import { ShieldAlert, AlertTriangle, CheckCircle, Info, Zap, AlertCircle } from "lucide-react";

interface RiskInsightsProps {
  holdings: Holding[];
}

export default function RiskInsights({ holdings }: RiskInsightsProps) {
  const analysis = evaluatePortfolioRisk(holdings);

  return (
    <Card padding="md" className="flex flex-col justify-between h-full bg-[#0d1117]/80">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Risk Intelligence</h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
            LEVEL: {analysis.overallRisk}
          </span>
        </div>

        {/* Evaluated Rules */}
        <div className="mt-4 space-y-2.5">
          {analysis.rules.map((rule) => {
            const isWarning = rule.type === "warning";
            const isSuccess = rule.type === "success";

            return (
              <div
                key={rule.id}
                className={[
                  "p-2.5 rounded-lg border flex items-start gap-2.5 transition-colors text-xs",
                  isWarning
                    ? "bg-amber-500/5 border-amber-500/20 text-amber-200"
                    : isSuccess
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-200"
                    : "bg-blue-500/5 border-blue-500/20 text-blue-200",
                ].join(" ")}
              >
                <div className="mt-0.5 shrink-0">
                  {isWarning ? (
                    <AlertTriangle size={14} className="text-amber-400" />
                  ) : isSuccess ? (
                    <CheckCircle size={14} className="text-emerald-400" />
                  ) : (
                    <Info size={14} className="text-blue-400" />
                  )}
                </div>
                <div>
                  <p className="font-bold leading-tight">{rule.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                    {rule.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* LYNCH Observations */}
        <div className="mt-4 pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5 mb-2">
            <Zap size={13} className="text-indigo-400" />
            <p className="text-[11px] font-bold uppercase text-indigo-300 tracking-wide">
              LYNCH Observations
            </p>
          </div>
          <ul className="space-y-1.5 text-xs text-gray-300">
            {analysis.insights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-indigo-400 font-bold">→</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="mt-4 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
          <AlertCircle size={13} className="shrink-0 text-amber-400" />
          <p className="text-[10px] font-bold tracking-wide uppercase">
            DEMO DATA — NOT REAL-TIME FINANCIAL ADVICE
          </p>
        </div>
      </div>
    </Card>
  );
}
