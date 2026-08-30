"use client";

// ─────────────────────────────────────────────────────────────────────────────
// app/portfolio/page.tsx
//
// LYNCH Portfolio Analyzer Route.
// Integrates Overview, Allocation, Risk, Performance, Holdings Table, and LYNCH Insights.
// Dispatches session activity event on initial load without breaking teammates' systems.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect } from "react";
import Header from "@/ui/navigation/Header";
import Sidebar from "@/ui/navigation/Sidebar";
import PortfolioOverview from "@/ui/portfolio/PortfolioOverview";
import PortfolioAllocation from "@/ui/portfolio/PortfolioAllocation";
import PortfolioRisk from "@/ui/portfolio/PortfolioRisk";
import PortfolioPerformance from "@/ui/portfolio/PortfolioPerformance";
import HoldingsTable from "@/ui/portfolio/HoldingsTable";
import LynchInsights from "@/ui/portfolio/LynchInsights";
import { getPortfolioSummary, DEMO_HOLDINGS } from "@/ui/data/portfolio";
import { emitAgentEvent } from "@/agent/events";

export default function PortfolioPage() {
  const summary = getPortfolioSummary();

  // On mount: Emit portfolio analysis event into LYNCH session activity feed
  useEffect(() => {
    try {
      emitAgentEvent({
        icon: "insight",
        text: "LYNCH analyzed demo portfolio risk & asset allocation",
      });
    } catch {
      // Gracefully handle if teammate event system is uninitialized
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#070a11] text-gray-100 flex">
      {/* Fixed Sidebar */}
      <Sidebar activeItem="overview" />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-60 flex flex-col min-w-0">
        <Header title="Portfolio Analyzer" />

        <main className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Top Title Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/[0.06]">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>📊 Portfolio Analyzer</span>
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Deterministic composition, concentration, performance, and risk analysis.
              </p>
            </div>
            <div className="self-start sm:self-auto px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              Self-Contained Demo
            </div>
          </div>

          {/* 1. Portfolio Overview Cards */}
          <PortfolioOverview summary={summary} />

          {/* 2. Middle Row: Allocation, Risk & Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <PortfolioAllocation holdings={DEMO_HOLDINGS} />
            </div>
            <div className="lg:col-span-1">
              <PortfolioRisk />
            </div>
            <div className="lg:col-span-1">
              <PortfolioPerformance />
            </div>
          </div>

          {/* 3. Bottom Row: Holdings Table & LYNCH Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <HoldingsTable holdings={DEMO_HOLDINGS} />
            </div>
            <div className="lg:col-span-1">
              <LynchInsights />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
