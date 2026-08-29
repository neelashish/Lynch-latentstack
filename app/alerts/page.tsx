"use client";

import React from "react";
import { Bell } from "lucide-react";

export default function AlertsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Alerts & Notifications</h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time trigger monitoring and portfolio risk alerts.
          </p>
        </div>
        <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold">
          Integration Pending
        </span>
      </div>

      <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-[#0d1117] border border-white/[0.07] text-center space-y-3">
        <div className="p-3.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
          <Bell size={24} className="text-indigo-400" />
        </div>
        <h3 className="text-base font-semibold text-white">Alerts Module Integration</h3>
        <p className="text-xs text-gray-400 max-w-md leading-relaxed">
          The Alerts system is being integrated separately by another teammate. This route is ready for the final alerts component.
        </p>
      </div>
    </div>
  );
}
