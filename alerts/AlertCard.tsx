'use client';

import React from 'react';
import { Alert } from './alert-data';
import { Trash2, Bell, BellOff, Clock } from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onToggle,
  onDelete,
}) => {
  const isActive = alert.status === 'active' || alert.enabled === true;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffHours < 1) return 'Created just now';
      if (diffHours < 24) return `Created ${diffHours}h ago`;
      if (diffDays === 1) return 'Created yesterday';
      if (diffDays < 7) return `Created ${diffDays} days ago`;
      return `Created on ${date.toLocaleDateString()}`;
    } catch {
      return `Created ${dateStr}`;
    }
  };

  return (
    <div
      className={`relative flex flex-col justify-between rounded-xl border p-5 transition-all duration-200 ${
        isActive
          ? 'border-emerald-500/30 bg-slate-900/80 shadow-lg shadow-emerald-950/10 hover:border-emerald-500/50'
          : 'border-slate-800 bg-slate-950/60 opacity-75 hover:opacity-100 hover:border-slate-700'
      }`}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg border font-mono text-sm font-bold tracking-wider ${
              isActive
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-slate-700 bg-slate-800/50 text-slate-400'
            }`}
          >
            {alert.symbol.substring(0, 3)}
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 tracking-wide text-lg">
              {alert.symbol}
            </h3>
            <p className="text-sm font-medium text-slate-300">
              {alert.condition}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${
            isActive
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-slate-700 bg-slate-800/60 text-slate-400'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
            }`}
          />
          {isActive ? 'Monitoring ON' : 'Monitoring OFF'}
        </div>
      </div>

      {/* Middle/Threshold info if available */}
      {alert.threshold !== undefined && (
        <div className="mt-3 text-xs text-slate-400">
          Threshold: <span className="font-mono text-slate-200">{alert.threshold}</span>
        </div>
      )}

      {/* Footer Section */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock className="h-3.5 w-3.5 text-slate-500" />
          <span>{formatDate(alert.createdAt)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggle && onToggle(alert.id)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              isActive
                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                : 'bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30'
            }`}
            title={isActive ? 'Disable alert' : 'Enable alert'}
          >
            {isActive ? (
              <>
                <BellOff className="h-3.5 w-3.5 text-slate-400" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Bell className="h-3.5 w-3.5 text-emerald-400" />
                <span>Enable</span>
              </>
            )}
          </button>

          <button
            onClick={() => onDelete && onDelete(alert.id)}
            className="flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 p-1.5 text-slate-400 transition-colors hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400"
            title="Delete alert"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
