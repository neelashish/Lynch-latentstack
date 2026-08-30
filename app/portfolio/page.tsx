"use client";

// ─────────────────────────────────────────────────────────────────────────────
// app/portfolio/page.tsx
//
// LYNCH Portfolio Feature Route.
// Completely redesigned into a clean, modern, AI-finance interface.
// Features tab navigation, Connect Portfolio modal flow, Manual Entry, and reactive client state.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import Header from "@/ui/navigation/Header";
import Sidebar from "@/ui/navigation/Sidebar";
import PortfolioHeader from "./components/PortfolioHeader";
import PortfolioSummary from "./components/PortfolioSummary";
import Allocation from "./components/Allocation";
import RiskInsights from "./components/RiskInsights";
import HoldingsTable from "./components/HoldingsTable";
import PerformanceChart from "./components/PerformanceChart";
import PortfolioConnector from "./components/PortfolioConnector";
import ManualEntryModal from "./components/ManualEntryModal";
import { INITIAL_DEMO_HOLDINGS } from "./data/demo-data";
import { Holding } from "./types";
import { calculatePortfolioSummary, recalculateAllocations } from "./utils";
import { emitAgentEvent } from "@/agent/events";

type ActiveTab = "overview" | "holdings" | "allocation" | "performance";

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<Holding[]>(INITIAL_DEMO_HOLDINGS);
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [isConnected, setIsConnected] = useState(true);
  const [connectedBroker, setConnectedBroker] = useState("Zerodha (Demo)");
  const [connectorOpen, setConnectorOpen] = useState(false);
  const [manualModalOpen, setManualModalOpen] = useState(false);

  // Recalculate allocations whenever holdings change
  const currentHoldings = recalculateAllocations(holdings);
  const summary = calculatePortfolioSummary(currentHoldings, isConnected, connectedBroker);

  // On mount: Dispatches LYNCH Activity event safely
  useEffect(() => {
    try {
      emitAgentEvent({
        icon: "insight",
        text: "LYNCH portfolio risk intelligence scan completed",
      });
    } catch {
      // Ignore if event system uninitialized
    }
  }, []);

  const handleAddHolding = (newHolding: Holding) => {
    const updated = [newHolding, ...holdings];
    setHoldings(updated);

    try {
      emitAgentEvent({
        icon: "insight",
        text: `Manual holding added: ${newHolding.symbol} (${newHolding.quantity} qty)`,
      });
    } catch {
      // Safe fallback
    }
  };

  const handleRemoveHolding = (symbol: string) => {
    const updated = holdings.filter((h) => h.symbol !== symbol);
    setHoldings(updated);
  };

  const handleConnected = (brokerName: string) => {
    setIsConnected(true);
    setConnectedBroker(brokerName);

    try {
      emitAgentEvent({
        icon: "alert",
        text: `Portfolio imported via ${brokerName}`,
      });
    } catch {
      // Safe fallback
    }
  };

  return (
    <div className="min-h-screen bg-[#070a11] text-gray-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar activeItem="portfolio" />

      {/* Main Container */}
      <div className="flex-1 lg:pl-60 flex flex-col min-w-0">
        <Header title="Portfolio Analyzer" />

        <main className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Bar */}
          <PortfolioHeader
            isConnected={isConnected}
            connectedBroker={connectedBroker}
            onOpenConnector={() => setConnectorOpen(true)}
            onOpenManualModal={() => setManualModalOpen(true)}
          />

          {/* Portfolio Snapshot Cards */}
          <PortfolioSummary summary={summary} />

          {/* Navigation Tabs Bar */}
          <div className="flex border-b border-white/[0.06] space-x-6 text-xs font-semibold">
            {[
              { id: "overview", label: "Overview" },
              { id: "holdings", label: "Holdings" },
              { id: "allocation", label: "Allocation" },
              { id: "performance", label: "Performance" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={[
                  "pb-3 transition-colors relative",
                  activeTab === tab.id
                    ? "text-indigo-400 font-bold"
                    : "text-gray-400 hover:text-gray-200",
                ].join(" ")}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Allocation & Risk Intelligence */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Allocation holdings={currentHoldings} totalValue={summary.totalValue} />
                <RiskInsights holdings={currentHoldings} />
              </div>

              {/* Performance Trend */}
              <PerformanceChart />

              {/* Top Holdings Table */}
              <HoldingsTable
                holdings={currentHoldings}
                onRemoveHolding={handleRemoveHolding}
              />
            </div>
          )}

          {activeTab === "holdings" && (
            <HoldingsTable
              holdings={currentHoldings}
              onRemoveHolding={handleRemoveHolding}
            />
          )}

          {activeTab === "allocation" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Allocation holdings={currentHoldings} totalValue={summary.totalValue} />
              <RiskInsights holdings={currentHoldings} />
            </div>
          )}

          {activeTab === "performance" && <PerformanceChart />}
        </main>
      </div>

      {/* Connect Portfolio Modal */}
      <PortfolioConnector
        isOpen={connectorOpen}
        onClose={() => setConnectorOpen(false)}
        onConnected={handleConnected}
      />

      {/* Manual Entry Modal */}
      <ManualEntryModal
        isOpen={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
        onAddHolding={handleAddHolding}
      />
    </div>
  );
}
