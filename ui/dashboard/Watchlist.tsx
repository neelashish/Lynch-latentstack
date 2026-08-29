"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/dashboard/Watchlist.tsx
//
// Watchlist panel — renders StockCard list from props.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Eye } from "lucide-react";
import StockCard from "./StockCard";
import type { Stock } from "../data/demo";
import { DEMO_WATCHLIST } from "../data/demo";

interface WatchlistProps {
  stocks?: Stock[];
  onStockClick?: (stock: Stock) => void;
}

export default function Watchlist({
  stocks = DEMO_WATCHLIST,
  onStockClick,
}: WatchlistProps) {
  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Eye size={13} className="text-indigo-500/70" />
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
            Watchlist
          </span>
        </div>
        <span className="text-[10px] text-gray-700">
          {stocks.length} stocks
        </span>
      </div>

      {/* Stock list */}
      <div className="space-y-2">
        {stocks.map((stock) => (
          <StockCard
            key={stock.symbol}
            stock={stock}
            variant="compact"
            onClick={onStockClick}
          />
        ))}
      </div>
    </div>
  );
}
