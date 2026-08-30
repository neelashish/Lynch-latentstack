// ─────────────────────────────────────────────────────────────────────────────
// ui/data/portfolio.ts
//
// Centralized portfolio dataset and deterministic analysis functions.
// Built on top of DEMO_PORTFOLIO & DEMO_WATCHLIST from ui/data/demo.ts.
// All values are static demo data for hackathon prototype testing.
// ─────────────────────────────────────────────────────────────────────────────

import { DEMO_PORTFOLIO, RiskLevel } from "./demo";

export interface Holding {
  symbol: string;
  name: string;
  sector: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  allocationPct: number; // e.g. 32 for 32%
  risk: RiskLevel;
}

export interface PortfolioSummary {
  totalValue: number;
  todayChangeAbs: number;
  todayChangePct: number;
  totalReturnAbs: number;
  totalReturnPct: number;
  overallRisk: "Low" | "Moderate" | "High";
  holdingsCount: number;
}

export interface SectorAllocation {
  sector: string;
  allocationPct: number;
  value: number;
}

export interface RiskRuleCheck {
  id: string;
  type: "warning" | "success" | "info";
  title: string;
  description: string;
}

export interface PerformancePoint {
  date: string;
  value: number;
}

// ---------------------------------------------------------------------------
// Demo Holdings Dataset (6 Holdings totaling ₹12,45,000)
// ---------------------------------------------------------------------------

export const DEMO_HOLDINGS: Holding[] = [
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

// ---------------------------------------------------------------------------
// Demo Historical Performance Series (Static 6-Month Trend)
// ---------------------------------------------------------------------------

export const DEMO_PERFORMANCE_SERIES: PerformancePoint[] = [
  { date: "Oct", value: 1080000 },
  { date: "Nov", value: 1120000 },
  { date: "Dec", value: 1090000 },
  { date: "Jan", value: 1150000 },
  { date: "Feb", value: 1180000 },
  { date: "Mar", value: 1245000 },
];

// ---------------------------------------------------------------------------
// Deterministic Calculation Helpers
// ---------------------------------------------------------------------------

/** Compute total value from holdings or fallback to DEMO_PORTFOLIO */
export function getPortfolioSummary(): PortfolioSummary {
  const totalValue = 1245000; // ₹12,45,000 standard demo baseline
  const todayChangeAbs = 15238; // +1.24% today
  const todayChangePct = 1.24;
  const totalReturnAbs = 96800; // +8.42% overall
  const totalReturnPct = DEMO_PORTFOLIO.totalReturnPct || 8.42;

  return {
    totalValue,
    todayChangeAbs,
    todayChangePct,
    totalReturnAbs,
    totalReturnPct,
    overallRisk: "Moderate",
    holdingsCount: DEMO_HOLDINGS.length,
  };
}

/** Compute sector allocation breakdown from holdings */
export function getSectorAllocations(): SectorAllocation[] {
  const map: Record<string, number> = {};
  DEMO_HOLDINGS.forEach((h) => {
    map[h.sector] = (map[h.sector] || 0) + h.allocationPct;
  });

  const summary = getPortfolioSummary();
  return Object.entries(map)
    .map(([sector, pct]) => ({
      sector,
      allocationPct: pct,
      value: Math.round((summary.totalValue * pct) / 100),
    }))
    .sort((a, b) => b.allocationPct - a.allocationPct);
}

/**
 * Deterministic Risk Analysis Rules:
 * Rule 1: Single stock concentration > 30% -> High Concentration Warning
 * Rule 2: Single sector concentration > 40% -> Sector Exposure Warning
 * Rule 3: Holdings >= 5 -> Broad Holdings Check Passed
 * Rule 4: Largest holding identification
 */
export function getDeterministicRiskRules(): {
  overallRisk: "LOW" | "MODERATE" | "HIGH";
  largestHolding: Holding;
  rules: RiskRuleCheck[];
  insights: string[];
} {
  const largestHolding = [...DEMO_HOLDINGS].sort(
    (a, b) => b.allocationPct - a.allocationPct
  )[0];

  const rules: RiskRuleCheck[] = [];
  const insights: string[] = [];

  // 1. Single Holding Concentration Threshold Check (Rule: > 30%)
  if (largestHolding.allocationPct > 30) {
    rules.push({
      id: "rule-single-concentration",
      type: "warning",
      title: `High concentration in ${largestHolding.symbol}`,
      description: `${largestHolding.symbol} represents ${largestHolding.allocationPct}% of total portfolio value (Threshold: 30%).`,
    });
    insights.push(`${largestHolding.symbol} is the largest portfolio exposure (${largestHolding.allocationPct}%).`);
  } else {
    rules.push({
      id: "rule-single-concentration",
      type: "success",
      title: "Balanced single-stock allocation",
      description: "No single holding exceeds the 30% concentration threshold.",
    });
  }

  // 2. Sector Concentration Check
  const sectors = getSectorAllocations();
  const techSector = sectors.find((s) => s.sector === "Technology");
  if (techSector && techSector.allocationPct >= 40) {
    rules.push({
      id: "rule-sector-tech",
      type: "warning",
      title: "Technology exposure is significant",
      description: `Technology sector accounts for ${techSector.allocationPct}% of portfolio (TCS + INFY).`,
    });
    insights.push(`Technology sector exposure is significant at ${techSector.allocationPct}% of equity value.`);
  } else if (sectors[0] && sectors[0].allocationPct > 35) {
    rules.push({
      id: "rule-sector-top",
      type: "warning",
      title: `Concentrated sector exposure in ${sectors[0].sector}`,
      description: `${sectors[0].sector} sector accounts for ${sectors[0].allocationPct}% of portfolio.`,
    });
    insights.push(`Significant exposure to ${sectors[0].sector} (${sectors[0].allocationPct}%).`);
  }

  // 3. Diversification / Holdings Count Check
  if (DEMO_HOLDINGS.length >= 5) {
    rules.push({
      id: "rule-holdings-count",
      type: "success",
      title: "Portfolio contains multiple holdings",
      description: `Diversified across ${DEMO_HOLDINGS.length} active positions in 4 sectors.`,
    });
  } else {
    rules.push({
      id: "rule-holdings-count",
      type: "warning",
      title: "Low holding diversity",
      description: "Portfolio contains fewer than 5 active positions.",
    });
  }

  // General Portfolio Insights
  insights.push("Overall portfolio concentration risk is MODERATE.");
  insights.push("Consider researching financial or consumer sector diversification opportunities.");

  return {
    overallRisk: "MODERATE",
    largestHolding,
    rules,
    insights,
  };
}
