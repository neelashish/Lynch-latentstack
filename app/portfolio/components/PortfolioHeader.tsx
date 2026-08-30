"use client";

// ─────────────────────────────────────────────────────────────────────────────
// app/portfolio/components/PortfolioHeader.tsx
//
// Header bar for Portfolio Analyzer with title, subtitle, and Connect Portfolio button.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Plug, CheckCircle2 } from "lucide-react";

interface PortfolioHeaderProps {
  isConnected: boolean;
  connectedBroker?: string;
  onOpenConnector: () => void;
  onOpenManualModal: () => void;
}

export default function PortfolioHeader({
  isConnected,
  connectedBroker,
  onOpenConnector,
  onOpenManualModal,
}: PortfolioHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <span>Portfolio</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Monitor your holdings, performance and risk.
        </p>
      </div>

      <div className="flex items-center gap-3 self-start sm:self-auto">
        {/* Manual Add Button */}
        <button
          onClick={onOpenManualModal}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0d1117] border border-white/[0.1] text-gray-300 hover:text-white hover:border-white/[0.2] transition-colors"
        >
          + Add Holding
        </button>

        {/* Connect Portfolio Button */}
        {isConnected ? (
          <button
            onClick={onOpenConnector}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/20 transition-all shadow-lg shadow-emerald-950/20"
          >
            <CheckCircle2 size={15} className="text-emerald-400" />
            <span>Portfolio Connected ({connectedBroker || "Demo"})</span>
          </button>
        ) : (
          <button
            onClick={onOpenConnector}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-950/50 transition-all"
          >
            <Plug size={15} />
            <span>Connect Portfolio</span>
          </button>
        )}
      </div>
    </div>
  );
}
