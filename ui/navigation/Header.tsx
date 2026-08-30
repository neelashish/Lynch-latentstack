"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/navigation/Header.tsx
//
// LYNCH Modern Header
// Features:
// - PanelLeft / PanelLeftClose sidebar toggle button
// - Page title & breadcrumb
// - Agent status indicator
// - Functional Notification popover with real/demo alerts & "View all alerts →" link
// - Functional Account / Profile popover
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  User,
  PanelLeft,
  PanelLeftClose,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Settings,
  UserCheck,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";

import type { AgentStatus } from "../data/demo";
import { getStoredActivities, Activity as TeammateActivity } from "@/alerts/alert-data";

interface HeaderProps {
  title?: string;
  agentStatus?: AgentStatus;
  notificationCount?: number;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
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
  sidebarCollapsed = false,
  onToggleSidebar,
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { label, dot } = statusConfig[agentStatus];

  // Popover state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [activities, setActivities] = useState<TeammateActivity[]>([]);

  const notifRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load activities for notification popover
    const loaded = getStoredActivities();
    setActivities(loaded.slice(0, 3));
  }, []);

  // Close popovers on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const derivedTitle =
    title && title !== "Overview"
      ? title
      : pathname === "/overview"
      ? "Overview"
      : pathname?.startsWith("/chat")
      ? "AI Chat Co-Pilot"
      : pathname?.startsWith("/portfolio")
      ? "Portfolio Analyzer"
      : pathname?.startsWith("/stocks") || pathname?.startsWith("/stock/")
      ? "Stock Research"
      : pathname?.startsWith("/alerts")
      ? "Alerts & Triggers"
      : pathname?.startsWith("/activity")
      ? "Activity Log"
      : "Dashboard";

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-[#070a11]/90 backdrop-blur-md border-b border-white/[0.05] select-none">
      {/* Left — Toggle button + Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="hidden lg:flex items-center justify-center h-8 w-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 hover:text-white border border-white/[0.06] transition-colors"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label="Toggle sidebar width"
        >
          {sidebarCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
        </button>

        {/* Mobile Spacer */}
        <div className="w-8 lg:hidden shrink-0" />

        <div className="min-w-0">
          <h1 className="text-sm font-bold text-white tracking-wide truncate">
            {derivedTitle}
          </h1>
          <p className="text-[10px] text-gray-500 hidden sm:block">
            LYNCH — AI Financial Intelligence Workspace
          </p>
        </div>
      </div>

      {/* Right — Agent Status + Notifications + Account */}
      <div className="flex items-center gap-3 shrink-0">

        {/* Agent Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/[0.06] bg-[#0d1117]">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dot} opacity-60`} />
            <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${dot}`} />
          </span>
          <span className="text-[10px] font-semibold text-gray-300">
            {label}
          </span>
        </div>

        <div className="hidden sm:block h-4 w-px bg-white/[0.08]" />

        {/* Notifications Popover Container */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setAccountOpen(false);
            }}
            className={`relative h-8 w-8 rounded-xl flex items-center justify-center transition-all ${
              notificationsOpen
                ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
            }`}
            aria-label="Toggle notifications"
          >
            <Bell size={16} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-500 border border-[#070a11]" />
            )}
          </button>

          {/* Notifications Popover Menu */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0d1117] border border-white/[0.1] shadow-2xl p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Notifications
                </span>
                <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                  Recent Alerts
                </span>
              </div>

              <div className="space-y-2.5">
                {activities.length === 0 ? (
                  <p className="text-xs text-gray-500 py-3 text-center">No recent alerts</p>
                ) : (
                  activities.map((act) => (
                    <div
                      key={act.id}
                      className="p-2.5 rounded-xl border border-white/[0.04] bg-[#070a11] hover:border-white/[0.08] transition-all space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-gray-200">
                        <span className="truncate">{act.title}</span>
                        <span className="text-[9px] text-gray-500 font-mono shrink-0 ml-2">{act.symbol}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                        {act.description}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-white/[0.06]">
                <button
                  onClick={() => {
                    setNotificationsOpen(false);
                    router.push("/alerts");
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/20 transition-all"
                >
                  <span>View All Alerts</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Account Menu Popover Container */}
        <div className="relative" ref={accountRef}>
          <button
            onClick={() => {
              setAccountOpen(!accountOpen);
              setNotificationsOpen(false);
            }}
            className={`h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-600/40 to-violet-700/40 border flex items-center justify-center transition-all ${
              accountOpen ? "border-indigo-400 ring-2 ring-indigo-500/30" : "border-indigo-500/20 hover:border-indigo-500/40"
            }`}
            aria-label="Account menu"
          >
            <User size={14} className="text-indigo-300" />
          </button>

          {/* Account Menu Popover */}
          {accountOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0d1117] border border-white/[0.1] shadow-2xl p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center gap-3 border-b border-white/[0.06] pb-3">
                <div className="h-9 w-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-xs">
                  LY
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Demo Investor</h4>
                  <p className="text-[10px] text-gray-500 font-mono">demo@lynch.ai</p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between p-2 rounded-xl text-xs text-gray-300 hover:bg-white/[0.04] cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <UserCheck size={14} className="text-gray-400" />
                    <span>Profile</span>
                  </div>
                  <span className="text-[9px] text-gray-500 font-mono">Demo</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl text-xs text-gray-300 hover:bg-white/[0.04] cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <Settings size={14} className="text-gray-400" />
                    <span>Preferences</span>
                  </div>
                  <span className="text-[9px] text-indigo-400 font-semibold">Active</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl text-xs text-gray-400 opacity-60">
                  <div className="flex items-center gap-2.5">
                    <HelpCircle size={14} className="text-gray-500" />
                    <span>Documentation</span>
                  </div>
                  <span className="text-[9px] text-gray-600">v1.0</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06]">
                <div className="p-2 rounded-xl text-xs text-gray-500 hover:text-gray-300 flex items-center gap-2 cursor-not-allowed">
                  <LogOut size={14} />
                  <span>Logout (Demo Session)</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
