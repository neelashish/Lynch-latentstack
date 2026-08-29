"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/stock/StockPage.tsx
//
// Full stock detail experience.
// Composes: StockChart, StockMetrics, LynchAnalysis.
// All data via props — DEMO_RELIANCE used as default.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import StockChart from "./StockChart";
import StockMetrics from "./StockMetrics";
import LynchAnalysis from "./LynchAnalysis";
import type { StockDetail } from "../data/demo";
import { DEMO_RELIANCE } from "../data/demo";

interface StockPageProps {
  stock?: StockDetail;
  onBack?: () => void;
}

export default function StockPage({
  stock = DEMO_RELIANCE,
  onBack,
}: StockPageProps) {
  const isPositive = stock.change >= 0;
  const changeStr = `${isPositive ? "+" : ""}${stock.change.toFixed(2)}%`;
  const priceStr = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(stock.price);

  return (
    <div className="min-h-screen bg-[#070a11] text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── Back button ─────────────────────────────────────────────────── */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[12px] text-gray-600
              hover:text-gray-300 transition-colors group"
          >
            <ArrowLeft
              size={13}
              className="transition-transform duration-150 group-hover:-translate-x-0.5"
            />
            Back to Dashboard
          </button>
        )}

        {/* ── Stock header ────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              {stock.symbol}
            </h1>
            <p className="text-[13px] text-gray-500 mt-0.5">{stock.name}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-black text-white tabular-nums">
              ₹{priceStr}
            </div>
            <div
              className={`flex items-center justify-end gap-1 mt-0.5 text-sm font-bold tabular-nums ${
                isPositive ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {isPositive ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              {changeStr}
              <span className="text-[11px] text-gray-600 font-normal ml-0.5">
                today
              </span>
            </div>
          </div>
        </div>

        {/* ── Chart ───────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] px-4 pt-4 pb-3">
          {/* Chart header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-600">
              Price (30D Demo)
            </span>
            {/* Time range buttons — visual only */}
            <div className="flex items-center gap-1">
              {["1W", "1M", "3M", "1Y"].map((r, i) => (
                <button
                  key={r}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${
                    i === 1
                      ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                      : "text-gray-700 hover:text-gray-400"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <StockChart data={stock.chartData} height={160} showGrid showLabels />
        </div>

        {/* ── LYNCH Analysis + Metrics (responsive two-column) ────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LYNCH Analysis — hero component */}
          <LynchAnalysis
            signal={stock.signal}
            confidence={stock.confidence}
            risk={stock.risk}
            reasons={stock.reasons}
          />

          {/* Metrics */}
          <StockMetrics metrics={stock.metrics} />
        </div>

        {/* ── Disclaimer ──────────────────────────────────────────────────── */}
        <div className="pb-4 text-center">
          <p className="text-[10px] text-gray-800 tracking-wide">
            Demo only · All data fictional · Not financial advice
          </p>
        </div>
      </div>
    </div>
  );
}
