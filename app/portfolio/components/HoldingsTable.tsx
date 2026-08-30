"use client";

// ─────────────────────────────────────────────────────────────────────────────
// app/portfolio/components/HoldingsTable.tsx
//
// Top Holdings table component.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import Card from "@/ui/components/Card";
import { Holding } from "../types";
import { TrendingUp, TrendingDown, Table } from "lucide-react";

interface HoldingsTableProps {
  holdings: Holding[];
  onRemoveHolding?: (symbol: string) => void;
}

export default function HoldingsTable({ holdings, onRemoveHolding }: HoldingsTableProps) {
  return (
    <Card padding="md" className="overflow-hidden bg-[#0d1117]/80">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
        <div className="flex items-center gap-2">
          <Table size={16} className="text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Top Holdings</h3>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          {holdings.length} Positions
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-[#070a11] text-[10px] uppercase tracking-wider text-gray-500 font-semibold border-b border-white/[0.06]">
            <tr>
              <th className="py-2.5 px-3">Stock</th>
              <th className="py-2.5 px-3 text-right">Allocation</th>
              <th className="py-2.5 px-3 text-right">Quantity</th>
              <th className="py-2.5 px-3 text-right">Avg Price</th>
              <th className="py-2.5 px-3 text-right">Current Price</th>
              <th className="py-2.5 px-3 text-right">P&L</th>
              <th className="py-2.5 px-3 text-center">Risk</th>
              {onRemoveHolding && <th className="py-2.5 px-3 text-center">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {holdings.map((h) => {
              const currentVal = h.quantity * h.currentPrice;
              const investedVal = h.quantity * h.avgPrice;
              const pnlAbs = currentVal - investedVal;
              const pnlPct = investedVal > 0 ? ((h.currentPrice - h.avgPrice) / h.avgPrice) * 100 : 0;
              const isPositive = pnlAbs >= 0;

              return (
                <tr key={h.symbol} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      {h.symbol}
                      <span className="text-[10px] font-normal text-gray-500">• {h.sector}</span>
                    </div>
                    <div className="text-[11px] text-gray-500 truncate max-w-[150px]">{h.name}</div>
                  </td>

                  <td className="py-3 px-3 text-right font-semibold text-indigo-300">
                    {h.allocationPct}%
                  </td>

                  <td className="py-3 px-3 text-right font-medium text-gray-300">
                    {h.quantity}
                  </td>

                  <td className="py-3 px-3 text-right text-gray-400">
                    ₹{h.avgPrice.toLocaleString("en-IN", { minimumFractionDigits: 1 })}
                  </td>

                  <td className="py-3 px-3 text-right font-medium text-white">
                    ₹{h.currentPrice.toLocaleString("en-IN", { minimumFractionDigits: 1 })}
                  </td>

                  <td className="py-3 px-3 text-right font-semibold">
                    <div
                      className={[
                        "inline-flex items-center gap-1",
                        isPositive ? "text-emerald-400" : "text-rose-400",
                      ].join(" ")}
                    >
                      {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      <span>
                        {isPositive ? "+" : ""}
                        ₹{Math.abs(pnlAbs).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      </span>
                      <span className="text-[10px] opacity-80">
                        ({isPositive ? "+" : ""}
                        {pnlPct.toFixed(1)}%)
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={[
                        "px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider",
                        h.risk === "LOW"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : h.risk === "MEDIUM"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20",
                      ].join(" ")}
                    >
                      {h.risk}
                    </span>
                  </td>

                  {onRemoveHolding && (
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onRemoveHolding(h.symbol)}
                        className="text-[10px] text-gray-500 hover:text-rose-400 transition-colors"
                        title="Remove position"
                      >
                        Remove
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
