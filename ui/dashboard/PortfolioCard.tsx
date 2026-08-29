"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/dashboard/PortfolioCard.tsx
//
// Shows portfolio value, today's return, total return, risk level,
// and a small inline sparkline visualization.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { TrendingUp } from "lucide-react";
import type { PortfolioData } from "../data/demo";
import { DEMO_PORTFOLIO } from "../data/demo";

interface PortfolioCardProps {
  data?: PortfolioData;
}

// ---------------------------------------------------------------------------
// Inline sparkline (pure SVG)
// ---------------------------------------------------------------------------

function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const W = 120;
  const H = 36;
  const pad = 2;

  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2);
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return `${x},${y}`;
  });

  const polyline = pts.join(" ");
  // Area fill path (polyline + bottom border)
  const firstPt = pts[0].split(",");
  const lastPt = pts[pts.length - 1].split(",");
  const area = `M ${firstPt[0]},${firstPt[1]} L ${polyline.split(" ").join(" L ")} L ${lastPt[0]},${H} L ${firstPt[0]},${H} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      className="overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Area */}
      <path d={area} fill="url(#spark-fill)" />
      {/* Line */}
      <polyline
        points={polyline}
        fill="none"
        stroke="#6366f1"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last point dot */}
      <circle
        cx={lastPt[0]}
        cy={lastPt[1]}
        r="2.5"
        fill="#6366f1"
        className="drop-shadow-[0_0_4px_rgba(99,102,241,0.8)]"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Risk indicator
// ---------------------------------------------------------------------------

function RiskIndicator({ level }: { level: PortfolioData["riskLevel"] }) {
  const config = {
    Low: {
      color: "text-emerald-400",
      bar: "bg-emerald-400",
      width: "w-1/3",
      bg: "bg-emerald-400/10 border-emerald-500/20",
    },
    Moderate: {
      color: "text-amber-400",
      bar: "bg-amber-400",
      width: "w-2/3",
      bg: "bg-amber-400/10 border-amber-500/20",
    },
    High: {
      color: "text-red-400",
      bar: "bg-red-400",
      width: "w-full",
      bg: "bg-red-400/10 border-red-500/20",
    },
  };
  const c = config[level];

  return (
    <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${c.bg}`}>
      <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${c.bar} ${c.width} transition-all duration-500`} />
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-widest ${c.color} shrink-0`}>
        {level}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Metric cell
// ---------------------------------------------------------------------------

function MetricCell({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] text-gray-600 font-medium uppercase tracking-wide">
        {label}
      </p>
      <p
        className={`text-sm font-bold mt-0.5 ${
          positive === undefined
            ? "text-white"
            : positive
            ? "text-emerald-400"
            : "text-red-400"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Portfolio Card
// ---------------------------------------------------------------------------

export default function PortfolioCard({ data = DEMO_PORTFOLIO }: PortfolioCardProps) {
  const isPositiveToday = data.todayReturn >= 0;
  const isPositiveTotal = data.totalReturnPct >= 0;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0d1117] overflow-hidden">
      {/* Top section */}
      <div className="px-5 pt-5 pb-4">
        {/* Label row */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-bold text-gray-600 uppercase tracking-[0.12em]">
            Portfolio Value
          </p>
          <TrendingUp size={14} className="text-indigo-500/60" />
        </div>

        {/* Main value + sparkline */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white tracking-tight">
                ₹{fmt(data.value)}
              </span>
              <span
                className={`text-sm font-bold ${
                  isPositiveTotal ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {isPositiveTotal ? "+" : ""}
                {data.totalReturnPct.toFixed(2)}%
              </span>
            </div>
            <p className="text-[10px] text-gray-700 mt-1">All-time return</p>
          </div>
          <Sparkline data={data.sparkline} />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px mx-5 bg-white/[0.05]" />

      {/* Metric row */}
      <div className="px-5 py-3.5 grid grid-cols-3 gap-4">
        <MetricCell
          label="Today"
          value={`${isPositiveToday ? "+" : ""}₹${fmt(Math.abs(data.todayReturn))}`}
          positive={isPositiveToday}
        />
        <MetricCell
          label="Total Return"
          value={`${isPositiveTotal ? "+" : ""}${data.totalReturnPct.toFixed(2)}%`}
          positive={isPositiveTotal}
        />
        <div>
          <p className="text-[10px] text-gray-600 font-medium uppercase tracking-wide mb-1">
            Risk
          </p>
          <RiskIndicator level={data.riskLevel} />
        </div>
      </div>
    </div>
  );
}
