"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/portfolio/PortfolioOverview.tsx
//
// Shows Total Portfolio Value, Today's Change, Overall Risk, and Number of Holdings.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import Card from "../components/Card";
import { PortfolioSummary } from "../data/portfolio";
import { DollarSign, TrendingUp, ShieldAlert, Layers } from "lucide-react";

interface PortfolioOverviewProps {
  summary: PortfolioSummary;
}

export default function PortfolioOverview({ summary }: PortfolioOverviewProps) {
  const formattedValue = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(summary.totalValue);

  const formattedChange = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(summary.todayChangeAbs);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Portfolio Value */}
      <Card padding="md" className="relative overflow-hidden">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-gray-400">Portfolio Value</p>
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <DollarSign size={16} />
          </div>
        </div>
        <p className="text-2xl font-bold text-white mt-2 tracking-tight">
          {formattedValue}
        </p>
        <p className="text-xs text-gray-500 mt-1">Total Demo Equity Value</p>
      </Card>

      {/* 2. Today's Change */}
      <Card padding="md" className="relative overflow-hidden">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-gray-400">Today&apos;s Change</p>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <TrendingUp size={16} />
          </div>
        </div>
        <p className="text-2xl font-bold text-emerald-400 mt-2 tracking-tight">
          +{summary.todayChangePct}%
        </p>
        <p className="text-xs text-emerald-500/80 mt-1 font-medium">
          +{formattedChange} today
        </p>
      </Card>

      {/* 3. Overall Risk */}
      <Card padding="md" className="relative overflow-hidden">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-gray-400">Overall Risk</p>
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <ShieldAlert size={16} />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-2xl font-bold text-amber-400 tracking-tight">
            {summary.overallRisk}
          </p>
          <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-500/20 text-amber-300 uppercase tracking-wide">
            Moderate
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Tech sector concentration</p>
      </Card>

      {/* 4. Number of Holdings */}
      <Card padding="md" className="relative overflow-hidden">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-gray-400">Holdings</p>
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <Layers size={16} />
          </div>
        </div>
        <p className="text-2xl font-bold text-white mt-2 tracking-tight">
          {summary.holdingsCount}
        </p>
        <p className="text-xs text-gray-500 mt-1">Across 4 major sectors</p>
      </Card>
    </div>
  );
}
