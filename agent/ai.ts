// ─────────────────────────────────────────────────────────────────────────────
// agent/ai.ts
//
// LYNCH demo intelligence layer.
//
// Responsibilities:
//   1. Normalize the raw user message.
//   2. Detect intent via keyword matching.
//   3. Resolve follow-up questions using a minimal ConversationContext.
//   4. Return the correct LynchResponse from demo-responses.ts.
//
// Constraints:
//   - No real AI / external API calls.
//   - No React, no browser APIs, no database access.
//   - Fully reusable by any part of the application.
// ─────────────────────────────────────────────────────────────────────────────

import { getDemoResponse, LynchResponse } from "./demo-responses";
import { emitAgentEvent } from "./events";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

/**
 * Minimal conversation context passed in by the caller (e.g. Chat.tsx).
 * The caller is responsible for maintaining and updating this object.
 * Keep it small — this is NOT a memory system.
 */
export interface ConversationContext {
  /** The intent key resolved in the immediately preceding turn. */
  lastIntent?: string;

  /** The stock/entity subject from the immediately preceding turn. */
  lastSubject?: string;
}

// ---------------------------------------------------------------------------
// Intent map
// ---------------------------------------------------------------------------

/**
 * Each entry maps an intent key → an array of keyword phrases.
 * Matching is case-insensitive; phrases are checked as substrings of the
 * normalized message. Order matters: more specific entries appear first.
 */
const INTENT_MAP: Array<{ intent: string; keywords: string[] }> = [
  // Stock-specific intents
  {
    intent: "reliance",
    keywords: ["reliance", "ril", "reliance industries"],
  },
  {
    intent: "tcs",
    keywords: ["tcs", "tata consultancy", "tata consulting"],
  },
  {
    intent: "infy",
    keywords: ["infy", "infosys", "infosys ltd"],
  },
  {
    intent: "hdfcbank",
    keywords: ["hdfcbank", "hdfc bank", "hdfc", "housing development finance"],
  },
  {
    intent: "nvda",
    keywords: ["nvda", "nvidia", "nvda stock"],
  },

  // Portfolio intents — risk before generic analysis to avoid mismatches
  {
    intent: "portfolio_risk",
    keywords: [
      "portfolio risk",
      "how risky",
      "risk in my portfolio",
      "portfolio volatility",
      "my portfolio risk",
      "risky is my portfolio",
      "assess risk",
    ],
  },
  {
    intent: "portfolio_analysis",
    keywords: [
      "my portfolio",
      "portfolio",
      "analyze portfolio",
      "analyse portfolio",
      "show portfolio",
      "portfolio analysis",
      "holdings",
      "my stocks",
      "my positions",
    ],
  },

  // Watchlist
  {
    intent: "watchlist",
    keywords: [
      "what should i watch",
      "what to watch",
      "watchlist",
      "watch list",
      "stocks to watch",
      "what to look at",
      "what to monitor",
      "suggestions",
      "recommend",
    ],
  },

  // Alert explanation
  {
    intent: "alert_explanation",
    keywords: [
      "why did you alert",
      "what triggered",
      "alert",
      "why alert",
      "what does the alert mean",
      "notification",
      "why did lynch alert",
    ],
  },

  // Self-description
  {
    intent: "what_is_lynch",
    keywords: [
      "what is lynch",
      "who is lynch",
      "what are you",
      "what can you do",
      "how do you work",
      "about lynch",
      "tell me about lynch",
    ],
  },

  // Investment Ideas (vs-equity-research-idea-generation skill)
  {
    intent: "investment_ideas",
    keywords: [
      "give me some investment ideas",
      "investment ideas",
      "investment idea",
      "what stocks look interesting",
      "stocks look interesting",
      "find some investment ideas",
      "find investment ideas",
      "what stocks should i research",
      "stocks should i research",
      "screen these stocks",
      "show me some opportunities",
      "stock opportunities",
      "screening ideas",
      "pitch me something",
      "stock screen",
    ],
  },
];

// ---------------------------------------------------------------------------
// Follow-up resolution keywords
// ---------------------------------------------------------------------------

/**
 * If the message is a bare follow-up (e.g. "why?", "explain", "more details"),
 * LYNCH re-uses the previous context rather than returning the fallback.
 */
