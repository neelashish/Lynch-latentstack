"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/dashboard/Dashboard.tsx
//
// LYNCH Central Investment Command Center
// Reuses existing data sources, components, alerts, activities, and ideas.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Bell,
  Activity,
  Zap,
  ArrowRight,
  PieChart,
  Bot,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
  Layers,
} from "lucide-react";

import AgentStatus from "./AgentStatus";
import type {
  PortfolioData,
  Stock,
  AgentStatus as AgentStatusType,
} from "../data/demo";
import {
  DEMO_PORTFOLIO,
  DEMO_AGENT_STATUS,
} from "../data/demo";
import {
  Alert,
  Activity as TeammateActivity,
  getStoredAlerts,
  getStoredActivities,
} from "@/alerts/alert-data";
import { getDemoResponse, LynchIdea } from "@/agent/demo-responses";

export interface DashboardProps {
  portfolio?: PortfolioData;
  agentStatus?: AgentStatusType;
  agentStatusLines?: string[];
  onStockClick?: (stock: Stock) => void;
  onViewAnalysis?: (symbol: string) => void;
}

// ---------------------------------------------------------------------------
// 1. Portfolio Allocation breakdown data
// ---------------------------------------------------------------------------
const DEMO_ALLOCATION = [
  { symbol: "TCS", percent: 32, value: "₹3,98,400", color: "bg-indigo-500" },
  { symbol: "RELIANCE", percent: 24, value: "₹2,98,800", color: "bg-violet-500" },
  { symbol: "INFY", percent: 18, value: "₹2,24,100", color: "bg-sky-500" },
  { symbol: "Others", percent: 26, value: "₹3,23,700", color: "bg-[#21283b]" },
];

