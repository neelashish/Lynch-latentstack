"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/navigation/Sidebar.tsx
//
// LYNCH Modern Collapsible Sidebar
// Supports expanded (240px) and collapsed (72px) states with CSS transitions.
// Includes icon tooltips when collapsed and slide-in drawer on mobile.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Bell,
  Activity,
  Zap,
  X,
  Menu,
  PieChart,
  TrendingUp,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

export type NavItem = "dashboard" | "overview" | "chat" | "portfolio" | "stocks" | "alerts" | "activity";

interface SidebarProps {
  activeItem?: NavItem;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: (item: NavItem) => void;
}

const NAV_ITEMS: Array<{
  id: NavItem;
  label: string;
  icon: React.ReactNode;
  href: string;
}> = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    href: "/",
  },
  {
    id: "overview",
    label: "Overview",
    icon: <Zap size={18} />,
    href: "/overview",
  },
  {
    id: "chat",
    label: "Chat",
    icon: <MessageSquare size={18} />,
    href: "/chat",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    icon: <PieChart size={18} />,
    href: "/portfolio",
  },
  {
    id: "stocks",
    label: "Stocks",
    icon: <TrendingUp size={18} />,
    href: "/stocks",
  },
  {
    id: "alerts",
    label: "Alerts",
    icon: <Bell size={18} />,
    href: "/alerts",
  },
  {
    id: "activity",
    label: "Activity",
    icon: <Activity size={18} />,
    href: "/activity",
  },
];

// ---------------------------------------------------------------------------
// Brand Logo Component
// ---------------------------------------------------------------------------
function LynchBrand({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className={`flex items-center gap-3 py-5 transition-all duration-300 ${collapsed ? "px-4 justify-center" : "px-5"}`}>
      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-950/60 shrink-0">
        <Zap size={16} className="text-white" strokeWidth={2.5} />
      </div>
      {!collapsed && (
        <div className="min-w-0 transition-opacity duration-200">
          <span className="text-sm font-black text-white tracking-[0.12em] uppercase block leading-none">
            LYNCH
          </span>
          <p className="text-[10px] text-gray-500 font-medium tracking-wide leading-none mt-1 truncate">
            AI Financial Intelligence
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Sidebar Export
// ---------------------------------------------------------------------------
export default function Sidebar({
  activeItem,
  collapsed = false,
  onToggleCollapse,
  onNavigate,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();

  const currentActiveItem: NavItem =
    activeItem ??
    (pathname === "/overview"
      ? "overview"
      : pathname?.startsWith("/chat")
      ? "chat"
      : pathname?.startsWith("/portfolio")
      ? "portfolio"
      : pathname?.startsWith("/stocks") || pathname?.startsWith("/stock/")
      ? "stocks"
      : pathname?.startsWith("/alerts")
      ? "alerts"
      : pathname?.startsWith("/activity")
      ? "activity"
      : "dashboard");

  return (
    <>
      {/* ── Desktop Collapsible Sidebar ───────────────────────────────────── */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-full z-30 bg-[#070a11] border-r border-white/[0.06] transition-all duration-300 ease-in-out select-none ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Brand Header */}
        <LynchBrand collapsed={collapsed} />

        {/* Divider */}
        <div className="mx-4 mb-3 h-px bg-white/[0.04]" />

        {/* Section Label */}
        {!collapsed && (
          <p className="px-6 pb-2 text-[9px] font-bold tracking-[0.15em] uppercase text-gray-600">
            Navigation
          </p>
        )}

        {/* Nav List */}
        <nav className="mt-1 space-y-1 px-3 flex-1">
          {NAV_ITEMS.map(({ id, label, icon, href }) => {
            const isActive = currentActiveItem === id;
            return (
              <div
                key={id}
                className="relative"
                onMouseEnter={() => setHoveredItem(id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <a
                  href={href}
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate(id);
                    }
                  }}
                  className={`flex items-center gap-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                    collapsed ? "px-0 justify-center" : "px-3"
                  } ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/25"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                  }`}
                >
                  <span
                    className={`shrink-0 transition-colors ${
                      isActive ? "text-indigo-400" : "text-gray-500 group-hover:text-gray-300"
                    }`}
                  >
                    {icon}
                  </span>

                  {!collapsed && (
                    <span className="truncate">{label}</span>
                  )}

                  {!collapsed && isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                  )}
                </a>

                {/* Tooltip for Collapsed Sidebar */}
                {collapsed && hoveredItem === id && (
                  <div className="absolute left-16 top-1/2 -translate-y-1/2 z-50 px-2.5 py-1 rounded-md bg-[#0d1117] border border-white/[0.1] text-[11px] font-semibold text-white shadow-xl whitespace-nowrap pointer-events-none">
                    {label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom Sidebar Footer */}
        <div className="p-3 mt-auto border-t border-white/[0.04]">
          {!collapsed ? (
            <div className="rounded-xl border border-white/[0.05] bg-[#0a0f1a] p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[11px] font-semibold text-emerald-400 truncate">
                  Agent Active
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
            </div>
          )}
        </div>
      </aside>

      {/* ── Mobile Hamburger Trigger ──────────────────────────────────────── */}
      <button
        className="lg:hidden fixed top-3.5 left-4 z-40 h-9 w-9 rounded-xl bg-[#0d1117] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <Menu size={18} />
      </button>

      {/* ── Mobile Drawer Overlay ─────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          <div className="relative w-72 max-w-[85vw] h-full bg-[#070a11] border-r border-white/[0.08] flex flex-col shadow-2xl">
            <button
              className="absolute top-4 right-4 h-8 w-8 rounded-xl bg-white/[0.04] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            >
              <X size={16} />
            </button>

            <LynchBrand />
            <div className="mx-4 mb-3 h-px bg-white/[0.04]" />
            <p className="px-6 pb-2 text-[9px] font-bold tracking-[0.15em] uppercase text-gray-600">
              Navigation
            </p>

            <nav className="mt-1 space-y-1 px-3 flex-1">
              {NAV_ITEMS.map(({ id, label, icon, href }) => {
                const isActive = currentActiveItem === id;
                return (
                  <a
                    key={id}
                    href={href}
                    onClick={(e) => {
                      if (onNavigate) {
                        e.preventDefault();
                        onNavigate(id);
                      }
                      setMobileOpen(false);
                    }}
                    className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/25"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                    }`}
                  >
                    <span className={isActive ? "text-indigo-400" : "text-gray-500"}>
                      {icon}
                    </span>
                    <span>{label}</span>
                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    )}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
