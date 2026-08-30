'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, ActivitySeverity } from './alert-data';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, ShieldAlert, ArrowRight, Clock } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  onViewDetails?: (activity: Activity) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onViewDetails,
}) => {
  const getSeverityStyles = (severity: ActivitySeverity) => {
    switch (severity) {
      case 'danger':
      case 'critical':
        return {
          badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          dotBg: 'bg-rose-500',
          icon: <AlertTriangle className="h-4 w-4 text-rose-400" />,
          borderHover: 'hover:border-rose-500/40',
        };
      case 'warning':
        return {
          badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          dotBg: 'bg-amber-500',
          icon: <AlertCircle className="h-4 w-4 text-amber-400" />,
          borderHover: 'hover:border-amber-500/40',
        };
      case 'success':
        return {
          badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dotBg: 'bg-emerald-500',
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
          borderHover: 'hover:border-emerald-500/40',
        };
      case 'info':
      default:
        return {
          badgeBg: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
          dotBg: 'bg-sky-500',
          icon: <Info className="h-4 w-4 text-sky-400" />,
          borderHover: 'hover:border-sky-500/40',
        };
    }
  };

  const styles = getSeverityStyles(activity.severity);

  const formatTimestamp = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0d1117] p-5 shadow-lg transition-all duration-200 ${styles.borderHover} hover:bg-[#0d1117]/80 hover:shadow-black/50`}
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Link
              href={`/stocks/${activity.symbol}`}
              onClick={(e) => e.stopPropagation()}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles.badgeBg} hover:opacity-80 transition-opacity`}
            >
              <span className={`h-2 w-2 rounded-full ${styles.dotBg} animate-pulse`} />
              {activity.symbol}
            </Link>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              {activity.type.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span>{formatTimestamp(activity.timestamp)}</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 shrink-0">{styles.icon}</div>
          <div>
            <h3 className="font-semibold text-slate-100 text-base group-hover:text-white">
              {activity.title}
            </h3>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              {activity.description}
            </p>
          </div>
        </div>
      </div>

      {/* Lynch View & Risk Badges (if present) */}
      {(activity.lynchView || activity.risk) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800/60 pt-3 text-xs">
          {activity.lynchView && (
            <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[11px] text-slate-300">
              View: <strong className="text-slate-100">{activity.lynchView}</strong>
            </span>
          )}
          {activity.risk && (
            <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[11px] text-slate-300">
              Risk: <strong className="text-slate-100">{activity.risk}</strong>
            </span>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-4 flex items-center justify-end border-t border-slate-800/80 pt-3">
        <button
          onClick={() => onViewDetails && onViewDetails(activity)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-1.5 text-xs font-medium text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-700 hover:text-white"
        >
          <span>View Details</span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;
