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
  // ── 0. Comparisons & Portfolio Context (Higher Priority) ─────────────────
  {
    intent: "compare_tcs_vs_infy",
    keywords: [
      "compare tcs and infy",
      "compare tcs and infosys",
      "tcs vs infy",
      "tcs vs infosys",
      "which is better tcs or infy",
      "which is better fundamentally tcs or infy",
    ],
  },
  {
    intent: "compare_hdfcbank_vs_icicibank",
    keywords: [
      "compare hdfc and icici",
      "compare hdfcbank and icicibank",
      "hdfc vs icici",
      "hdfcbank vs icicibank",
      "which bank is better hdfc or icici",
    ],
  },
  {
    intent: "portfolio_context_tcs",
    keywords: [
      "how does tcs affect my portfolio",
      "why tcs in my portfolio",
      "tcs impact on portfolio",
      "tcs affect my portfolio",
    ],
  },
  {
    intent: "portfolio_context_reliance",
    keywords: [
      "how does reliance affect my portfolio",
      "reliance impact on portfolio",
      "reliance affect my portfolio",
    ],
  },
  {
    intent: "sector_research",
    keywords: [
      "which sectors look interesting",
      "which sector has the strongest fundamentals",
      "sector research",
      "sector analysis",
      "industry research",
    ],
  },

  // ── 1. Greeting ─────────────────────────────────────────────────────────
  {
    intent: "greeting",
    keywords: [
      "hello",
      "hi",
      "hey",
      "good morning",
      "good evening",
      "hello lynch",
      "hi lynch",
      "hey lynch",
      "greetings",
    ],
  },

  // ── 2. Stock-specific intents ───────────────────────────────────────────
  {
    intent: "reliance",
    keywords: ["reliance", "ril", "reliance industries", "tell me about reliance", "analyze reliance", "analyse reliance"],
  },
  {
    intent: "tcs",
    keywords: ["tcs", "tata consultancy", "tata consulting", "tell me about tcs", "analyze tcs", "analyse tcs"],
  },
  {
    intent: "infy",
    keywords: ["infy", "infosys", "infosys ltd", "tell me about infy", "tell me about infosys", "analyze infy", "analyse infy"],
  },
  {
    intent: "hdfcbank",
    keywords: ["hdfcbank", "hdfc bank", "hdfc", "housing development finance", "tell me about hdfc", "analyze hdfc", "analyse hdfc"],
  },
  {
    intent: "icicibank",
    keywords: ["icicibank", "icici bank", "icici", "tell me about icici", "analyze icici", "analyse icici"],
  },
  {
    intent: "bhartiartl",
    keywords: ["bhartiartl", "bharti airtel", "airtel", "bharti", "tell me about airtel", "analyze airtel", "analyse airtel"],
  },
  {
    intent: "tatamotors",
    keywords: ["tatamotors", "tata motors", "tell me about tata motors", "analyze tata motors", "analyse tata motors"],
  },
  {
    intent: "lt",
    keywords: ["larsen", "l&t", "larsen & toubro", "tell me about l&t", "analyze l&t", "analyse l&t"],
  },
  {
    intent: "sunpharma",
    keywords: ["sunpharma", "sun pharma", "sun pharmaceutical", "tell me about sun pharma", "analyze sun pharma"],
  },
  {
    intent: "itc",
    keywords: ["itc", "itc ltd", "tell me about itc", "analyze itc", "analyse itc"],
  },
  {
    intent: "ntpc",
    keywords: ["ntpc", "ntpc ltd", "tell me about ntpc", "analyze ntpc", "analyse ntpc"],
  },
  {
    intent: "maruti",
    keywords: ["maruti", "maruti suzuki", "suzuki", "tell me about maruti", "analyze maruti"],
  },

  // ── 2. Portfolio intents ────────────────────────────────────────────────
  {
    intent: "portfolio_risk",
    keywords: [
      "portfolio risk",
      "how risky is my portfolio",
      "how risky",
      "risk in my portfolio",
      "portfolio volatility",
      "my portfolio risk",
      "assess risk",
    ],
  },
  {
    intent: "portfolio_analysis",
    keywords: [
      "show me my portfolio",
      "show my portfolio",
      "what's in my portfolio",
      "whats in my portfolio",
      "show my holdings",
      "what stocks do i own",
      "my holdings",
      "my portfolio",
      "portfolio",
      "analyze portfolio",
      "analyse portfolio",
      "portfolio analysis",
      "my stocks",
      "my positions",
      "how is my portfolio doing",
      "how is my portfolio performing",
      "what's the status of my portfolio",
      "whats the status of my portfolio",
      "is my portfolio doing well",
    ],
  },

  // ── 3. General Risks ────────────────────────────────────────────────────
  {
    intent: "general_risks",
    keywords: [
      "what are the risks",
      "what risks should i know about",
      "what could go wrong",
      "risks",
      "risk factors",
      "what are the risks of",
    ],
  },

  // ── 4. Watchlist ────────────────────────────────────────────────────────
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

  // ── 5. Alert explanation ────────────────────────────────────────────────
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

  // ── 6. Self-description ─────────────────────────────────────────────────
  {
    intent: "what_is_lynch",
    keywords: [
      "what is lynch",
      "who is lynch",
      "what are you",
      "what can you do",
      "how can you help me",
      "tell me about yourself",
      "how do you work",
      "about lynch",
      "tell me about lynch",
    ],
  },

  // ── 7. Investment Ideas (vs-equity-research-idea-generation skill) ───────
  {
    intent: "investment_ideas",
    keywords: [
      "what stocks look interesting",
      "give me some investment ideas",
      "give me investment ideas",
      "which stocks should i research",
      "what stocks should i research",
      "find some investment opportunities",
      "show me some opportunities",
      "what companies should i look at",
      "what stocks should i look at",
      "which companies are interesting",
      "show me opportunities",
      "what should i research",
      "investment ideas",
      "investment idea",
      "stocks look interesting",
      "find some investment ideas",
      "find investment ideas",
      "screen these stocks",
      "stock opportunities",
      "screening ideas",
      "pitch me something",
      "stock screen",
    ],
  },

  // ── 8. Out of scope queries ─────────────────────────────────────────────
  {
    intent: "out_of_scope",
    keywords: [
      "weather",
      "temperature",
      "rain",
      "joke",
      "funny",
      "football",
      "soccer",
      "match",
      "game",
      "sports",
      "movie",
      "recipe",
      "food",
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
