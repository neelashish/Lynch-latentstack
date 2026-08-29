// ─────────────────────────────────────────────────────────────────────────────
// agent/events.ts
//
// Clean integration point allowing the LYNCH Agent to emit alert/activity
// events without altering or duplicating teammate-owned UI components.
// ─────────────────────────────────────────────────────────────────────────────

import { ActivityItem, DEMO_ACTIVITY } from "@/ui/data/demo";

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

  if (typeof window !== "undefined") {
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
