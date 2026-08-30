'use client';

import React, { useState, useEffect } from 'react';
import {
  Alert,
  Activity,
  getStoredAlerts,
  saveStoredAlerts,
  getStoredActivities,
} from './alert-data';
import AlertCard from './AlertCard';
import CreateAlert from './CreateAlert';
import DemoEventSimulator from './DemoEventSimulator';
import ActivityFeed from './ActivityFeed';
import { Plus, Bell, ShieldAlert, Activity as ActivityIcon } from 'lucide-react';

interface AlertManagerProps {
  onAskLynch?: (activity: Activity) => void;
  showActivityFeed?: boolean;
}

export const AlertManager: React.FC<AlertManagerProps> = ({
  onAskLynch,
  showActivityFeed = true,
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [activityRefreshKey, setActivityRefreshKey] = useState<number>(0);

  // Load initial state on mount (client-side)
  useEffect(() => {
    const loaded = getStoredAlerts();
    setAlerts(loaded);
    setIsLoaded(true);
  }, []);

  const refreshState = () => {
    const updatedAlerts = getStoredAlerts();
    setAlerts(updatedAlerts);
    setActivityRefreshKey((prev) => prev + 1);
  };

  const handleCreateAlert = (newAlert: Alert) => {
    const updatedAlerts = [newAlert, ...alerts];
    setAlerts(updatedAlerts);
    saveStoredAlerts(updatedAlerts);
    setActivityRefreshKey((prev) => prev + 1);
  };

  const handleToggleAlert = (id: string) => {
    const updatedAlerts = alerts.map((a) => {
      if (a.id === id) {
        const isCurrentlyActive = a.status === 'active' || a.enabled === true;
        const newStatus = isCurrentlyActive ? ('disabled' as const) : ('active' as const);
        return {
          ...a,
          status: newStatus,
          enabled: !isCurrentlyActive,
        };
      }
      return a;
    });

    setAlerts(updatedAlerts);
    saveStoredAlerts(updatedAlerts);
    setActivityRefreshKey((prev) => prev + 1);
  };

  const handleDeleteAlert = (id: string) => {
    const updatedAlerts = alerts.filter((a) => a.id !== id);
    setAlerts(updatedAlerts);
    saveStoredAlerts(updatedAlerts);
    setActivityRefreshKey((prev) => prev + 1);
  };

  if (!isLoaded) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50">
        <p className="text-sm text-slate-400">Loading alerts...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              LYNCH ALERTS & ACTIVITY
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">
            Your Proactive Monitoring
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Set and manage real-time alert conditions for portfolio assets
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-950/30 transition-all hover:bg-emerald-500 hover:shadow-emerald-900/40"
        >
          <Plus className="h-4 w-4" />
          <span>Create Alert</span>
        </button>
      </div>

      {/* Active Alerts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              ACTIVE ALERTS ({alerts.length})
            </h2>
          </div>
        </div>

        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
            <ShieldAlert className="h-10 w-10 text-slate-600" />
            <h3 className="mt-3 text-base font-medium text-slate-300">
              No alerts configured
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Create an alert above to start monitoring portfolio conditions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onToggle={handleToggleAlert}
                onDelete={handleDeleteAlert}
              />
            ))}
          </div>
        )}
      </div>

      {/* Demo Event Simulator Section */}
      <div className="pt-2">
        <DemoEventSimulator onEventSimulated={refreshState} />
      </div>

      {/* Embedded Activity Feed */}
      {showActivityFeed && (
        <div className="pt-4 border-t border-slate-800/80">
          <ActivityFeed key={activityRefreshKey} onAskLynch={onAskLynch} />
        </div>
      )}

      {/* Create Alert Modal */}
      <CreateAlert
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateAlert}
      />
    </div>
  );
};

export default AlertManager;
