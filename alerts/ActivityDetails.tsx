'use client';

import React from 'react';
import { Activity } from './alert-data';
import { X, Bot, ShieldAlert, Sparkles, AlertTriangle, CheckCircle2, Info, ArrowUpRight } from 'lucide-react';

interface ActivityDetailsProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onAskLynch?: (activity: Activity) => void;
}

export const ActivityDetails: React.FC<ActivityDetailsProps> = ({
  activity,
  isOpen,
  onClose,
  onAskLynch,
}) => {
  if (!isOpen || !activity) return null;

  const formatTimestamp = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString([], {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return dateStr;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'danger':
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-400">
            <AlertTriangle className="h-3 w-3" />
            {severity.toUpperCase()}
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
            <AlertTriangle className="h-3 w-3" />
            {severity.toUpperCase()}
          </span>
        );
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            {severity.toUpperCase()}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-400">
            <Info className="h-3 w-3" />
            {severity.toUpperCase()}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-slate-950/80">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 border-b border-slate-800/80 pb-4 pr-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80 font-mono text-base font-bold text-slate-100">
            {activity.symbol}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {activity.symbol}
              </span>
              {getSeverityBadge(activity.severity)}
            </div>
            <h2 className="mt-1 text-lg font-bold text-slate-100">
              {activity.title}
            </h2>
            <p className="text-xs text-slate-500">
              Triggered on {formatTimestamp(activity.timestamp)}
            </p>
          </div>
        </div>

        {/* Body Content */}
        <div className="mt-5 space-y-4 text-sm">
          {/* What happened? */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              What Happened?
            </h3>
            <p className="mt-1.5 text-sm text-slate-200 leading-relaxed">
              {activity.description || 'The configured risk condition was triggered in the demo scenario.'}
            </p>
            {activity.details?.reason && (
              <p className="mt-2 text-xs text-slate-400 italic">
                Reason: {String(activity.details.reason)}
              </p>
            )}
          </div>

          {/* Why does it matter? */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Why Does It Matter?
            </h3>
            <p className="mt-1.5 text-sm text-slate-200 leading-relaxed">
              {activity.details?.recommendation
                ? String(activity.details.recommendation)
                : 'The demo scenario indicates elevated short-term market volatility requiring portfolio attention.'}
            </p>
          </div>

          {/* LYNCH View Section */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                LYNCH AI ANALYSIS
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-2.5">
                <span className="block text-[10px] font-medium text-slate-400 uppercase">
                  LYNCH VIEW
                </span>
                <span className="mt-1 block font-mono text-sm font-bold text-emerald-400">
                  {activity.lynchView || 'HOLD'}
                </span>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-2.5">
                <span className="block text-[10px] font-medium text-slate-400 uppercase">
                  CONFIDENCE
                </span>
                <span className="mt-1 block font-mono text-sm font-bold text-sky-400">
                  {activity.confidence || '81%'}
                </span>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-2.5">
                <span className="block text-[10px] font-medium text-slate-400 uppercase">
                  RISK
                </span>
                <span className="mt-1 block font-mono text-sm font-bold text-amber-400">
                  {activity.risk || 'MEDIUM'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            Close
          </button>

          <button
            onClick={() => {
              if (onAskLynch) {
                onAskLynch(activity);
              }
            }}
            className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-950/40 hover:bg-emerald-500 transition-all"
          >
            <Bot className="h-4 w-4" />
            <span>Ask LYNCH About This</span>
            <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;