const FOLLOW_UP_KEYWORDS = [
  "why",
  "why?",
  "explain",
  "more",
  "tell me more",
  "details",
  "elaborate",
  "how so",
  "what do you mean",
  "clarify",
  "go on",
  "and?",
  "so?",
  "really?",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Lowercase + collapse whitespace + trim. */
function normalize(message: string): string {
  return message.toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Returns true if the normalized message is a bare follow-up question
 * that should inherit context from the previous turn.
 */
function isFollowUp(normalized: string): boolean {
  return FOLLOW_UP_KEYWORDS.some(
    (kw) => normalized === kw || normalized.startsWith(kw + " ") || normalized.endsWith(" " + kw)
  );
}

/**
 * Walks the INTENT_MAP and returns the first matching intent key,
 * or null if nothing matches.
 */
function detectIntent(normalized: string): string | null {
  for (const { intent, keywords } of INTENT_MAP) {
    if (keywords.some((kw) => normalized.includes(kw))) {
      return intent;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * The result returned by getLynchResponse.
 * Extends the structured response with metadata useful to Chat.tsx.
 */
export interface LynchAgentResult {
  /** The fully structured response to render. */
  response: LynchResponse;

  /** The resolved intent key (useful for updating ConversationContext). */
  resolvedIntent: string;

  /** The subject entity resolved this turn (useful for updating ConversationContext). */
  resolvedSubject?: string;

  /**
   * True when the intent was resolved via follow-up context rather than
   * direct keyword match. Chat.tsx can use this to optionally show a small
   * "context from previous message" indicator.
   */
  usedContext: boolean;
}

/**
 * Core LYNCH response function.
 *
 * @param message - Raw user message string.
 * @param context - Optional context from the previous conversation turn.
 *                  The caller should persist and pass this back each turn.
 * @returns A LynchAgentResult containing the response and metadata for
 *          the caller to update its context with.
 *
 * @example
 * // Turn 1
 * const ctx: ConversationContext = {};
 * const r1 = getLynchResponse("Analyze Reliance", ctx);
 * Object.assign(ctx, { lastIntent: r1.resolvedIntent, lastSubject: r1.resolvedSubject });
 *
 * // Turn 2 — "Why?" inherits RELIANCE context
 * const r2 = getLynchResponse("Why?", ctx);
 */
export function getLynchResponse(
  message: string,
  context: ConversationContext = {}
): LynchAgentResult {
  const normalized = normalize(message);

  // ── Step 1: Direct intent detection ──────────────────────────────────────
  let resolvedIntent = detectIntent(normalized);
  let usedContext = false;

  // ── Step 2: Follow-up resolution ─────────────────────────────────────────
  // If we couldn't detect a fresh intent and the message looks like a
  // follow-up, inherit the last turn's intent.
  if (!resolvedIntent && isFollowUp(normalized) && context.lastIntent) {
    resolvedIntent = context.lastIntent;
    usedContext = true;
  }

  // ── Step 3: Fallback ─────────────────────────────────────────────────────
  if (!resolvedIntent) {
    resolvedIntent = "fallback";
  }

  // ── Step 4: Fetch structured response ────────────────────────────────────
  const response = getDemoResponse(resolvedIntent);

  // ── Step 4b: Emit alert/activity event for non-fallback intents ───────────
  if (resolvedIntent === "investment_ideas") {
    emitAgentEvent({
      icon: "insight",
      text: "LYNCH generated 3 new investment ideas via SkillPatch workflow",
    });
  } else if (resolvedIntent === "portfolio_analysis" || resolvedIntent === "portfolio_risk") {
    emitAgentEvent({
      icon: "risk",
      text: "LYNCH ran full portfolio risk & sector allocation audit",
    });
  } else if (response.analysis?.subject) {
    emitAgentEvent({
      icon: "alert",
      text: `LYNCH completed deep-dive research scan for ${response.analysis.subject}`,
    });
  }

  // ── Step 5: Derive the subject for context carry-forward ─────────────────
  // Prefer the subject embedded in the response's analysis block; otherwise
  // fall back to inheriting from the previous turn.
  const resolvedSubject =
    response.analysis?.subject ?? context.lastSubject;

  return {
    response,
    resolvedIntent,
    resolvedSubject,
    usedContext,
  };
}
