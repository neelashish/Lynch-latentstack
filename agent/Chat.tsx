"use client";

// ─────────────────────────────────────────────────────────────────────────────
// agent/Chat.tsx
//
// LYNCH chat UI — a self-contained, reusable React component.
//
// Intelligence:   delegated entirely to ./ai  (getLynchResponse)
// Data:           flows from ./demo-responses via ./ai
// Styling:        Tailwind CSS + Lucide React only
// Dependencies:   none outside agent/
// ─────────────────────────────────────────────────────────────────────────────

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  Send,
  User,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  ArrowRight,
  Shield,
} from "lucide-react";
import { getLynchResponse, ConversationContext } from "./ai";
import type { LynchResponse, LynchSignal, LynchRisk } from "./demo-responses";

// ─────────────────────────────────────────────────────────────────────────────
// Internal types
// ─────────────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: "user" | "lynch";
  text: string;
  response?: LynchResponse;
  usedContext?: boolean;
  timestamp: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ─────────────────────────────────────────────────────────────────────────────
// Signal badge
// ─────────────────────────────────────────────────────────────────────────────

const SIGNAL_CFG: Record<
  LynchSignal,
  { icon: React.ReactNode; cls: string }
> = {
  BUY: {
    icon: <TrendingUp size={10} />,
    cls: "text-emerald-400 bg-emerald-400/10 border-emerald-500/40",
  },
  HOLD: {
    icon: <Minus size={10} />,
    cls: "text-amber-400 bg-amber-400/10 border-amber-500/40",
  },
  WATCH: {
    icon: <Eye size={10} />,
    cls: "text-sky-400 bg-sky-400/10 border-sky-500/40",
  },
  REDUCE: {
    icon: <TrendingDown size={10} />,
    cls: "text-orange-400 bg-orange-400/10 border-orange-500/40",
  },
  AVOID: {
    icon: <AlertTriangle size={10} />,
    cls: "text-red-400 bg-red-400/10 border-red-500/40",
  },
};

function SignalBadge({ signal }: { signal: LynchSignal }) {
  const { icon, cls } = SIGNAL_CFG[signal];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full
        text-[10px] font-bold tracking-widest border ${cls}`}
    >
      {icon}
      {signal}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Risk badge
// ─────────────────────────────────────────────────────────────────────────────

const RISK_CLS: Record<LynchRisk, string> = {
  LOW: "text-emerald-400 bg-emerald-400/10 border-emerald-500/40",
  MODERATE: "text-amber-400 bg-amber-400/10 border-amber-500/40",
  HIGH: "text-orange-400 bg-orange-400/10 border-orange-500/40",
  "VERY HIGH": "text-red-400 bg-red-400/10 border-red-500/40",
};

function RiskBadge({ risk }: { risk: LynchRisk }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full
        text-[10px] font-semibold border ${RISK_CLS[risk]}`}
    >
      <Shield size={9} />
      {risk}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Confidence bar
// ─────────────────────────────────────────────────────────────────────────────

