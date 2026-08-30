"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/dashboard/Dashboard.tsx
//
// LYNCH Modern Financial Command Center
// Inspired by clean, spacious, Google Antigravity-like product presentation.
// Preserves all existing data, logic, alerts, activity, ideas, and agent models.
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
  ChevronRight,
  ArrowUpRight,
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
  { symbol: "Others", percent: 26, value: "₹3,23,700", color: "bg-[#21283b]" },
];

// ---------------------------------------------------------------------------
// Main Redesigned Dashboard Component
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

  const fmtCurrency = (n: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-[#070a11] text-white antialiased selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-12">

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 1. HEADER / GREETING                                             */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="relative border-b border-white/[0.06] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
              <Sparkles size={12} className="text-indigo-400" />
              <span>LYNCH Command Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Good morning <span className="text-2xl">👋</span>
            </h1>
            <p className="text-sm text-gray-400 max-w-xl font-normal leading-relaxed">
              Your financial intelligence workspace is active. LYNCH is continuously monitoring portfolio risk, market signals, and research opportunities.
            </p>
          </div>

          <div className="shrink-0">
            <AgentStatus status={agentStatus} statusLines={agentStatusLines} />
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 2. PORTFOLIO SNAPSHOT (HERO METRICS)                            */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
              Portfolio Snapshot
            </span>
            <Link
              href="/portfolio"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              Full Portfolio <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Portfolio Value */}
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0d1117] hover:border-white/[0.12] transition-all space-y-2">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Portfolio Value
              </p>
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                ₹{fmtCurrency(portfolio.value)}
              </p>
              <p className="text-[11px] text-gray-500">Total net capital value</p>
            </div>

            {/* Metric 2: Today's Change */}
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0d1117] hover:border-white/[0.12] transition-all space-y-2">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Today&apos;s Change
              </p>
              <div className="flex items-baseline gap-2">
                <p className={`text-2xl sm:text-3xl font-black ${isPositiveToday ? "text-emerald-400" : "text-rose-400"}`}>
                  {isPositiveToday ? "+" : ""}₹{fmtCurrency(Math.abs(portfolio.todayReturn))}
                </p>
                <span className={`text-xs font-bold ${isPositiveToday ? "text-emerald-400" : "text-rose-400"}`}>
                  (+1.24%)
                </span>
              </div>
              <p className="text-[11px] text-gray-500">1-day unrealized return</p>
            </div>

            {/* Metric 3: Overall Risk */}
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0d1117] hover:border-white/[0.12] transition-all space-y-2">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Overall Risk
              </p>
              <div className="pt-1">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border border-amber-500/30 bg-amber-500/10 text-amber-400">
                  {portfolio.riskLevel}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">Concentration in IT sector</p>
            </div>

            {/* Metric 4: Holdings */}
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0d1117] hover:border-white/[0.12] transition-all space-y-2">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Holdings
              </p>
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                6 <span className="text-xs font-normal text-gray-400">Assets</span>
              </p>
              <p className="text-[11px] text-gray-500">Equities, Gold ETF, Cash</p>
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 3. PORTFOLIO ALLOCATION + LYNCH KEY INSIGHT                      */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Allocation */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0d1117] p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-2">
                  <PieChart size={16} className="text-indigo-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Portfolio Allocation
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-gray-400">4 Main Positions</span>
              </div>

              {/* Stacked bar */}
              <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden flex">
                {DEMO_ALLOCATION.map((item) => (
                  <div
                    key={item.symbol}
                    className={`h-full ${item.color}`}
                    style={{ width: `${item.percent}%` }}
                  />
                ))}
              </div>

              {/* Position list */}
              <div className="space-y-3 pt-2">
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
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-xs font-bold text-indigo-300 hover:bg-indigo-600/20 transition-all"
            >
              <span>View Portfolio Analysis</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Key Intelligence Insight */}
          <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0d1117] via-[#0d1117] to-indigo-950/20 p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-indigo-400" />
                  <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    LYNCH Key Insight
                  </h3>
                </div>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full font-bold">
                  AI Synthesized
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-white">IT Sector Concentration Warning</span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-500/20 px-2 py-0.5 rounded">
                    MODERATE RISK
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Your current portfolio has a 38% allocation toward IT equities (TCS + INFY). While fundamental deal pipelines remain intact, near-term wage inflation and macro spending headwinds suggest trimming rallies into banking diversification.
                </p>
              </div>
            </div>

            <Link
              href="/chat"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-950/40 transition-all"
            >
              <span>Ask LYNCH About Portfolio Risks</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </section>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 4. RECENT SIGNALS (ALERTS + ACTIVITY)                            */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Alerts */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0d1117] p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-emerald-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Active Alerts
                  </h3>
                </div>
                <Link href="/alerts" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  View all <ChevronRight size={12} />
                </Link>
              </div>

              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3.5 rounded-xl border border-white/[0.05] bg-[#070a11] flex items-center justify-between gap-3"
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

                    <span className="shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                      ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/alerts"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-semibold text-gray-300 hover:bg-white/[0.06] transition-all"
            >
              <span>Manage Alerts</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Activity Log */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0d1117] p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-emerald-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Recent Activity
                  </h3>
                </div>
                <Link href="/activity" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  View activity <ChevronRight size={12} />
                </Link>
              </div>

              <div className="space-y-3">
                {recentActivities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
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
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-semibold text-gray-300 hover:bg-white/[0.06] transition-all"
            >
              <span>Full Activity Feed</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </section>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 5. RESEARCH OPPORTUNITIES                                         */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
              Research Opportunities
            </span>
            <Link
              href="/chat"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Ask LYNCH →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {investmentIdeas.map((idea) => (
              <div
                key={idea.symbol}
                className="p-5 rounded-2xl border border-white/[0.08] bg-[#0d1117] hover:border-indigo-500/30 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-white">{idea.symbol}</h4>
                      <p className="text-[10px] text-gray-400">{idea.name}</p>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded border ${
                      idea.signal === 'BUY'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : idea.signal === 'HOLD'
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                        : 'border-sky-500/30 bg-sky-500/10 text-sky-400'
                    }`}>
                      {idea.signal}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                    {idea.thesis}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                  <span className="text-gray-500 font-semibold">{idea.risk} RISK</span>
                  <Link
                    href="/chat"
                    className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                  >
                    Research <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 6. ASK LYNCH CTA BANNER                                          */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <section className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-[#0d1117] to-violet-950/40 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-start gap-5">
            <div className="p-4 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 shrink-0">
              <Bot size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white tracking-wide">
                Have a question about your portfolio?
              </h3>
              <p className="text-xs text-gray-400 max-w-lg leading-relaxed">
                Ask LYNCH and get structured research insights, thesis breakdowns, and signal classifications instantly.
              </p>
            </div>
          </div>

          <Link
            href="/chat"
            className="shrink-0 flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-xl shadow-indigo-950/60 transition-all hover:scale-[1.02]"
          >
            <span>Open LYNCH Chat</span>
            <ArrowRight size={14} />
          </Link>
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
