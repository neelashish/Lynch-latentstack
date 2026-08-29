"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/dashboard/StockCard.tsx
//
// Reusable stock card — used in Watchlist, insights, and stock lists.
// Supports compact (default) and expanded variants.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { TrendingUp, TrendingDown, Eye, Minus, AlertTriangle } from "lucide-react";
import type { Stock, RiskLevel, LynchView } from "../data/demo";

// ---------------------------------------------------------------------------
// Risk badge
// ---------------------------------------------------------------------------

const RISK_CFG: Record<RiskLevel, { cls: string; label: string }> = {
  LOW: { cls: "text-emerald-400 bg-emerald-400/10 border-emerald-500/25", label: "Low" },
  MEDIUM: { cls: "text-amber-400 bg-amber-400/10 border-amber-500/25", label: "Med" },
  HIGH: { cls: "text-red-400 bg-red-400/10 border-red-500/25", label: "High" },
};

function RiskBadge({ risk }: { risk: RiskLevel }) {
  const c = RISK_CFG[risk];
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold
        uppercase tracking-widest border ${c.cls}`}
    >
      {c.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// View badge (LYNCH signal)
// ---------------------------------------------------------------------------

const VIEW_CFG: Record<
  LynchView,
  { cls: string; icon: React.ReactNode }
> = {
  BUY: {
    icon: <TrendingUp size={9} />,
    cls: "text-emerald-400 bg-emerald-400/10 border-emerald-500/30",
  },
  HOLD: {
    icon: <Minus size={9} />,
    cls: "text-amber-400 bg-amber-400/10 border-amber-500/30",
  },
  WATCH: {
    icon: <Eye size={9} />,
    cls: "text-sky-400 bg-sky-400/10 border-sky-500/30",
  },
  REDUCE: {
    icon: <TrendingDown size={9} />,
    cls: "text-orange-400 bg-orange-400/10 border-orange-500/30",
  },
  AVOID: {
    icon: <AlertTriangle size={9} />,
    cls: "text-red-400 bg-red-400/10 border-red-500/30",
  },
};

function ViewBadge({ view }: { view: LynchView }) {
  const c = VIEW_CFG[view];
  return (
    <span
      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md
        text-[9px] font-black uppercase tracking-widest border ${c.cls}`}
    >
      {c.icon}
      {view}
    </span>
  );
}

// ---------------------------------------------------------------------------
// StockCard
// ---------------------------------------------------------------------------

interface StockCardProps {
  stock: Stock;
  /** compact (default) = tight row; expanded = shows badges below */
  variant?: "compact" | "expanded";
  onClick?: (stock: Stock) => void;
}

export default function StockCard({
  stock,
  variant = "compact",
  onClick,
}: StockCardProps) {
  const isPositive = stock.change >= 0;
  const changeStr = `${isPositive ? "+" : ""}${stock.change.toFixed(2)}%`;
  const priceStr = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(stock.price);

  const handleClick = () => onClick?.(stock);

  if (variant === "compact") {
    return (
      <div
        onClick={handleClick}
        className={[
          "flex items-center justify-between px-4 py-3 rounded-xl",
          "border border-white/[0.06] bg-[#0d1117]",
          "transition-all duration-150 group",
          onClick ? "hover:border-white/[0.12] hover:bg-[#111820] cursor-pointer" : "",
        ].join(" ")}
      >
        {/* Left — symbol + name */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white tracking-wide">
              {stock.symbol}
            </span>
            {stock.view && <ViewBadge view={stock.view} />}
            {stock.risk && <RiskBadge risk={stock.risk} />}
          </div>
          <p className="text-[11px] text-gray-600 mt-0.5 truncate">{stock.name}</p>
        </div>

        {/* Right — price + change */}
        <div className="text-right shrink-0 ml-4">
          <p className="text-sm font-bold text-white tabular-nums">₹{priceStr}</p>
          <p
            className={`text-[11px] font-semibold tabular-nums ${
              isPositive ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {changeStr}
          </p>
        </div>
      </div>
    );
  }

  // Expanded variant
  return (
    <div
      onClick={handleClick}
      className={[
        "px-4 py-4 rounded-xl border border-white/[0.06] bg-[#0d1117]",
        "transition-all duration-150",
        onClick ? "hover:border-white/[0.12] hover:bg-[#111820] cursor-pointer" : "",
      ].join(" ")}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-white">{stock.symbol}</p>
          <p className="text-[11px] text-gray-600 mt-0.5">{stock.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-white tabular-nums">₹{priceStr}</p>
          <p
            className={`text-[11px] font-semibold tabular-nums ${
              isPositive ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {changeStr}
          </p>
        </div>
      </div>

      {/* Badge row */}
      {(stock.view || stock.risk) && (
        <div className="flex items-center gap-2 mt-2.5">
          {stock.view && <ViewBadge view={stock.view} />}
          {stock.risk && <RiskBadge risk={stock.risk} />}
        </div>
      )}
    </div>
  );
}