function ConfidenceBar({ value }: { value: number }) {
  const gradient =
    value >= 70
      ? "from-emerald-500 to-emerald-400"
      : value >= 50
      ? "from-amber-500 to-amber-400"
      : "from-orange-500 to-orange-400";

  return (
    <div className="flex items-center gap-2 mt-1.5">
      <span className="text-[10px] text-gray-600 w-18 shrink-0 font-medium">
        Confidence
      </span>
      <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[10px] font-bold text-gray-400 w-7 text-right tabular-nums">
        {value}%
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Analysis card — renders when response.analysis is present
// ─────────────────────────────────────────────────────────────────────────────

function AnalysisCard({
  analysis,
}: {
  analysis: NonNullable<LynchResponse["analysis"]>;
}) {
  return (
    <div className="mt-3 rounded-xl border border-gray-700/50 bg-gray-950/60 overflow-hidden text-left">
      {/* ── Card header: subject + price + badges ── */}
      <div className="px-3.5 py-2.5 border-b border-gray-700/40 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xs font-bold text-white tracking-wide">
              {analysis.subject}
            </span>
            {analysis.price && (
              <span className="text-xs font-semibold text-gray-300 tabular-nums">
                {analysis.price}
              </span>
            )}
            {analysis.change && (
              <span
                className={`text-[11px] font-semibold tabular-nums ${
                  analysis.change.startsWith("+")
                    ? "text-emerald-400"
                    : analysis.change.startsWith("-")
                    ? "text-red-400"
                    : "text-gray-400"
                }`}
              >
                {analysis.change}
              </span>
            )}
          </div>
          <ConfidenceBar value={analysis.confidence} />
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <SignalBadge signal={analysis.signal} />
          <RiskBadge risk={analysis.risk} />
        </div>
      </div>

      {/* ── Reasons ── */}
      <div className="px-3.5 py-2.5 border-b border-gray-700/40">
        <p className="text-[9px] uppercase tracking-widest text-gray-600 font-bold mb-2">
          Analysis
        </p>
        <ul className="space-y-1.5">
          {analysis.reasons.map((reason, i) => (
            <li
              key={i}
              className="flex items-start gap-1.5 text-[11px] text-gray-400 leading-relaxed"
            >
              <ChevronRight
                size={11}
                className="text-indigo-500 mt-0.5 shrink-0"
              />
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Suggested actions ── */}
      <div className="px-3.5 py-2.5">
        <p className="text-[9px] uppercase tracking-widest text-gray-600 font-bold mb-2">
          Suggested Actions
        </p>
        <ul className="space-y-1.5">
          {analysis.suggestedActions.map((action, i) => (
            <li
              key={i}
              className="flex items-start gap-1.5 text-[11px] text-gray-500 leading-relaxed"
            >
              <ArrowRight
                size={11}
                className="text-gray-700 mt-0.5 shrink-0"
              />
              {action}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ideas card — renders when response.ideasBlock is present (SkillPatch workflow)
// ─────────────────────────────────────────────────────────────────────────────

function IdeasCard({
  ideasBlock,
}: {
  ideasBlock: NonNullable<LynchResponse["ideasBlock"]>;
}) {
  return (
    <div className="mt-3 rounded-xl border border-indigo-500/30 bg-gray-950/80 overflow-hidden text-left space-y-3 p-3.5">
      {/* ── Header & Methodology ── */}
      <div className="pb-2 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-indigo-400 tracking-wider uppercase">
            LYNCH INVESTMENT IDEAS
          </span>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-medium">
            {ideasBlock.count} opportunities identified
          </span>
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">
          {ideasBlock.methodology}
        </p>
        <div className="mt-2 text-[9px] text-amber-400/90 font-mono bg-amber-500/10 border border-amber-500/20 rounded px-2 py-0.5 inline-block">
          {ideasBlock.disclaimer}
        </div>
      </div>

      {/* ── Individual Stock Cards ── */}
      <div className="space-y-3">
        {ideasBlock.ideas.map((idea, index) => (
          <div
            key={idea.symbol}
            className="rounded-lg border border-gray-800 bg-gray-900/60 p-3 hover:border-gray-700 transition-colors"
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-2 border-b border-gray-800/60 pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white">
                    {index + 1}. {idea.symbol}
                  </span>
                  <span className="text-[11px] text-gray-400">({idea.name})</span>
                </div>
                <div className="text-[10px] text-indigo-300 font-medium mt-0.5">
                  LYNCH VIEW: {idea.signal}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <SignalBadge signal={idea.signal} />
                <RiskBadge risk={idea.risk} />
              </div>
            </div>

            <ConfidenceBar value={idea.confidence} />

            {/* Thesis */}
            <div className="mt-2">
              <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">
                THESIS
              </p>
              <p className="text-[11px] text-gray-300 mt-0.5 leading-relaxed">
                {idea.thesis}
              </p>
            </div>

            {/* Why it stands out */}
            <div className="mt-2">
              <p className="text-[9px] uppercase tracking-widest text-emerald-400/80 font-bold">
                WHY IT STANDS OUT
              </p>
              <ul className="mt-1 space-y-1">
                {idea.standout.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-1 text-[11px] text-gray-300"
                  >
                    <span className="text-emerald-400 shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks */}
            <div className="mt-2">
              <p className="text-[9px] uppercase tracking-widest text-amber-400/80 font-bold">
                RISKS
              </p>
              <ul className="mt-1 space-y-1">
                {idea.risks.map((risk, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-1 text-[11px] text-gray-400"
                  >
                    <span className="text-amber-400 shrink-0">⚠</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* ── Research Priority ── */}
      <div className="pt-2 border-t border-gray-800">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1.5">
          RESEARCH PRIORITY
        </p>
        <div className="space-y-1">
          {ideasBlock.priorities.map((item, i) => (
            <div
              key={item.symbol}
              className="flex items-center justify-between text-[11px] text-gray-300 bg-gray-900/40 px-2.5 py-1 rounded border border-gray-800/50"
            >
              <span className="font-semibold text-white">
                {i + 1}. {item.symbol}
              </span>
              <span className="text-indigo-400 text-[10px]">
                {item.priorityLabel}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-1 text-center">
        <p className="text-[11px] text-indigo-300 italic font-medium">
          Ask LYNCH about any of these ideas.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Thinking indicator
// ─────────────────────────────────────────────────────────────────────────────

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-2.5">
      <LynchAvatar />
      <div className="flex items-center gap-2 bg-gray-900/50 border border-gray-700/40 rounded-2xl rounded-tl-sm px-3.5 py-2">
        <span className="text-[11px] text-gray-500">LYNCH is thinking</span>
        <span className="flex items-center gap-0.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1 h-1 bg-indigo-500/70 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 160}ms` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared avatar components
// ─────────────────────────────────────────────────────────────────────────────

function LynchAvatar() {
  return (
    <div className="h-7 w-7 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 self-start mt-5">
      <span className="text-[10px] font-black text-indigo-400 select-none">
        L
      </span>
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="h-7 w-7 rounded-full bg-gray-800/80 border border-gray-700/60 flex items-center justify-center shrink-0 self-end">
      <User size={12} className="text-gray-500" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Prompt chips
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_PROMPTS = [
  "What stocks look interesting?",
  "Analyze my portfolio",
  "Analyze RELIANCE",
  "What should I watch?",
  "Why did you alert me?",
];

function PromptChip({
  label,
  onClick,
  disabled,
  variant = "default",
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  variant?: "default" | "followup";
}) {
  const base =
    "px-2.5 py-1 rounded-full text-[11px] border transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const styles =
    variant === "followup"
      ? `${base} text-gray-400 bg-gray-800/50 border-gray-700/50
         hover:text-gray-200 hover:bg-gray-700/60 hover:border-gray-600/60`
      : `${base} text-indigo-300 bg-indigo-500/10 border-indigo-500/25
         hover:bg-indigo-500/20 hover:border-indigo-400/40`;

  return (
    <button onClick={onClick} disabled={disabled} className={styles}>
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Chat component
// ─────────────────────────────────────────────────────────────────────────────

export default function LynchChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [context, setContext] = useState<ConversationContext>({});
  // greeting is stable across renders — computed once on mount (client-only)
  const [greeting] = useState<string>(getGreeting);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasMessages = messages.length > 0;

  // Scroll to the latest message whenever the list or thinking state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // ── Core send handler ────────────────────────────────────────────────────
  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isThinking) return;

      // 1. Append user message immediately
      const userMsg: ChatMessage = {
        id: uid(),
        role: "user",
        text: trimmed,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsThinking(true);

      // 2. Simulate network/AI latency
      await new Promise<void>((resolve) =>
        setTimeout(resolve, 700 + Math.random() * 500)
      );

      // 3. Resolve intent and fetch structured response
      const result = getLynchResponse(trimmed, context);

      // 4. Update context for next turn
      setContext({
        lastIntent: result.resolvedIntent,
        lastSubject: result.resolvedSubject,
      });

      // 5. Append LYNCH response
      const lynchMsg: ChatMessage = {
        id: uid(),
        role: "lynch",
        text: result.response.message,
        response: result.response,
        usedContext: result.usedContext,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, lynchMsg]);
      setIsThinking(false);
    },
    [isThinking, context]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") void send(input);
  };

  const handleClear = () => {
    setMessages([]);
    setContext({});
    setInput("");
    inputRef.current?.focus();
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full min-h-0 bg-[#070a11] text-white antialiased">

      {/* ╔══════════════════════════════════════════════╗ */}
      {/* ║                  HEADER                      ║ */}
      {/* ╚══════════════════════════════════════════════╝ */}
      <header className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-800/70 bg-[#070a11]/95 backdrop-blur-md z-10">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-950/60 shrink-0">
            <Zap size={15} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white tracking-[0.12em] uppercase">
                LYNCH
              </span>
              {/* Live pulse indicator */}
              <span className="flex items-center gap-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">
                  Agent Active
                </span>
              </span>
            </div>
            <p className="text-[10px] text-gray-600 font-medium tracking-wide">
              AI Financial Intelligence
            </p>
          </div>
        </div>

        {/* Clear button — only visible when conversation has started */}
        {hasMessages && (
          <button
            onClick={handleClear}
            title="Clear conversation"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-gray-600
              hover:text-gray-300 hover:bg-gray-800/60 transition-colors"
          >
            <RotateCcw size={11} />
            Clear
          </button>
        )}
      </header>

      {/* ╔══════════════════════════════════════════════╗ */}
      {/* ║              MESSAGE AREA                    ║ */}
      {/* ╚══════════════════════════════════════════════╝ */}
      <main className="flex-1 overflow-y-auto px-4 py-5 space-y-5">

        {/* ── Greeting (always visible) ── */}
        <div className="flex items-start gap-2.5">
          <div className="h-7 w-7 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-[10px] font-black text-indigo-400 select-none">L</span>
          </div>
          <div className="max-w-[85%]">
            <p className="text-[10px] text-gray-600 mb-1 font-semibold tracking-wide">
              LYNCH
            </p>
            <div className="bg-gray-900/50 border border-gray-700/40 rounded-2xl rounded-tl-sm px-4 py-3">
              <p className="text-sm text-gray-200 leading-relaxed">
                {greeting}. I&apos;ve identified a few things worth your
                attention.
              </p>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                What would you like me to look into?
              </p>
            </div>
          </div>
        </div>

        {/* ── Initial suggested prompts (hidden once conversation starts) ── */}
        {!hasMessages && (
          <div className="pl-9">
            <p className="text-[9px] uppercase tracking-widest text-gray-700 font-bold mb-2">
              Suggested
            </p>
            <div className="flex flex-wrap gap-2">
              {INITIAL_PROMPTS.map((p) => (
                <PromptChip
                  key={p}
                  label={p}
                  onClick={() => void send(p)}
                  disabled={isThinking}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Conversation messages ── */}
        {messages.map((msg) =>
          msg.role === "user" ? (
            /* User message — right-aligned */
            <div key={msg.id} className="flex items-end gap-2.5 justify-end">
              <div className="max-w-[78%]">
                <p className="text-[10px] text-gray-600 mb-1 font-semibold tracking-wide text-right">
                  You
                </p>
                <div className="bg-indigo-600/15 border border-indigo-500/20 rounded-2xl rounded-tr-sm px-4 py-2.5">
                  <p className="text-sm text-indigo-100 leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              </div>
              <UserAvatar />
            </div>
          ) : (
            /* LYNCH message — left-aligned with optional analysis card */
            <div key={msg.id} className="flex items-start gap-2.5">
              <LynchAvatar />
              <div className="max-w-[85%]">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[10px] text-gray-600 font-semibold tracking-wide">
                    LYNCH
                  </p>
                  {msg.usedContext && (
                    <span className="text-[9px] text-gray-700 italic">
                      continuing context
                    </span>
                  )}
                </div>

                <div className="bg-gray-900/50 border border-gray-700/40 rounded-2xl rounded-tl-sm px-4 py-3">
                  {/* Prose response */}
                  <p className="text-sm text-gray-200 leading-relaxed">
                    {msg.text}
                  </p>

                  {/* Structured analysis card */}
                  {msg.response?.analysis && (
                    <AnalysisCard analysis={msg.response.analysis} />
                  )}

                  {/* Structured investment ideas card (SkillPatch workflow) */}
                  {msg.response?.ideasBlock && (
                    <IdeasCard ideasBlock={msg.response.ideasBlock} />
                  )}

                  {/* Follow-up prompt chips */}
                  {msg.response?.followUps &&
                    msg.response.followUps.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-700/30">
                        {msg.response.followUps.map((fu) => (
                          <PromptChip
                            key={fu}
                            label={fu}
                            onClick={() => void send(fu)}
                            disabled={isThinking}
                            variant="followup"
                          />
                        ))}
                      </div>
                    )}
                </div>
              </div>
            </div>
          )
        )}

        {/* ── Thinking indicator ── */}
        {isThinking && <ThinkingIndicator />}

        {/* Invisible anchor — scroll target */}
        <div ref={messagesEndRef} />
      </main>

      {/* ╔══════════════════════════════════════════════╗ */}
      {/* ║                DISCLAIMER                    ║ */}
      {/* ╚══════════════════════════════════════════════╝ */}
      <div className="shrink-0 px-4 py-1 border-t border-gray-800/40">
        <p className="text-center text-[9px] text-gray-800 tracking-wide">
          Demo only · All data fictional · Not financial advice
        </p>
      </div>

      {/* ╔══════════════════════════════════════════════╗ */}
      {/* ║                INPUT AREA                    ║ */}
      {/* ╚══════════════════════════════════════════════╝ */}
      <footer className="shrink-0 px-4 pb-4 pt-2 bg-[#070a11]/90 backdrop-blur-sm">
        <div
          className="flex items-center gap-2 bg-gray-900/60 border border-gray-700/50 rounded-2xl
            px-3.5 py-2 focus-within:border-indigo-500/50 focus-within:ring-1
            focus-within:ring-indigo-500/15 transition-all duration-200"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask LYNCH anything…"
            disabled={isThinking}
            className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-700
              outline-none disabled:opacity-50 min-w-0"
            autoComplete="off"
            spellCheck="false"
          />
          <button
            onClick={() => void send(input)}
            disabled={!input.trim() || isThinking}
            aria-label="Send message"
            className="h-7 w-7 rounded-xl flex items-center justify-center shrink-0
              bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800
              text-white disabled:text-gray-700 transition-colors duration-150"
          >
            <Send size={12} strokeWidth={2.5} />
          </button>
        </div>
      </footer>
    </div>
  );
}
