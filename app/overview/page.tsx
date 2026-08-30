"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  PieChart,
  Sparkles,
  Bell,
  Activity,
  Layers,
  Search,
  SlidersHorizontal,
  Bot,
  ShieldCheck,
} from "lucide-react";

export default function OverviewPage() {
  return (
    <div className="min-h-screen bg-[#070a11] text-white antialiased selection:bg-indigo-500/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-20">

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* HERO SECTION                                                      */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <section className="relative pt-6 pb-12 text-center md:text-left space-y-8 border-b border-white/[0.06]">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-12 -left-12 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -right-12 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 text-xs font-mono tracking-wide">
            <Zap size={12} className="text-indigo-400" />
            <span>LYNCH AI Financial Intelligence Platform</span>
          </div>

          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white">
              Understand your portfolio. <br />
              <span className="bg-gradient-to-r from-indigo-300 via-indigo-100 to-violet-300 bg-clip-text text-transparent">
                Discover opportunities.
              </span> <br />
              Act with better context.
            </h1>

            <p className="text-base sm:text-lg text-gray-400 font-normal leading-relaxed max-w-2xl pt-2">
              LYNCH combines portfolio analysis, investment research, risk monitoring, alerts, and an intelligent research interface into one cohesive financial intelligence workspace.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link
              href="/chat"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold text-white shadow-xl shadow-indigo-950/50 transition-all hover:scale-[1.02]"
            >
              <span>Open LYNCH</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/portfolio"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-sm font-semibold text-gray-200 transition-all"
            >
              <span>Explore Portfolio</span>
              <PieChart size={16} className="text-gray-400" />
            </Link>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* CAPABILITIES SECTION                                             */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <section className="space-y-10">
          <div className="space-y-2">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-400">
              Platform Capabilities
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Designed for high-conviction financial research.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Capability 01 */}
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0d1117] hover:border-indigo-500/30 transition-all group space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-400/80">01</span>
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Bot size={18} />
                </div>
              </div>
              <h3 className="text-base font-bold text-white">AI Financial Research</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Ask LYNCH questions about stocks, portfolio risks, allocation gaps, and market opportunities using structured natural language query resolution.
              </p>
            </div>

            {/* Capability 02 */}
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0d1117] hover:border-indigo-500/30 transition-all group space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-400/80">02</span>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <PieChart size={18} />
                </div>
              </div>
              <h3 className="text-base font-bold text-white">Portfolio Intelligence</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Gain immediate clarity into asset allocation, sector concentration risk, total performance, and asset weights across your holdings.
              </p>
            </div>

            {/* Capability 03 */}
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0d1117] hover:border-indigo-500/30 transition-all group space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-400/80">03</span>
                <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400">
                  <Sparkles size={18} />
                </div>
              </div>
              <h3 className="text-base font-bold text-white">Investment Ideas</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                LYNCH uses structured investment-research methodologies to screen stocks, surface theses, and rank high-priority opportunities.
              </p>
            </div>

            {/* Capability 04 */}
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0d1117] hover:border-indigo-500/30 transition-all group space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-400/80">04</span>
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                  <Bell size={18} />
                </div>
              </div>
              <h3 className="text-base font-bold text-white">Smart Alerts</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Monitor critical thresholds, price triggers, and portfolio concentration warnings with customized active alerts.
              </p>
            </div>

            {/* Capability 05 */}
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0d1117] hover:border-indigo-500/30 transition-all group space-y-4 md:col-span-2 lg:col-span-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-400/80">05</span>
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
                  <Activity size={18} />
                </div>
              </div>
              <h3 className="text-base font-bold text-white">Activity Intelligence</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Track historical agent scans, risk adjustments, and generated insights in a unified real-time activity feed.
              </p>
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* HOW LYNCH WORKS SECTION                                          */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <section className="space-y-10 border-t border-white/[0.06] pt-12">
          <div className="space-y-2">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-400">
              System Architecture Flow
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              How LYNCH processes financial intelligence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
            {/* Step 1 */}
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0d1117] text-center space-y-2">
              <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold">01. Input</div>
              <h4 className="text-xs font-bold text-white">YOUR PORTFOLIO</h4>
              <p className="text-[10px] text-gray-500">Holdings & Watchlist</p>
            </div>

            <div className="hidden md:flex justify-center text-gray-600">
              <ArrowRight size={16} />
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 text-center space-y-2">
              <div className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest font-bold">02. Engine</div>
              <h4 className="text-xs font-bold text-white">LYNCH ANALYZES</h4>
              <p className="text-[10px] text-gray-400">Quantitative Screening</p>
            </div>

            <div className="hidden md:flex justify-center text-gray-600">
              <ArrowRight size={16} />
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0d1117] text-center space-y-2">
              <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold">03. Output</div>
              <h4 className="text-xs font-bold text-white">INSIGHTS & ALERTS</h4>
              <p className="text-[10px] text-gray-500">Actionable Research</p>
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* BOTTOM CALL TO ACTION                                            */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <section className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/50 via-[#0d1117] to-violet-950/50 p-8 text-center space-y-6 shadow-2xl">
          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Ready to explore your financial workspace?
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Launch the LYNCH Chat interface or view the central Dashboard command center.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/chat"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-lg shadow-indigo-950/60"
            >
              <span>Open Chat Co-Pilot</span>
              <ArrowRight size={14} />
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-gray-300 transition-all"
            >
              <span>Go to Dashboard</span>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}