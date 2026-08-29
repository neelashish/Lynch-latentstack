"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/navigation/Header.tsx
//
// LYNCH top header bar.
// Shows: page title | agent status | notification indicator | user avatar
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { usePathname } from "next/navigation";
import { Bell, User, Zap } from "lucide-react";
import type { AgentStatus } from "../data/demo";

interface HeaderProps {
  /** Page title displayed in the header */
  title?: string;
  /** Agent status — controls pulse color */
  agentStatus?: AgentStatus;
  /** Notification count — shown as badge on bell */
  notificationCount?: number;
}

const statusConfig: Record<AgentStatus, { label: string; dot: string }> = {
  active: { label: "Agent Active", dot: "bg-emerald-400" },
  idle: { label: "Agent Idle", dot: "bg-gray-500" },
  analyzing: { label: "Analyzing…", dot: "bg-amber-400" },
};

export default function Header({
  title,
  agentStatus = "active",
  notificationCount = 3,
}: HeaderProps) {
  const pathname = usePathname();
  const { label, dot } = statusConfig[agentStatus];

  const derivedTitle =
    title && title !== "Overview"
      ? title
      : pathname?.startsWith("/chat")
      ? "AI Chat Co-Pilot"
      : pathname?.startsWith("/alerts")
      ? "Alerts & Triggers"
      : pathname?.startsWith("/activity")
      ? "Activity Log"
      : pathname?.startsWith("/stock")
      ? "Stock Analysis"
      : "Overview";

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-[#070a11]/95 backdrop-blur-md border-b border-white/[0.05]">
      {/* Left — page title (with mobile logo spacing) */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile logo spacer (hamburger is positioned absolutely, just need gap) */}
        <div className="w-8 lg:hidden shrink-0" />
        <div className="min-w-0">
          <h1 className="text-sm font-bold text-white tracking-wide truncate">
            {derivedTitle}
          </h1>
          <p className="text-[10px] text-gray-700 hidden sm:block">
            LYNCH — AI Financial Intelligence
          </p>
        </div>
      </div>

      {/* Right — status + notifications + user */}
      <div className="flex items-center gap-3 shrink-0">

        {/* Agent status pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/[0.06] bg-[#0d1117]">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dot} opacity-60`} />
            <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${dot}`} />
          </span>
          <span className="text-[10px] font-semibold text-gray-400">
            {label}
          </span>
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-4 w-px bg-white/[0.08]" />

        {/* Notification bell */}
        <button
          className="relative h-8 w-8 rounded-xl flex items-center justify-center text-gray-600
            hover:text-gray-300 hover:bg-white/[0.05] transition-colors"
          aria-label={`${notificationCount} notifications`}
        >
          <Bell size={15} />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-500 border border-[#070a11]" />
          )}
        </button>

        {/* User avatar */}
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-600/40 to-violet-700/40 border border-indigo-500/20
          flex items-center justify-center">
          <User size={13} className="text-indigo-300" />
        </div>
      </div>
    </header>
  );
}
