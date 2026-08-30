"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/portfolio/PortfolioRisk.tsx
//
// Calculates and renders deterministic portfolio risk insights.
// Explicit Rule: If any holding is > 30% -> Flag HIGH CONCENTRATION risk.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import Card from "../components/Card";
import { getDeterministicRiskRules } from "../data/portfolio";
import { ShieldAlert, AlertTriangle, CheckCircle, Info } from "lucide-react";

export default function PortfolioRisk() {
  const analysis = getDeterministicRiskRules();

  return (
    <Card padding="md" className="flex flex-col h-full">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <ShieldAlert size={18} className="text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Risk Analysis</h3>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
          <span>Level:</span>
          <span>{analysis.overallRisk}</span>
        </div>
      </div>

      {/* Rules Evaluation List */}
      <div className="mt-4 space-y-3 flex-1">
        {analysis.rules.map((rule) => {
          const isWarning = rule.type === "warning";
          const isSuccess = rule.type === "success";

          return (
            <div
              key={rule.id}
              className={[
                "p-3 rounded-lg border flex items-start gap-3 transition-colors",
                isWarning
                  ? "bg-amber-500/5 border-amber-500/20 text-amber-200"
                  : isSuccess
                  ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-200"
                  : "bg-blue-500/5 border-blue-500/20 text-blue-200",
              ].join(" ")}
            >
              <div className="mt-0.5 shrink-0">
                {isWarning ? (
                  <AlertTriangle size={16} className="text-amber-400" />
                ) : isSuccess ? (
                  <CheckCircle size={16} className="text-emerald-400" />
                ) : (
                  <Info size={16} className="text-blue-400" />
                )}
              </div>

              <div>
                <p className="text-xs font-bold leading-snug">{rule.title}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                  {rule.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deterministic Rule Summary Footnote */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] text-[10px] text-gray-500 flex items-center justify-between">
        <span>Deterministic Rule Evaluation</span>
        <span>Threshold: &gt; 30% single stock</span>
      </div>
    </Card>
  );
}
