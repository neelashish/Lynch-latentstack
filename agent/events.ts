// ─────────────────────────────────────────────────────────────────────────────
// agent/events.ts
//
// Clean integration point allowing the LYNCH Agent to emit alert/activity
// events without altering or duplicating teammate-owned UI components.
// ─────────────────────────────────────────────────────────────────────────────

import { ActivityItem, DEMO_ACTIVITY } from "@/ui/data/demo";
import { Activity, ActivitySeverity, getStoredActivities, saveStoredActivities } from "@/alerts/alert-data";

/** Shared session in-memory activity log, pre-populated with initial demo items */
const sessionActivityStore: ActivityItem[] = [...DEMO_ACTIVITY];

export interface EmitEventParams {
  /** Event classification determining the display icon */
  icon: "risk" | "alert" | "insight";
  /** Human-readable event description */
  text: string;
}

/**
 * Call this function from the Agent whenever an action or research workflow
 * produces a new alert or activity event.
 *
 * @example
 * emitAgentEvent({
 *   icon: "insight",
 *   text: "LYNCH generated 3 new investment ideas"
 * });
 */
export function emitAgentEvent(params: EmitEventParams): ActivityItem {
  const newEvent: ActivityItem = {
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    icon: params.icon,
    text: params.text,
    time: "Just now",
  };

  sessionActivityStore.unshift(newEvent);

  // Sync to teammate's localStorage activity feed if window is available
  if (typeof window !== "undefined") {
    try {
      const severityMap: Record<"risk" | "alert" | "insight", ActivitySeverity> = {
        risk: "danger",
        alert: "warning",
        insight: "info",
      };
      
      const newTeammateActivity: Activity = {
        id: newEvent.id,
        type: params.icon === "risk" || params.icon === "alert" ? "alert_triggered" : "simulated_event",
        symbol: "LYNCH",
        title: params.icon === "risk" ? "Risk Scan Executed" : params.icon === "alert" ? "Research Alert" : "AI Insight Generated",
        description: params.text,
        timestamp: new Date().toISOString(),
        severity: severityMap[params.icon] || "info",
        lynchView: "ANALYSIS COMPLETE",
        confidence: "90%",
        risk: params.icon === "risk" ? "High" : "Low",
      };

      const stored = getStoredActivities();
      // Avoid duplicate insertion if same ID already present
      if (!stored.some((a) => a.id === newTeammateActivity.id)) {
        saveStoredActivities([newTeammateActivity, ...stored]);
      }
    } catch (err) {
      console.error("Failed to sync agent event to teammate activity store:", err);
    }

    window.dispatchEvent(
      new CustomEvent("lynch:activity", { detail: newEvent })
    );
    if (params.icon === "alert" || params.icon === "risk") {
      window.dispatchEvent(
        new CustomEvent("lynch:alert", { detail: newEvent })
      );
    }
  }

  return newEvent;
}

/**
 * Returns all activity log items accumulated in the current session.
 */
export function getSessionActivityLog(): ActivityItem[] {
  return sessionActivityStore;
}
