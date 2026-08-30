'use client';

import React, { useState } from 'react';
import {
  Alert,
  Activity,
  getStoredAlerts,
  saveStoredAlerts,
  getStoredActivities,
  saveStoredActivities,
} from './alert-data';
import { Zap, CheckCircle2 } from 'lucide-react';

interface DemoEventSimulatorProps {
  onEventSimulated?: () => void;
}

export const DemoEventSimulator: React.FC<DemoEventSimulatorProps> = ({
  onEventSimulated,
}) => {
  const [notification, setNotification] = useState<string | null>(null);

  const triggerEvent = (
    symbol: string,
    title: string,
    description: string,
    severity: 'info' | 'success' | 'warning' | 'danger' | 'critical',
    lynchView: string,
    confidence: string,
    risk: string,
    metric: string,
    prevVal: string,
    newVal: string,
    reason: string,
    recommendation: string
  ) => {
    // Fetch latest stored alerts and activities
    const alerts = getStoredAlerts();
    const activities = getStoredActivities();

    // Find matching alert if any
    const matchingAlert = alerts.find(
      (a) => a.symbol === symbol && (a.status === 'active' || a.enabled)
    );

    // Update alert status if matched
    if (matchingAlert) {
      const updatedAlerts = alerts.map((a) =>
        a.id === matchingAlert.id
          ? { ...a, status: 'triggered' as const }
          : a
      );
      saveStoredAlerts(updatedAlerts);
    }

    // Create new Activity
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      type: 'simulated_event',
      alertId: matchingAlert?.id,
      symbol,
      title,
      description,
      timestamp: new Date().toISOString(),
      severity,
      details: {
        metric,
        previousValue: prevVal,
        newValue: newVal,
        reason,
        recommendation,
      },
      lynchView,
      confidence,
      risk,
    };

    saveStoredActivities([newActivity, ...activities]);

    setNotification(`Simulated Event Triggered for ${symbol}: ${title}`);
    setTimeout(() => setNotification(null), 3500);

    if (onEventSimulated) {
      onEventSimulated();
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Zap className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
            DEMO EVENT SIMULATOR
          </h3>
          <p className="text-xs text-slate-400">
            Simulate market events to trigger proactive alerts & activities
          </p>
        </div>
      </div>

      {notification && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button
          onClick={() =>
            triggerEvent(
              'RELIANCE',
              'Risk Spike Triggered',
              'RELIANCE downside vulnerability score surged past alert threshold.',
              'danger',
              'Elevated short positions and sector index decline signals near-term pressure.',
              '88%',
              'High',
              'Risk Score',
              '62/100',
              '81/100',
              'Sudden institutional block selling detected.',
              'Rebalance portfolio risk exposure or apply tight stop-loss.'
            )
          }
          className="flex flex-col items-start rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 text-left transition-all hover:border-rose-500/40 hover:bg-rose-500/10"
        >
          <div className="flex items-center justify-between w-full">
            <span className="font-mono text-xs font-bold text-rose-400">
              RELIANCE
            </span>
            <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] text-rose-300">
              Risk Surge
            </span>
          </div>
          <span className="mt-1.5 text-xs text-slate-300">
            Simulate Risk Spike (&gt;75)
          </span>
        </button>

        <button
          onClick={() =>
            triggerEvent(
              'TCS',
              'Momentum Breakout',
              'TCS cross-over technical indicators flashed positive bullish momentum.',
              'success',
              'Sustained breakout past 50-day EMA accompanied by volume accumulation.',
              '92%',
              'Medium',
              'Momentum Index',
              '-0.05',
              '+0.58',
              'Earnings guidance upgrade speculation.',
              'Initiate or enlarge tactical long momentum position.'
            )
          }
          className="flex flex-col items-start rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-left transition-all hover:border-emerald-500/40 hover:bg-emerald-500/10"
        >
          <div className="flex items-center justify-between w-full">
            <span className="font-mono text-xs font-bold text-emerald-400">
              TCS
            </span>
            <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-300">
              Momentum
            </span>
          </div>
          <span className="mt-1.5 text-xs text-slate-300">
            Simulate Bullish Momentum
          </span>
        </button>

        <button
          onClick={() =>
            triggerEvent(
              'INFY',
              'Volatility Spike',
              'INFY implied volatility jumped significantly ahead of key announcements.',
              'warning',
              'Unusual option chain skew indicating market uncertainty.',
              '78%',
              'Medium-High',
              'Volatility Index',
              '18%',
              '31%',
              'Pre-earnings straddle buying spike.',
              'Monitor delta-neutral options or await guidance clarity.'
            )
          }
          className="flex flex-col items-start rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-left transition-all hover:border-amber-500/40 hover:bg-amber-500/10"
        >
          <div className="flex items-center justify-between w-full">
            <span className="font-mono text-xs font-bold text-amber-400">
              INFY
            </span>
            <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-300">
              Volatility
            </span>
          </div>
          <span className="mt-1.5 text-xs text-slate-300">
            Simulate Volatility Surge (&gt;25%)
          </span>
        </button>
      </div>
    </div>
  );
};

export default DemoEventSimulator;
