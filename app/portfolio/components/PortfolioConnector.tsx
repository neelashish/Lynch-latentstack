"use client";

// ─────────────────────────────────────────────────────────────────────────────
// app/portfolio/components/PortfolioConnector.tsx
//
// Connect Portfolio Modal component.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import Modal from "@/ui/components/Modal";
import { ConnectorBroker } from "../types";
import { ShieldCheck, CheckCircle2, ArrowRight, Lock } from "lucide-react";

interface PortfolioConnectorProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: (brokerName: string) => void;
}

const BROKERS: Array<{ id: ConnectorBroker; name: string; tag: string; logoBg: string }> = [
  { id: "Zerodha", name: "Zerodha Kite", tag: "Popular", logoBg: "bg-blue-500/20 text-blue-400" },
  { id: "Groww", name: "Groww Direct", tag: "Direct Mutual/Stocks", logoBg: "bg-emerald-500/20 text-emerald-400" },
  { id: "Upstox", name: "Upstox Pro", tag: "Pro Trading", logoBg: "bg-purple-500/20 text-purple-400" },
  { id: "CoinDCX", name: "CoinDCX", tag: "Crypto & Web3", logoBg: "bg-amber-500/20 text-amber-400" },
];

export default function PortfolioConnector({
  isOpen,
  onClose,
  onConnected,
}: PortfolioConnectorProps) {
  const [selectedBroker, setSelectedBroker] = useState<ConnectorBroker | null>(null);
  const [step, setStep] = useState<"select" | "auth" | "success">("select");
  const [username, setUsername] = useState("demo_investor");
  const [password, setPassword] = useState("••••••••");

  const handleConnectDemo = () => {
    setStep("success");
    setTimeout(() => {
      if (selectedBroker) {
        onConnected(`${selectedBroker} (Demo)`);
      }
      setStep("select");
      setSelectedBroker(null);
      onClose();
    }, 1200);
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Connect Your Portfolio">
      <div className="p-1 space-y-4">
        {step === "select" && (
          <>
            <p className="text-xs text-gray-400">
              Import your holdings into LYNCH to unlock real-time risk intelligence and AI observations.
            </p>

            <div className="space-y-2 mt-3">
              {BROKERS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBroker(b.id);
                    setStep("auth");
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#070a11] border border-white/[0.08] hover:border-indigo-500/40 hover:bg-[#0d1117] transition-all group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg ${b.logoBg} flex items-center justify-center font-bold text-xs`}>
                      {b.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {b.name}
                      </p>
                      <p className="text-[10px] text-gray-500">{b.tag}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-white/[0.05] text-gray-400">
                      Demo Connector
                    </span>
                    <ArrowRight size={14} className="text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                </button>
              ))}
            </div>

            <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] flex items-center gap-2">
              <ShieldCheck size={14} className="shrink-0 text-indigo-400" />
              <span>Read-only sandbox simulation for hackathon prototype testing.</span>
            </div>
          </>
        )}

        {step === "auth" && selectedBroker && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <span className="text-xs font-bold text-white">Authenticate with {selectedBroker}</span>
              <button
                onClick={() => setStep("select")}
                className="text-[10px] text-indigo-400 hover:underline"
              >
                Change Broker
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-gray-400 font-medium block mb-1">Demo User ID</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#070a11] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 font-medium block mb-1">Demo API Token</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#070a11] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] flex items-center gap-2">
              <Lock size={13} className="shrink-0 text-amber-400" />
              <span>Sandbox mode — no real credentials transmitted or stored.</span>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={handleConnectDemo}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg transition-all"
              >
                Continue with Demo Account
              </button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Portfolio Connected Successfully</p>
              <p className="text-xs text-gray-400 mt-1">6 holdings imported into LYNCH demo state.</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
