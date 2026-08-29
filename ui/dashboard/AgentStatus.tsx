"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/dashboard/AgentStatus.tsx
//
// Animated LYNCH agent status indicator.
// Visual simulation only — no real background process.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Cpu } from "lucide-react";
import type { AgentStatus as AgentStatusType } from "../data/demo";

interface AgentStatusProps {
  status?: AgentStatusType;
  statusLines?: string[];
}

const statusCfg: Record<
  AgentStatusType,
  { label: string; dot: string; text: string; bg: string }
> = {
  active: {
    label: "AGENT ACTIVE",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    bg: "border-emerald-500/20 bg-emerald-400/[0.04]",
  },
  idle: {
    label: "AGENT IDLE",
    dot: "bg-gray-500",
    text: "text-gray-500",
    bg: "border-white/[0.06] bg-white/[0.02]",
  },
  analyzing: {
    label: "ANALYZING",
    dot: "bg-amber-400",
    text: "text-amber-400",
    bg: "border-amber-500/20 bg-amber-400/[0.04]",
  },
};

export default function AgentStatus({
  status = "active",
  statusLines = ["Monitoring portfolio", "Analyzing market scenarios"],
}: AgentStatusProps) {
  const cfg = statusCfg[status];

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${cfg.bg}`}>
      {/* Icon */}
      <div className="shrink-0 mt-0.5">
        <Cpu size={14} className={cfg.text} />
      </div>

      <div className="min-w-0 flex-1">
        {/* Status row */}
        <div className="flex items-center gap-2">
          {/* Animated dot */}
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.dot} opacity-70`}
            />
            <span
              className={`relative inline-flex h-1.5 w-1.5 rounded-full ${cfg.dot}`}
            />
          </span>
          <span className={`text-[10px] font-black tracking-[0.15em] ${cfg.text}`}>
            {cfg.label}
          </span>
        </div>

        {/* Status lines */}
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
          {statusLines.map((line, i) => (
            <span key={i} className="text-[11px] text-gray-600">
              {i > 0 && (
                <span className="mr-3 text-gray-800 select-none">·</span>
              )}
              {line}
            </span>
          ))}
        </div>
      </div>

      {/* Animated blinking cursor — subtle AI-alive indicator */}
      <div className="shrink-0 flex items-center gap-0.5 mt-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`h-1 w-1 rounded-full ${cfg.dot} opacity-60`}
            style={{
              animation: "pulse 1.4s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
