"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/dashboard/Dashboard.tsx
//
// Main dashboard screen — the first thing a hackathon judge sees.
//
// Accepts all data via props (with demo defaults) so the final integration
// layer (app/page.tsx) can inject real data without touching this component.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { TrendingUp, Bell, ShieldAlert, Zap, Activity } from "lucide-react";

import AgentStatus from "./AgentStatus";
import PortfolioCard from "./PortfolioCard";
import Watchlist from "./Watchlist";
import LynchInsight from "./LynchInsight";

import type {
  PortfolioData,
  Stock,
  InsightData,
  ActivityItem,
  AgentStatus as AgentStatusType,
} from "../data/demo";
import {
  DEMO_PORTFOLIO,
  DEMO_WATCHLIST,
  DEMO_INSIGHTS,
  DEMO_ACTIVITY,
  DEMO_AGENT_STATUS,
} from "../data/demo";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface DashboardProps {
  portfolio?: PortfolioData;
  watchlist?: Stock[];
  insights?: InsightData[];
  agentStatus?: AgentStatusType;
  agentStatusLines?: string[];
  activitySummary?: ActivityItem[];
  onStockClick?: (stock: Stock) => void;
  onViewAnalysis?: (symbol: string) => void;
}

// ---------------------------------------------------------------------------
// Activity summary row
// ---------------------------------------------------------------------------

const ICON_MAP = {
  risk: <ShieldAlert size={12} className="text-amber-400" />,
  alert: <Bell size={12} className="text-indigo-400" />,
  insight: <Zap size={12} className="text-emerald-400" />,
};

function ActivityRow({ item }: { item: ActivityItem }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
      <div className="h-5 w-5 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
        {ICON_MAP[item.icon]}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] text-gray-400 leading-snug">{item.text}</p>
      </div>
      <span className="text-[10px] text-gray-700 shrink-0 mt-0.5 whitespace-nowrap">
        {item.time}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section header
// ---------------------------------------------------------------------------

function SectionHeader({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-indigo-500/70">{icon}</span>
      <h2 className="text-[11px] font-black uppercase tracking-[0.14em] text-gray-500">
        {label}
      </h2>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Greeting
// ---------------------------------------------------------------------------

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning.";
  if (h < 17) return "Good afternoon.";
  return "Good evening.";
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export default function Dashboard({
  portfolio = DEMO_PORTFOLIO,
  watchlist = DEMO_WATCHLIST,
  insights = DEMO_INSIGHTS,
  agentStatus = DEMO_AGENT_STATUS.status,
  agentStatusLines = DEMO_AGENT_STATUS.statusLines,
  activitySummary = DEMO_ACTIVITY,
  onStockClick,
  onViewAnalysis,
}: DashboardProps) {
  return (
    <div className="min-h-screen bg-[#070a11] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">

        {/* ── Hero greeting ──────────────────────────────────────────────── */}
        <div className="space-y-3">
          <AgentStatus status={agentStatus} statusLines={agentStatusLines} />

          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {getGreeting()}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              I&apos;ve identified{" "}
              <span className="text-indigo-400 font-semibold">
                {insights.length} things
              </span>{" "}
              worth your attention today.
            </p>
          </div>
        </div>

        {/* ── Portfolio card ─────────────────────────────────────────────── */}
        <PortfolioCard data={portfolio} />

        {/* ── Two-column grid: Insights + Watchlist ──────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LYNCH Insights */}
          <div>
            <SectionHeader
              icon={<Zap size={13} />}
              label="LYNCH Insights"
            />
            <div className="space-y-3">
              {insights.map((insight) => (
                <LynchInsight
                  key={insight.symbol}
                  insight={insight}
                  onViewAnalysis={onViewAnalysis}
                />
              ))}
            </div>
          </div>

          {/* Watchlist */}
          <div>
            <SectionHeader
              icon={<TrendingUp size={13} />}
              label="Watchlist"
            />
            <Watchlist stocks={watchlist} onStockClick={onStockClick} />
          </div>
        </div>

        {/* ── Recent Activity Summary ────────────────────────────────────── */}
        {activitySummary.length > 0 && (
          <div>
            <SectionHeader
              icon={<Activity size={13} />}
              label="Recent Activity"
            />

            <div className="rounded-xl border border-white/[0.06] bg-[#0d1117] px-4 divide-y divide-white/[0.04]">
              {activitySummary.map((item) => (
                <ActivityRow key={item.id} item={item} />
              ))}
            </div>

            {/* Disclaimer — visual only */}
            <p className="text-[10px] text-gray-800 text-center mt-3">
              Activity managed by the alert system · Visual summary only
            </p>
          </div>
        )}

        {/* ── Bottom disclaimer ──────────────────────────────────────────── */}
        <div className="pb-4 text-center">
          <p className="text-[10px] text-gray-800 tracking-wide">
            Demo only · All data fictional · Not financial advice
          </p>
        </div>
      </div>
    </div>
  );
}
