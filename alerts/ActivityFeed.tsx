'use client';

import React, { useState, useEffect } from 'react';
import { Activity, getStoredActivities } from './alert-data';
import ActivityCard from './ActivityCard';
import ActivityDetails from './ActivityDetails';
import { Activity as ActivityIcon } from 'lucide-react';

interface ActivityFeedProps {
  onSelectActivity?: (activity: Activity) => void;
  onAskLynch?: (activity: Activity) => void;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  onSelectActivity,
  onAskLynch,
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const loaded = getStoredActivities();
    // Sort newest activity first by timestamp
    const sorted = [...loaded].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setActivities(sorted);
    setIsLoaded(true);
  }, []);

  const handleCardClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsDetailsOpen(true);
    if (onSelectActivity) {
      onSelectActivity(activity);
    }
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedActivity(null);
  };

  if (!isLoaded) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50">
        <p className="text-sm text-slate-400">Loading activity feed...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <ActivityIcon className="h-5 w-5 text-emerald-400" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
            LYNCH ACTIVITY
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">
          Proactive Event Feed
        </h1>
        <p className="text-sm text-slate-400">
          Real-time log of market events, trigger condition matches, and system alerts
        </p>
      </div>

      {/* Activity Cards List */}
      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
          <ActivityIcon className="h-10 w-10 text-slate-600" />
          <h3 className="mt-3 text-base font-medium text-slate-300">
            No activity logged yet
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Triggered alerts and simulated events will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((act) => (
            <ActivityCard
              key={act.id}
              activity={act}
              onViewDetails={handleCardClick}
            />
          ))}
        </div>
      )}

      {/* Activity Details Modal Overlay */}
      <ActivityDetails
        activity={selectedActivity}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        onAskLynch={onAskLynch}
      />
    </div>
  );
};

export default ActivityFeed;
