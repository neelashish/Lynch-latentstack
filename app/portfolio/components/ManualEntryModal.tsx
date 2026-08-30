"use client";

// ─────────────────────────────────────────────────────────────────────────────
// app/portfolio/components/ManualEntryModal.tsx
//
// Allows users to manually add custom holdings to the portfolio state.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import Modal from "@/ui/components/Modal";
import { Holding, RiskLevel } from "../types";

interface ManualEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHolding: (holding: Holding) => void;
}

export default function ManualEntryModal({
  isOpen,
  onClose,
  onAddHolding,
}: ManualEntryModalProps) {
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [sector, setSector] = useState("Technology");
  const [quantity, setQuantity] = useState("10");
  const [avgPrice, setAvgPrice] = useState("1000");
  const [currentPrice, setCurrentPrice] = useState("1050");
  const [risk, setRisk] = useState<RiskLevel>("LOW");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !name) return;

    const newHolding: Holding = {
      symbol: symbol.toUpperCase().trim(),
      name: name.trim(),
      sector: sector.trim(),
      quantity: Number(quantity) || 1,
      avgPrice: Number(avgPrice) || 1000,
      currentPrice: Number(currentPrice) || 1000,
      allocationPct: 0, // Recalculated dynamically
      risk,
    };

    onAddHolding(newHolding);
    setSymbol("");
    setName("");
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Add Holding Manually">
      <form onSubmit={handleSubmit} className="space-y-3 p-1">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-gray-400 font-medium block mb-1">Stock Symbol</label>
            <input
              type="text"
              placeholder="e.g. TATAMOTORS"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              required
              className="w-full bg-[#070a11] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 font-medium block mb-1">Sector</label>
            <input
              type="text"
              placeholder="e.g. Automotive"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              required
              className="w-full bg-[#070a11] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] text-gray-400 font-medium block mb-1">Company Name</label>
          <input
            type="text"
            placeholder="e.g. Tata Motors Ltd"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-[#070a11] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] text-gray-400 font-medium block mb-1">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              className="w-full bg-[#070a11] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-gray-400 font-medium block mb-1">Avg Price (₹)</label>
            <input
              type="number"
              value={avgPrice}
              onChange={(e) => setAvgPrice(e.target.value)}
              required
              className="w-full bg-[#070a11] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-gray-400 font-medium block mb-1">Current Price (₹)</label>
            <input
              type="number"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              required
              className="w-full bg-[#070a11] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] text-gray-400 font-medium block mb-1">Risk Profile</label>
          <select
            value={risk}
            onChange={(e) => setRisk(e.target.value as RiskLevel)}
            className="w-full bg-[#070a11] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
          >
            Add Position
          </button>
        </div>
      </form>
    </Modal>
  );
}
