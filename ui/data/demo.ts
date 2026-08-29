// ─────────────────────────────────────────────────────────────────────────────
// ui/data/demo.ts
//
// Centralized demo data for LYNCH UI components.
// All fictional data for hackathon prototype purposes only.
//
// ⚠️  Replace with real API data during production integration.
// ─────────────────────────────────────────────────────────────────────────────

// ---------------------------------------------------------------------------
// Types — exported so all UI components share the same shape
// ---------------------------------------------------------------------------

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type LynchView = "BUY" | "HOLD" | "WATCH" | "REDUCE" | "AVOID";
export type AgentStatus = "active" | "idle" | "analyzing";

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number; // percent, e.g. +1.82 or -0.42
  risk?: RiskLevel;
  view?: LynchView;
}

export interface InsightData {
  symbol: string;
  name: string;
  signal: LynchView;
  risk: RiskLevel;
  insight: string;
  confidence: number;
}

export interface PortfolioData {
  value: number;           // ₹ total value
  todayReturn: number;     // ₹ absolute change today
  totalReturnPct: number;  // % total return
  riskLevel: "Low" | "Moderate" | "High";
  sparkline: number[];     // mini chart data points (normalized)
}

export interface ActivityItem {
  id: string;
  icon: "risk" | "alert" | "insight";
  text: string;
  time: string;
}

export interface StockDetail {
  symbol: string;
  name: string;
  price: number;
  change: number;
  chartData: number[];
  signal: LynchView;
  confidence: number;
  risk: RiskLevel;
  reasons: Array<{ type: "positive" | "warning"; text: string }>;
  metrics: Array<{ label: string; value: string }>;
}

// ---------------------------------------------------------------------------
// Demo Data
// ---------------------------------------------------------------------------

export const DEMO_PORTFOLIO: PortfolioData = {
  value: 124500,
  todayReturn: 2840,
  totalReturnPct: 8.42,
  riskLevel: "Moderate",
  sparkline: [108, 112, 109, 115, 113, 118, 116, 120, 119, 124.5],
};

export const DEMO_WATCHLIST: Stock[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    price: 1421.3,
    change: 1.82,
    risk: "MEDIUM",
    view: "HOLD",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    price: 3845.2,
    change: 0.94,
    risk: "LOW",
    view: "BUY",
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd",
    price: 1520.4,
    change: -0.42,
    risk: "LOW",
    view: "WATCH",
  },
  {
    symbol: "HDFC",
    name: "HDFC Bank Ltd",
    price: 1650.2,
    change: 0.72,
    risk: "LOW",
    view: "BUY",
  },
];

export const DEMO_INSIGHTS: InsightData[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    signal: "HOLD",
    risk: "MEDIUM",
    insight: "Short-term volatility has increased. Monitor support at ₹1,380.",
    confidence: 74,
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    signal: "BUY",
    risk: "LOW",
    insight: "Strong demand momentum and stable fundamentals. Accumulate on dips.",
    confidence: 84,
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd",
    signal: "WATCH",
    risk: "LOW",
    insight: "Range-bound near resistance. Wait for breakout confirmation.",
    confidence: 62,
  },
];

export const DEMO_ACTIVITY: ActivityItem[] = [
  {
    id: "act-1",
    icon: "risk",
    text: "Portfolio risk increased to Moderate",
    time: "2 min ago",
  },
  {
    id: "act-2",
    icon: "alert",
    text: "RELIANCE crossed watch threshold at ₹1,400",
    time: "14 min ago",
  },
  {
    id: "act-3",
    icon: "insight",
    text: "LYNCH generated 3 new insights",
    time: "1 hr ago",
  },
];

export const DEMO_AGENT_STATUS: {
  status: AgentStatus;
  statusLines: string[];
} = {
  status: "active",
  statusLines: [
    "Monitoring portfolio",
    "Analyzing market scenarios",
  ],
};

// ---------------------------------------------------------------------------
// Stock Detail — RELIANCE (default demo for StockPage)
// ---------------------------------------------------------------------------

export const DEMO_RELIANCE: StockDetail = {
  symbol: "RELIANCE",
  name: "Reliance Industries Ltd",
  price: 1421.3,
  change: 1.82,
  chartData: [1320, 1340, 1330, 1360, 1350, 1380, 1375, 1390, 1405, 1421],
  signal: "HOLD",
  confidence: 74,
  risk: "MEDIUM",
  reasons: [
    { type: "positive", text: "Positive price momentum over 30 days" },
    { type: "positive", text: "Strong balance sheet and free cash flow" },
    { type: "warning", text: "Elevated short-term volatility (ATR high)" },
    { type: "warning", text: "Sector rotation pressure from global macro" },
  ],
  metrics: [
    { label: "P/E", value: "24.3x" },
    { label: "ROE", value: "14.8%" },
    { label: "52W High", value: "₹1,589" },
    { label: "52W Low", value: "₹1,120" },
    { label: "Mkt Cap", value: "₹19.2T" },
    { label: "Div Yield", value: "0.38%" },
  ],
};
