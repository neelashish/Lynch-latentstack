"use client";

// ─────────────────────────────────────────────────────────────────────────────
// app/portfolio/components/PortfolioSummary.tsx
//
// PORTFOLIO SNAPSHOT cards (Value, Today's Change, Risk, Holdings).
// Clean, modern, sophisticated dark style.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import Card from "@/ui/components/Card";
import { PortfolioSummary as SummaryType } from "../types";
import { DollarSign, TrendingUp, ShieldAlert, Layers } from "lucide-react";

interface PortfolioSummaryProps {
  summary: SummaryType;
}

export default function PortfolioSummary({ summary }: PortfolioSummaryProps) {
  const formattedValue = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(summary.totalValue);

  const formattedTodayAbs = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(summary.todayChangeAbs);

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500">
        Portfolio Snapshot
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Value */}
        <Card padding="md" className="relative overflow-hidden bg-[#0d1117]/80 backdrop-blur">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-400">Portfolio Value</p>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <DollarSign size={15} />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2 tracking-tight">
            {formattedValue}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">Total Demo Equity Value</p>
        </Card>

        {/* Today's Change */}
        <Card padding="md" className="relative overflow-hidden bg-[#0d1117]/80 backdrop-blur">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-400">Today&apos;s Change</p>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp size={15} />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-2 tracking-tight">
            +{summary.todayChangePct}%
          </p>
          <p className="text-[11px] text-emerald-500/80 mt-1 font-semibold">
            +{formattedTodayAbs} today
          </p>
        </Card>

        {/* Overall Risk */}
        <Card padding="md" className="relative overflow-hidden bg-[#0d1117]/80 backdrop-blur">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-400">Overall Risk</p>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <ShieldAlert size={15} />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-400 mt-2 tracking-tight">
            {summary.overallRisk}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">Single stock &gt; 30% rule</p>
        </Card>

        {/* Holdings Count */}
        <Card padding="md" className="relative overflow-hidden bg-[#0d1117]/80 backdrop-blur">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-400">Holdings</p>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Layers size={15} />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2 tracking-tight">
            {summary.holdingsCount}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">Active demo positions</p>
        </Card>
      </div>
    </div>
  );
}
