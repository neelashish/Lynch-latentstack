// ─────────────────────────────────────────────────────────────────────────────
// app/portfolio/data/demo-data.ts
//
// Shared central dataset for the LYNCH Portfolio Feature.
// Safe for hydration (fixed initial constants, no Math.random/Date.now during render).
// ─────────────────────────────────────────────────────────────────────────────

import { Holding, PerformancePoint } from "../types";

export const INITIAL_DEMO_HOLDINGS: Holding[] = [
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    sector: "Technology",
    quantity: 104,
    avgPrice: 3550.0,
    currentPrice: 3845.2,
    allocationPct: 32,
    risk: "LOW",
  },
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    sector: "Energy & Conglomerates",
    quantity: 210,
    avgPrice: 1320.0,
    currentPrice: 1421.3,
    allocationPct: 24,
    risk: "MEDIUM",
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd",
    sector: "Technology",
    quantity: 147,
    avgPrice: 1450.0,
    currentPrice: 1520.4,
    allocationPct: 18,
    risk: "LOW",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    sector: "Financials",
    quantity: 105,
    avgPrice: 1540.0,
    currentPrice: 1650.2,
    allocationPct: 14,
    risk: "LOW",
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd",
    sector: "Financials",
    quantity: 80,
    avgPrice: 1010.0,
    currentPrice: 1085.0,
    allocationPct: 7,
    risk: "LOW",
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel Ltd",
    sector: "Telecom",
    quantity: 50,
    avgPrice: 1150.0,
    currentPrice: 1245.0,
    allocationPct: 5,
    risk: "MEDIUM",
  },
];

export const DEMO_PERFORMANCE_SERIES: PerformancePoint[] = [
  { date: "Oct", value: 1080000 },
  { date: "Nov", value: 1120000 },
  { date: "Dec", value: 1090000 },
  { date: "Jan", value: 1150000 },
  { date: "Feb", value: 1180000 },
  { date: "Mar", value: 1245000 },
];
