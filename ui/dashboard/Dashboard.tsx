"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/dashboard/Dashboard.tsx
//
// LYNCH Modern Financial Command Center (STEP 2 Redesign)
// Reuses existing data models, alert stores, activities, and agent responses.
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
  ChevronRight,
  ArrowUpRight,
  MessageSquare,
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
// Portfolio Allocation Breakdown Data
// ---------------------------------------------------------------------------
const DEMO_ALLOCATION = [
  { symbol: "TCS", percent: 32, value: "₹3,98,400", color: "bg-indigo-500" },
  { symbol: "RELIANCE", percent: 24, value: "₹2,98,800", color: "bg-violet-500" },
  { symbol: "INFY", percent: 18, value: "₹2,24,100", color: "bg-sky-500" },
  { symbol: "HDFCBANK", percent: 14, value: "₹1,74,300", color: "bg-emerald-500" },
  { symbol: "Others", percent: 12, value: "₹1,49,400", color: "bg-slate-700" },
];

export default function Dashboard({
  portfolio = DEMO_PORTFOLIO,
  agentStatus = DEMO_AGENT_STATUS.status,
  agentStatusLines = DEMO_AGENT_STATUS.statusLines,
}: DashboardProps) {
  // Load real client-side alerts & activities from local storage safely
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [recentActivities, setRecentActivities] = useState<TeammateActivity[]>([]);

  useEffect(() => {
    const alerts = getStoredAlerts();
    setRecentAlerts(alerts.slice(0, 3));

    const activities = getStoredActivities();
    const sorted = [...activities].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setRecentActivities(sorted.slice(0, 3));
  }, []);

  const isPositiveToday = portfolio.todayReturn >= 0;

  const fmtCurrency = (n: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-[#070a11] text-white antialiased selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-10">

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 1. COMMAND CENTER HERO / WELCOME SECTION                         */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="relative border-b border-white/[0.06] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
              <Sparkles size={12} className="text-indigo-400" />
              <span>LYNCH Financial Command Center</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                Your portfolio, continuously analyzed.
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 max-w-xl font-normal leading-relaxed mt-1.5">
                LYNCH monitors portfolio risk, detects meaningful market patterns, and surfaces actionable investment intelligence.
              </p>
            </div>
          </div>

          {/* Agent Indicator Pill */}
          <div className="shrink-0 p-4 rounded-2xl border border-white/[0.08] bg-[#0d1117]/80 backdrop-blur-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                AGENT ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">
              Monitoring portfolio &middot; Analyzing market signals
            </p>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 2. QUICK PORTFOLIO SNAPSHOT                                      */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
              Portfolio Snapshot
            </span>
            <Link
              href="/portfolio"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              View Full Portfolio <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Portfolio Value */}
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0d1117] hover:border-white/[0.12] transition-all space-y-1.5">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Portfolio Value
              </p>
              <p className="text-xl sm:text-2xl font-black text-white tracking-tight">
                ₹{fmtCurrency(portfolio.value)}
              </p>
              <p className="text-[11px] text-gray-500">Total net capital</p>
            </div>

            {/* Metric 2: Today's Change */}
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0d1117] hover:border-white/[0.12] transition-all space-y-1.5">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Today&apos;s Change
              </p>
              <div className="flex items-baseline gap-1.5">
                <p className={`text-xl sm:text-2xl font-black ${isPositiveToday ? "text-emerald-400" : "text-rose-400"}`}>
                  {isPositiveToday ? "+" : ""}₹{fmtCurrency(Math.abs(portfolio.todayReturn))}
                </p>
                <span className={`text-xs font-bold ${isPositiveToday ? "text-emerald-400" : "text-rose-400"}`}>
                  (+1.24%)
                </span>
              </div>
              <p className="text-[11px] text-gray-500">1-day return</p>
            </div>

            {/* Metric 3: Overall Risk */}
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0d1117] hover:border-white/[0.12] transition-all space-y-1.5">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Overall Risk
              </p>
              <div className="pt-0.5">
                <span className="inline-block px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider border border-amber-500/30 bg-amber-500/10 text-amber-400">
                  {portfolio.riskLevel}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">IT concentration monitored</p>
            </div>

            {/* Metric 4: Holdings */}
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0d1117] hover:border-white/[0.12] transition-all space-y-1.5">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Holdings
              </p>
              <p className="text-xl sm:text-2xl font-black text-white tracking-tight">
                6 <span className="text-xs font-normal text-gray-400">Assets</span>
              </p>
              <p className="text-[11px] text-gray-500">Equities, Gold ETF, Cash</p>
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 3. HERO ELEMENT: LYNCH INSIGHT + RECENT ALERTS                   */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Hero Element: LYNCH Insight (2 Cols) */}
          <div className="lg:col-span-2 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0d1117] via-[#0d1117] to-indigo-950/20 p-6 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Zap size={18} />
              </div>
              <h2 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">
                LYNCH INSIGHT
              </h2>
                </div>
                <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full font-bold">
                  AI Synthesized
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    Technology concentration has increased in your portfolio.
                  </h3>
                  <span className="self-start sm:self-auto text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full shrink-0">
                    MODERATE RISK
                  </span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  TCS + RELIANCE + INFY currently represent a significant portion of your total equity exposure.
                </p>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Why this matters:
                  </p>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Higher sector concentration increases portfolio sensitivity to technology-sector valuation adjustments and wage inflation pressures.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href="/portfolio"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-semibold text-gray-200 transition-all"
              >
                <span>View Portfolio Details</span>
              </Link>
              <Link
                href="/chat"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-xl shadow-indigo-950/50 transition-all hover:scale-[1.02]"
              >
                <span>Ask LYNCH Co-Pilot</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Recent Alerts (1 Col) */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0d1117] p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <Bell size={15} className="text-emerald-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Recent Alerts
                  </h3>
                </div>
                <Link href="/alerts" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  View all <ChevronRight size={12} />
                </Link>
              </div>

              <div className="space-y-2.5">
                {recentAlerts.length === 0 ? (
                  <p className="text-xs text-gray-500 py-4 text-center">No active alerts configured</p>
                ) : (
                  recentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 rounded-xl border border-white/[0.05] bg-[#070a11] flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white">{alert.symbol}</p>
                        <p className="text-[11px] text-gray-400 truncate">{alert.condition}</p>
                      </div>
                      <span className="shrink-0 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                        ACTIVE
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Link
              href="/alerts"
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-semibold text-gray-300 hover:bg-white/[0.06] transition-all"
            >
              <span>Manage Alerts →</span>
            </Link>
          </div>

        </section>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 4. PORTFOLIO ALLOCATION + RECENT ACTIVITY                         */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Allocation */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0d1117] p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <PieChart size={15} className="text-indigo-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Portfolio Allocation
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-gray-400">5 Main Categories</span>
              </div>

              {/* Minimal Allocation Bar */}
              <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden flex">
                {DEMO_ALLOCATION.map((item) => (
                  <div
                    key={item.symbol}
                    className={`h-full ${item.color}`}
                    style={{ width: `${item.percent}%` }}
                    title={`${item.symbol}: ${item.percent}%`}
                  />
                ))}
              </div>

              <div className="space-y-2.5 pt-1">
                {DEMO_ALLOCATION.map((item) => (
                  <div key={item.symbol} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                      <span className="font-bold text-gray-200">{item.symbol}</span>
                    </div>
                    <div className="flex items-center gap-4 font-mono">
                      <span className="text-gray-400">{item.value}</span>
                      <span className="font-bold text-white w-8 text-right">{item.percent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/portfolio"
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-xs font-bold text-indigo-300 hover:bg-indigo-600/20 transition-all"
            >
              <span>View Portfolio →</span>
            </Link>
          </div>

          {/* Recent LYNCH Activity */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0d1117] p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <Activity size={15} className="text-emerald-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Recent LYNCH Activity
                  </h3>
                </div>
                <Link href="/activity" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  View activity <ChevronRight size={12} />
                </Link>
              </div>

              <div className="space-y-3">
                {recentActivities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs p-2.5 rounded-xl border border-white/[0.04] bg-[#070a11]">
                    <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] mt-0.5 shrink-0">
                      {act.severity === 'danger' ? (
                        <AlertTriangle size={12} className="text-rose-400" />
                      ) : (
                        <CheckCircle2 size={12} className="text-emerald-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-200 leading-snug">{act.title}</p>
                      <p className="text-[11px] text-gray-400 line-clamp-1">{act.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/activity"
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-semibold text-gray-300 hover:bg-white/[0.06] transition-all"
            >
              <span>View Activity →</span>
            </Link>
          </div>

        </section>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 5. QUICK ACTIONS                                                  */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <section className="space-y-3 pt-2">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
            Quick Actions
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              href="/portfolio"
              className="p-4 rounded-2xl border border-white/[0.08] bg-[#0d1117] hover:border-indigo-500/30 transition-all text-center space-y-2 group"
            >
              <div className="mx-auto h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                <PieChart size={18} />
              </div>
              <p className="text-xs font-bold text-white">Analyze Portfolio</p>
            </Link>

            <Link
              href="/chat"
              className="p-4 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 hover:bg-indigo-900/30 transition-all text-center space-y-2 group"
            >
              <div className="mx-auto h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-950/60 group-hover:scale-105 transition-transform">
                <MessageSquare size={18} />
              </div>
              <p className="text-xs font-bold text-indigo-300">Ask LYNCH</p>
            </Link>

            <Link
              href="/alerts"
              className="p-4 rounded-2xl border border-white/[0.08] bg-[#0d1117] hover:border-indigo-500/30 transition-all text-center space-y-2 group"
            >
              <div className="mx-auto h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Bell size={18} />
              </div>
              <p className="text-xs font-bold text-white">View Alerts</p>
            </Link>

            <Link
              href="/activity"
              className="p-4 rounded-2xl border border-white/[0.08] bg-[#0d1117] hover:border-indigo-500/30 transition-all text-center space-y-2 group"
            >
              <div className="mx-auto h-9 w-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                <Activity size={18} />
              </div>
              <p className="text-xs font-bold text-white">View Activity</p>
            </Link>
          </div>
        </section>

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
