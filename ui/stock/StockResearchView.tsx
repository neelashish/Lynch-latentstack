"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/stock/StockResearchView.tsx
//
// Dedicated, comprehensive Stock Research page view.
// Consumes the centralized DEMO_STOCK_UNIVERSE dataset & analysis engine.
// Provides search selector, metrics, fundamentals, valuation, signals,
// catalysts, risks, bull/bear cases, and actions (Ask LYNCH, Compare, Portfolio Impact, Alert).
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Zap,
  TrendingUp,
  Shield,
  ArrowRight,
  PieChart,
  MessageSquare,
  Bell,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  SlidersHorizontal,
  Info,
  AlertCircle,
  BarChart3,
  Layers,
} from "lucide-react";

import {
  DEMO_STOCK_UNIVERSE,
  StockResearchProfile,
  SignalType,
  RiskLevel,
} from "@/agent/research-data";
import {
  analyzeStockInPortfolioContext,
  compareStocks,
} from "@/agent/analysis-engine";

interface StockResearchViewProps {
  initialSymbol?: string;
}

export default function StockResearchView({
  initialSymbol = "TCS",
}: StockResearchViewProps) {
  const router = useRouter();
  const [selectedSymbol, setSelectedSymbol] = useState<string>(
    initialSymbol.toUpperCase()
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [compareSymbol, setCompareSymbol] = useState<string>("");
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertCreatedText, setAlertCreatedText] = useState<string | null>(null);

  // Active stock research profile
  const stock: StockResearchProfile =
    DEMO_STOCK_UNIVERSE[selectedSymbol] || DEMO_STOCK_UNIVERSE.TCS;

  // Portfolio context analysis
  const portfolioContext = analyzeStockInPortfolioContext(stock.symbol);

  // List of all available stocks for dropdowns / search
  const allStocks = Object.values(DEMO_STOCK_UNIVERSE);

  const filteredStocks = allStocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectStock = (symbol: string) => {
    setSelectedSymbol(symbol);
    router.push(`/stocks/${symbol}`);
  };

  const handleCreateAlert = () => {
    setAlertCreatedText(`Active price & risk alert configured for ${stock.symbol}`);
    setShowAlertModal(true);
    setTimeout(() => setAlertCreatedText(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#070a11] text-white antialiased selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-8">

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 1. STOCK SEARCH / SELECTOR HEADER                                 */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-indigo-400 uppercase">
                LYNCH EQUITY RESEARCH
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl tracking-tight">
              Stock Research Workspace
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Select or search any company in our research universe for structured insights
            </p>
          </div>

          {/* Search Dropdown Input */}
          <div className="relative w-full md:w-80">
            <div className="flex items-center gap-2 bg-[#0d1117] border border-white/[0.1] rounded-xl px-3.5 py-2 focus-within:border-indigo-500/50">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticker or company..."
                className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-full"
              />
            </div>

            {searchQuery.trim() !== "" && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-30 rounded-xl bg-[#0d1117] border border-white/[0.1] shadow-2xl max-h-60 overflow-y-auto p-2 space-y-1">
                {filteredStocks.length === 0 ? (
                  <p className="text-xs text-gray-500 p-2 text-center">No stocks found</p>
                ) : (
                  filteredStocks.map((s) => (
                    <button
                      key={s.symbol}
                      onClick={() => {
                        handleSelectStock(s.symbol);
                        setSearchQuery("");
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-white/[0.05] flex items-center justify-between transition-colors text-xs"
                    >
                      <div>
                        <p className="font-bold text-white">{s.symbol}</p>
                        <p className="text-[10px] text-gray-400">{s.companyName}</p>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                        {s.sector}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 2. QUICK STOCK UNIVERSE PILLS                                    */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider shrink-0 mr-1">
            Universe:
          </span>
          {allStocks.map((s) => (
            <button
              key={s.symbol}
              onClick={() => handleSelectStock(s.symbol)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                s.symbol === stock.symbol
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-950/50"
                  : "bg-[#0d1117] text-gray-400 border-white/[0.06] hover:text-white hover:border-white/[0.12]"
              }`}
            >
              {s.symbol}
            </button>
          ))}
        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 3. STOCK HEADER & HERO BANNER                                    */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0d1117] space-y-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.06]">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-mono font-bold text-sm text-indigo-400">
                  {stock.symbol.substring(0, 3)}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    {stock.companyName}
                  </h2>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    {stock.symbol} &middot; {stock.sector} &middot; {stock.industry} &middot; Cap: {stock.marketCap}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-black text-white font-mono">{stock.price}</p>
                <p className={`text-xs font-bold font-mono ${stock.change.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}>
                  {stock.change} today
                </p>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider border ${
                  stock.signal === "BUY"
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                    : stock.signal === "HOLD"
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                    : "border-sky-500/40 bg-sky-500/10 text-sky-400"
                }`}>
                  {stock.signal}
                </span>
                <span className="text-[10px] text-gray-500 font-mono font-bold">
                  {stock.riskLevel} RISK
                </span>
              </div>
            </div>
          </div>

          {/* LYNCH Score & Priority Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#070a11] border border-white/[0.05] space-y-1">
              <p className="text-[10px] font-bold text-gray-500 uppercase">LYNCH Research Score</p>
              <p className="text-2xl font-black text-white tracking-tight">{stock.researchScore} <span className="text-xs font-normal text-gray-500">/ 100</span></p>
              <p className="text-[10px] text-indigo-400 font-bold">{stock.researchPriority}</p>
            </div>

            <div className="p-4 rounded-xl bg-[#070a11] border border-white/[0.05] space-y-1">
              <p className="text-[10px] font-bold text-gray-500 uppercase">Valuation Assessment</p>
              <p className="text-2xl font-black text-amber-400 tracking-tight">{stock.valuation.assessment}</p>
              <p className="text-[10px] text-gray-400 font-mono">P/E: {stock.valuation.pe}x &middot; P/B: {stock.valuation.pb}x</p>
            </div>

            <div className="p-4 rounded-xl bg-[#070a11] border border-white/[0.05] space-y-1">
              <p className="text-[10px] font-bold text-gray-500 uppercase">Portfolio Holding Context</p>
              <p className="text-2xl font-black text-white tracking-tight">
                {portfolioContext?.holdingWeightPct ? `${portfolioContext.holdingWeightPct}% Weight` : "0% Weight"}
              </p>
              <p className="text-[10px] text-gray-400">
                {portfolioContext?.holdingWeightPct ? "Active in demo portfolio" : "Not held in demo portfolio"}
              </p>
            </div>
          </div>

          {/* Mandatory Disclaimer */}
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-amber-400 shrink-0" />
              <span>DEMO DATA ONLY &middot; NOT REAL-TIME MARKET DATA &middot; NOT FINANCIAL ADVICE</span>
            </div>
            <span className="font-mono text-gray-400">LYNCH v1.0</span>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 4. ACTIONS BAR                                                   */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/chat?q=Analyse%20${stock.symbol}`}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-950/50 flex items-center gap-2 transition-all"
          >
            <MessageSquare size={14} />
            <span>Ask LYNCH Co-Pilot</span>
          </Link>

          <button
            onClick={() => setShowCompareModal(true)}
            className="px-5 py-2.5 rounded-xl bg-[#0d1117] border border-white/[0.1] hover:border-white/[0.2] text-xs font-bold text-gray-200 flex items-center gap-2 transition-colors"
          >
            <SlidersHorizontal size={14} />
            <span>Compare Stock</span>
          </button>

          <Link
            href={`/chat?q=How%20does%20${stock.symbol}%20affect%20my%20portfolio%3F`}
            className="px-5 py-2.5 rounded-xl bg-[#0d1117] border border-white/[0.1] hover:border-white/[0.2] text-xs font-bold text-gray-200 flex items-center gap-2 transition-colors"
          >
            <PieChart size={14} />
            <span>View Portfolio Impact</span>
          </Link>

          <button
            onClick={handleCreateAlert}
            className="px-5 py-2.5 rounded-xl bg-[#0d1117] border border-white/[0.1] hover:border-white/[0.2] text-xs font-bold text-gray-200 flex items-center gap-2 transition-colors"
          >
            <Bell size={14} />
            <span>Create Alert</span>
          </button>
        </div>

        {alertCreatedText && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>{alertCreatedText}</span>
            </div>
            <Link href="/alerts" className="underline font-mono text-[11px]">
              View All Alerts →
            </Link>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 5. FUNDAMENTALS & VALUATION GRID                                 */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Fundamentals Breakdown */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0d1117] space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-indigo-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Fundamental Analysis
                </h3>
              </div>
              <span className="text-[10px] font-mono text-gray-500">Quality: {stock.quality.businessQuality}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#070a11] border border-white/[0.05] space-y-0.5">
                <p className="text-[10px] text-gray-500 uppercase">ROE (Return on Equity)</p>
                <p className="text-sm font-black text-white">{stock.fundamentals.roe}%</p>
                <p className="text-[10px] text-emerald-400">High return on equity base</p>
              </div>

              <div className="p-3 rounded-xl bg-[#070a11] border border-white/[0.05] space-y-0.5">
                <p className="text-[10px] text-gray-500 uppercase">ROCE</p>
                <p className="text-sm font-black text-white">{stock.fundamentals.roce}%</p>
                <p className="text-[10px] text-emerald-400">Superior capital efficiency</p>
              </div>

              <div className="p-3 rounded-xl bg-[#070a11] border border-white/[0.05] space-y-0.5">
                <p className="text-[10px] text-gray-500 uppercase">Revenue Growth</p>
                <p className="text-sm font-black text-white">{stock.fundamentals.revenueGrowth}</p>
                <p className="text-[10px] text-gray-400">Consistent top-line momentum</p>
              </div>

              <div className="p-3 rounded-xl bg-[#070a11] border border-white/[0.05] space-y-0.5">
                <p className="text-[10px] text-gray-500 uppercase">Operating Margin</p>
                <p className="text-sm font-black text-white">{stock.fundamentals.operatingMargin}</p>
                <p className="text-[10px] text-indigo-400">High operating leverage</p>
              </div>

              <div className="p-3 rounded-xl bg-[#070a11] border border-white/[0.05] space-y-0.5">
                <p className="text-[10px] text-gray-500 uppercase">Debt to Equity</p>
                <p className="text-sm font-black text-white">{stock.fundamentals.debtToEquity}</p>
                <p className="text-[10px] text-gray-400">Conservative balance sheet</p>
              </div>

              <div className="p-3 rounded-xl bg-[#070a11] border border-white/[0.05] space-y-0.5">
                <p className="text-[10px] text-gray-500 uppercase">FCF Yield</p>
                <p className="text-sm font-black text-emerald-400">{stock.fundamentals.fcfYield}</p>
                <p className="text-[10px] text-gray-400">Cash generation profile</p>
              </div>
            </div>
          </div>

          {/* Valuation & Signals */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0d1117] space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-indigo-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Valuation & Signals
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-500/20 px-2 py-0.5 rounded">
                  {stock.valuation.assessment}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#070a11] border border-white/[0.05] space-y-1.5 text-xs">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Valuation Ratios</p>
                <div className="flex items-center justify-between font-mono text-gray-200">
                  <span>Trailing P/E: <strong className="text-white">{stock.valuation.pe}x</strong></span>
                  <span>Price to Book: <strong className="text-white">{stock.valuation.pb}x</strong></span>
                  <span>EV/EBITDA: <strong className="text-white">{stock.valuation.evToEbitda}x</strong></span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed pt-1 border-t border-white/[0.04]">
                  {stock.valuation.valuationNotes}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#070a11] border border-white/[0.05] space-y-2 text-xs">
                <p className="text-[10px] font-bold text-indigo-400 uppercase">LYNCH Signals</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div>Momentum: <strong className="text-white">{stock.signals.momentum}</strong></div>
                  <div>Trend: <strong className="text-white">{stock.signals.trend}</strong></div>
                  <div>Earnings: <strong className="text-white">{stock.signals.earningsMomentum}</strong></div>
                  <div>Relative: <strong className="text-emerald-400">{stock.signals.relativeStrength}</strong></div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.06] text-xs text-gray-400">
              <span className="font-bold text-white">LYNCH View: </span>
              {stock.lynchTakeaway}
            </div>
          </div>

        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 6. CATALYSTS, RISKS, BULL & BEAR SCENARIOS                       */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Catalysts & Risks */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0d1117] space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/[0.06] pb-3">
              Potential Catalysts & Risks
            </h3>

            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Potential Catalysts</p>
                <ul className="space-y-1.5">
                  {stock.catalysts.map((cat, i) => (
                    <li key={i} className="text-gray-300 flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span className="leading-relaxed">{cat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Key Downside Risks</p>
                <ul className="space-y-1.5">
                  {stock.risks.map((risk, i) => (
                    <li key={i} className="text-gray-400 flex items-start gap-2">
                      <span className="text-amber-400 font-bold shrink-0">⚠</span>
                      <span className="leading-relaxed">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bull & Bear Scenarios */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0d1117] space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/[0.06] pb-3 mb-4">
                Research Scenarios
              </h3>

              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Bull Case</p>
                  <p className="text-gray-200 leading-relaxed">{stock.bullCase}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1">
                  <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Bear Case</p>
                  <p className="text-gray-300 leading-relaxed">{stock.bearCase}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06]">
              <Link
                href={`/chat?q=Analyse%20${stock.symbol}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-950/40"
              >
                <span>Ask LYNCH Co-Pilot About {stock.symbol}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* COMPARISON MODAL OVERLAY                                         */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-[#0d1117] border border-white/[0.1] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Compare {stock.symbol} With Another Stock
              </h3>
              <button
                onClick={() => setShowCompareModal(false)}
                className="text-gray-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-400">
              Select a peer company from our research universe to run a side-by-side LYNCH comparative analysis:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {allStocks
                .filter((s) => s.symbol !== stock.symbol)
                .map((s) => (
                  <button
                    key={s.symbol}
                    onClick={() => {
                      setShowCompareModal(false);
                      router.push(`/chat?q=Compare%20${stock.symbol}%20and%20${s.symbol}`);
                    }}
                    className="w-full p-2.5 rounded-xl bg-[#070a11] border border-white/[0.05] hover:border-indigo-500/30 text-left flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <span className="font-bold text-white">{s.symbol}</span>
                      <span className="text-gray-400 ml-2">({s.companyName})</span>
                    </div>
                    <span className="text-[10px] text-indigo-400 font-mono font-bold">
                      Score: {s.researchScore}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}