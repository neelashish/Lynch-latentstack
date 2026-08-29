"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/navigation/Sidebar.tsx
//
// LYNCH sidebar navigation.
// Desktop: fixed left panel (240px).
// Mobile: slide-in drawer with hamburger toggle.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Bell,
  Activity,
  Zap,
  X,
  Menu,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NavItem = "overview" | "chat" | "alerts" | "activity";

interface SidebarProps {
  activeItem?: NavItem;
  onNavigate?: (item: NavItem) => void;
}

// ---------------------------------------------------------------------------
// Nav config
// ---------------------------------------------------------------------------

const NAV_ITEMS: Array<{
  id: NavItem;
  label: string;
  icon: React.ReactNode;
  href: string;
}> = [
  {
    id: "overview",
    label: "Overview",
    icon: <LayoutDashboard size={16} />,
    href: "/",
  },
  {
    id: "chat",
    label: "Chat",
    icon: <MessageSquare size={16} />,
    href: "/chat",
  },
  {
    id: "alerts",
    label: "Alerts",
    icon: <Bell size={16} />,
    href: "/alerts",
  },
  {
    id: "activity",
    label: "Activity",
    icon: <Activity size={16} />,
    href: "/activity",
  },
];

// ---------------------------------------------------------------------------
// Inner nav list (shared between desktop sidebar and mobile drawer)
// ---------------------------------------------------------------------------

function NavList({
  activeItem,
  onNavigate,
  onItemClick,
}: {
  activeItem?: NavItem;
  onNavigate?: (item: NavItem) => void;
  onItemClick?: () => void;
}) {
  return (
    <nav className="mt-2 space-y-0.5 px-3">
      {NAV_ITEMS.map(({ id, label, icon, href }) => {
        const isActive = activeItem === id;
        return (
          <a
            key={id}
            href={href}
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate(id);
              }
              onItemClick?.();
            }}
            className={[
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
              "transition-all duration-150 group select-none",
              isActive
                ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/25"
                : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.04] border border-transparent",
            ].join(" ")}
          >
            <span
              className={[
                "shrink-0 transition-colors duration-150",
                isActive
                  ? "text-indigo-400"
                  : "text-gray-600 group-hover:text-gray-400",
              ].join(" ")}
            >
              {icon}
            </span>
            {label}
            {isActive && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
            )}
          </a>
        );
      })}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Brand mark (shared)
// ---------------------------------------------------------------------------

function LynchBrand() {
  return (
    <div className="flex items-center gap-3 px-5 py-5">
      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-950/60 shrink-0">
        <Zap size={14} className="text-white" strokeWidth={2.5} />
      </div>
      <div>
        <span className="text-sm font-black text-white tracking-[0.12em] uppercase">
          LYNCH
        </span>
        <p className="text-[10px] text-gray-600 font-medium tracking-wide leading-none mt-0.5">
          AI Financial Intelligence
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bottom status strip
// ---------------------------------------------------------------------------

function SidebarFooter() {
  return (
    <div className="px-4 pb-5 mt-auto">
      <div className="rounded-xl border border-white/[0.05] bg-[#0a0f1a] px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[11px] font-semibold text-emerald-400">
            Agent Active
          </span>
        </div>
        <p className="text-[10px] text-gray-700 mt-1 leading-relaxed">
          Monitoring portfolio &middot; Analyzing scenarios
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Sidebar export
// ---------------------------------------------------------------------------

export default function Sidebar({ activeItem = "overview", onNavigate }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Desktop sidebar ───────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 fixed left-0 top-0 h-full z-30 bg-[#070a11] border-r border-white/[0.06]">
        <LynchBrand />

        {/* Divider */}
        <div className="mx-4 mb-3 h-px bg-white/[0.04]" />

        {/* Section label */}
        <p className="px-6 pb-2 text-[9px] font-bold tracking-[0.15em] uppercase text-gray-700">
          Navigation
        </p>

        <NavList activeItem={activeItem} onNavigate={onNavigate} />

        <SidebarFooter />
      </aside>

      {/* ── Mobile hamburger trigger ──────────────────────────────────────── */}
      <button
        className="lg:hidden fixed top-4 left-4 z-40 h-9 w-9 rounded-xl bg-[#0d1117] border border-white/[0.08]
          flex items-center justify-center text-gray-400 hover:text-gray-200 transition-colors"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <Menu size={16} />
      </button>

      {/* ── Mobile drawer overlay ─────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer panel */}
          <div className="relative w-72 max-w-[85vw] h-full bg-[#070a11] border-r border-white/[0.08] flex flex-col shadow-2xl">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 h-8 w-8 rounded-xl bg-white/[0.04] flex items-center justify-center
                text-gray-500 hover:text-gray-200 transition-colors"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            >
              <X size={14} />
            </button>

            <LynchBrand />
            <div className="mx-4 mb-3 h-px bg-white/[0.04]" />
            <p className="px-6 pb-2 text-[9px] font-bold tracking-[0.15em] uppercase text-gray-700">
              Navigation
            </p>

            <NavList
              activeItem={activeItem}
              onNavigate={onNavigate}
              onItemClick={() => setMobileOpen(false)}
            />

            <SidebarFooter />
          </div>
        </div>
      )}
    </>
  );
}