// ---------------------------------------------------------------------------
// Main Dashboard Component
// ---------------------------------------------------------------------------
export default function Dashboard({
  portfolio = DEMO_PORTFOLIO,
  agentStatus = DEMO_AGENT_STATUS.status,
  agentStatusLines = DEMO_AGENT_STATUS.statusLines,
  onStockClick,
  onViewAnalysis,
}: DashboardProps) {
  // Load real client-side alerts & activities from local storage
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [recentActivities, setRecentActivities] = useState<TeammateActivity[]>([]);

  useEffect(() => {
    const alerts = getStoredAlerts();
    setRecentAlerts(alerts.slice(0, 3));

    const activities = getStoredActivities();
    const sorted = [...activities].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setRecentActivities(sorted.slice(0, 4));
  }, []);

  // Retrieve investment ideas from existing agent/demo-responses engine
  const ideasResponse = getDemoResponse("investment_ideas");
  const investmentIdeas: LynchIdea[] = ideasResponse.ideasBlock?.ideas || [];

  const isPositiveToday = portfolio.todayReturn >= 0;
  const isPositiveTotal = portfolio.totalReturnPct >= 0;

  const fmtCurrency = (n: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-[#070a11] text-white antialiased">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 1. HEADER / GREETING                                             */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Good morning <span className="text-xl">👋</span>
              </h1>
            </div>
            <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
              Here&apos;s your LYNCH investment overview. LYNCH continuously monitors portfolio risks, scans market patterns, and provides structured research intelligence.
            </p>
          </div>

          <div className="shrink-0">
            <AgentStatus status={agentStatus} statusLines={agentStatusLines} />
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 2. PORTFOLIO OVERVIEW (SUMMARY CARDS)                            */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <PieChart size={14} className="text-indigo-400" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.14em] text-gray-400">
                Portfolio Overview
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              View Portfolio <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Portfolio Value */}
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0d1117] space-y-1">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Portfolio Value
              </p>
              <p className="text-xl sm:text-2xl font-black text-white tracking-tight">
                ₹{fmtCurrency(portfolio.value)}
              </p>
              <p className="text-[10px] text-gray-500">Total invested capital</p>
            </div>

            {/* Card 2: Today's Change */}
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0d1117] space-y-1">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Today&apos;s Change
              </p>
              <div className="flex items-baseline gap-1.5">
                <p className={`text-xl sm:text-2xl font-black ${isPositiveToday ? "text-emerald-400" : "text-rose-400"}`}>
                  {isPositiveToday ? "+" : ""}₹{fmtCurrency(Math.abs(portfolio.todayReturn))}
                </p>
                <span className={`text-xs font-bold ${isPositiveToday ? "text-emerald-400" : "text-rose-400"}`}>
                  ({isPositiveToday ? "+" : ""}1.24%)
                </span>
              </div>
              <p className="text-[10px] text-gray-500">Compared to yesterday</p>
            </div>

            {/* Card 3: Overall Risk */}
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0d1117] space-y-1">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Overall Risk
              </p>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-500/30 bg-amber-500/10 text-amber-400">
                  {portfolio.riskLevel}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 pt-0.5">IT concentration monitored</p>
            </div>

            {/* Card 4: Holdings */}
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0d1117] space-y-1">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Holdings
              </p>
              <p className="text-xl sm:text-2xl font-black text-white tracking-tight">
                6 <span className="text-xs font-normal text-gray-400">Assets</span>
              </p>
              <p className="text-[10px] text-gray-500">4 Stocks, 1 Gold ETF, Cash</p>
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 3. PORTFOLIO ALLOCATION & RECENT ALERTS (2-COLUMN GRID)          */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Allocation / Holdings Overview */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0d1117] p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Layers size={14} className="text-indigo-400" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Portfolio Allocation
                  </h2>
                </div>
                <span className="text-[10px] font-semibold text-gray-500">
                  4 Main Positions
                </span>
              </div>

              {/* Stacked bar chart */}
              <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden flex mb-4">
                {DEMO_ALLOCATION.map((item) => (
                  <div
                    key={item.symbol}
                    className={`h-full ${item.color}`}
                    style={{ width: `${item.percent}%` }}
                    title={`${item.symbol}: ${item.percent}%`}
                  />
                ))}
              </div>

              {/* Allocation list */}
              <div className="space-y-2.5">
                {DEMO_ALLOCATION.map((item) => (
                  <div key={item.symbol} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                      <span className="font-bold text-slate-200">{item.symbol}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-gray-400">{item.value}</span>
                      <span className="font-bold text-slate-100 w-8 text-right">{item.percent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.06]">
              <Link
                href="/portfolio"
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/20 transition-all"
              >
                <span>View Portfolio Details</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Recent Alerts Card */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0d1117] p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Bell size={14} className="text-emerald-400" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Recent Alerts ({recentAlerts.length})
                  </h2>
                </div>
                <Link
                  href="/alerts"
                  className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  View all alerts <ArrowRight size={11} />
                </Link>
              </div>

              {recentAlerts.length === 0 ? (
                <div className="py-8 text-center text-gray-500 text-xs">
                  No active alerts configured.
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 rounded-xl border border-white/[0.05] bg-[#070a11] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-mono text-xs font-bold text-emerald-400 shrink-0">
                          {alert.symbol.substring(0, 3)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{alert.symbol}</p>
                          <p className="text-[11px] text-gray-400 truncate">{alert.condition}</p>
                        </div>
                      </div>

                      <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        alert.status === 'active' || alert.enabled
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : 'border-gray-700 bg-gray-800 text-gray-400'
                      }`}>
                        {alert.status === 'active' || alert.enabled ? 'ACTIVE' : 'PAUSED'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-white/[0.06]">
              <Link
                href="/alerts"
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-semibold text-gray-300 hover:bg-white/[0.06] transition-all"
              >
                <span>Manage Alert Triggers</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 4. RECENT ACTIVITY & INVESTMENT IDEAS (2-COLUMN GRID)            */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Activity Card */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0d1117] p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-emerald-400" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Recent Activity
                  </h2>
                </div>
                <Link
                  href="/activity"
                  className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  View activity <ArrowRight size={11} />
                </Link>
              </div>

              <div className="space-y-3">
                {recentActivities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] mt-0.5 shrink-0">
                      {act.severity === 'danger' ? (
                        <AlertTriangle size={12} className="text-rose-400" />
                      ) : act.severity === 'success' ? (
                        <CheckCircle2 size={12} className="text-emerald-400" />
                      ) : (
                        <Info size={12} className="text-sky-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-200 leading-snug">{act.title}</p>
                      <p className="text-[11px] text-gray-400 line-clamp-1">{act.description}</p>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono shrink-0">
                      {act.symbol}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.06]">
              <Link
                href="/activity"
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-semibold text-gray-300 hover:bg-white/[0.06] transition-all"
              >
                <span>Full Activity Feed</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Investment Ideas Card */}
          <div className="rounded-2xl border border-indigo-500/30 bg-[#0d1117] p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-indigo-400" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    Research Opportunities
                  </h2>
                </div>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-semibold">
                  SkillPatch Screened
                </span>
              </div>

              <div className="space-y-3">
                {investmentIdeas.map((idea) => (
                  <div
                    key={idea.symbol}
                    className="p-3 rounded-xl border border-white/[0.06] bg-[#070a11] flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{idea.symbol}</span>
                        <span className="text-[10px] text-gray-400">({idea.name})</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                        {idea.thesis}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0 ml-3">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                        idea.signal === 'BUY'
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : idea.signal === 'HOLD'
                          ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                          : 'border-sky-500/30 bg-sky-500/10 text-sky-400'
                      }`}>
                        {idea.signal}
                      </span>
                      <span className="text-[9px] text-gray-500 font-semibold">
                        {idea.risk} RISK
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.06]">
              <Link
                href="/chat"
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-950/40 transition-all"
              >
                <span>Ask LYNCH About These Ideas</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 5. LYNCH AGENT CTA BANNER                                        */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-[#0d1117] to-violet-950/40 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 shrink-0">
              <Bot size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white tracking-wide">
                Have a stock, portfolio, or investment question?
              </h3>
              <p className="text-xs text-gray-400 max-w-lg leading-relaxed">
                Ask LYNCH and get a structured research insight with signal classifications, risk levels, and actionable recommendations.
              </p>
            </div>
          </div>

          <Link
            href="/chat"
            className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-950/50 transition-all"
          >
            <span>Open LYNCH Chat</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Footer */}
        <div className="pb-4 text-center">
          <p className="text-[10px] text-gray-700 tracking-wide">
            Demo only · All data fictional · Not financial advice
          </p>
        </div>

      </div>
    </div>
  );
}
