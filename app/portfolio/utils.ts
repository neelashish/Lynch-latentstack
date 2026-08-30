// ─────────────────────────────────────────────────────────────────────────────
// app/portfolio/utils.ts
//
// Pure deterministic analysis calculations for portfolio metrics, sectors, and risk rules.
// ─────────────────────────────────────────────────────────────────────────────

import { Holding, PortfolioSummary, SectorAllocation, RiskRuleCheck } from "./types";

/** Compute portfolio metrics deterministically from active holdings */
export function calculatePortfolioSummary(
  holdings: Holding[],
  isConnected = true,
  connectedBroker = "Zerodha (Demo)"
): PortfolioSummary {
  const totalValue = holdings.reduce((sum, h) => sum + h.quantity * h.currentPrice, 0);
  const totalCost = holdings.reduce((sum, h) => sum + h.quantity * h.avgPrice, 0);
  const totalReturnAbs = totalValue - totalCost;
  const totalReturnPct = totalCost > 0 ? (totalReturnAbs / totalCost) * 100 : 0;

  // Today's change fixed estimate for demo
  const todayChangeAbs = Math.round(totalValue * 0.0124); // +1.24%
  const todayChangePct = 1.24;

  // Risk Level rule: If any stock allocation > 30%, Moderate/High
  const maxAlloc = holdings.length > 0 ? Math.max(...holdings.map((h) => h.allocationPct)) : 0;
  const overallRisk: "Low" | "Moderate" | "High" =
    maxAlloc > 35 ? "High" : maxAlloc > 25 ? "Moderate" : "Low";

  return {
    totalValue,
    todayChangeAbs,
    todayChangePct,
    totalReturnAbs,
    totalReturnPct,
    overallRisk,
    holdingsCount: holdings.length,
    isConnected,
    connectedBroker,
  };
}

/** Recalculate allocation percentages for holdings */
export function recalculateAllocations(holdings: Holding[]): Holding[] {
  const totalVal = holdings.reduce((sum, h) => sum + h.quantity * h.currentPrice, 0);
  if (totalVal === 0) return holdings;

  return holdings.map((h) => ({
    ...h,
    allocationPct: Math.round(((h.quantity * h.currentPrice) / totalVal) * 100),
  }));
}

/** Sector allocation breakdown */
export function getSectorAllocations(holdings: Holding[]): SectorAllocation[] {
  const map: Record<string, number> = {};
  const totalVal = holdings.reduce((sum, h) => sum + h.quantity * h.currentPrice, 0);

  holdings.forEach((h) => {
    const val = h.quantity * h.currentPrice;
    map[h.sector] = (map[h.sector] || 0) + val;
  });

  return Object.entries(map)
    .map(([sector, val]) => ({
      sector,
      value: val,
      allocationPct: totalVal > 0 ? Math.round((val / totalVal) * 100) : 0,
    }))
    .sort((a, b) => b.allocationPct - a.allocationPct);
}

/** Deterministic Risk Engine */
export function evaluatePortfolioRisk(holdings: Holding[]): {
  overallRisk: "LOW" | "MODERATE" | "HIGH";
  rules: RiskRuleCheck[];
  insights: string[];
} {
  if (holdings.length === 0) {
    return {
      overallRisk: "LOW",
      rules: [
        {
          id: "rule-empty",
          type: "info",
          title: "No Holdings",
          description: "Connect or add holdings to evaluate risk.",
        },
      ],
      insights: ["No active positions detected."],
    };
  }

  const sortedHoldings = [...holdings].sort((a, b) => b.allocationPct - a.allocationPct);
  const largestHolding = sortedHoldings[0];
  const rules: RiskRuleCheck[] = [];
  const insights: string[] = [];

  // Rule 1: Single stock threshold > 30% -> HIGH CONCENTRATION
  if (largestHolding.allocationPct > 30) {
    rules.push({
      id: "rule-single-concentration",
      type: "warning",
      title: `HIGH CONCENTRATION IN ${largestHolding.symbol}`,
      description: `${largestHolding.symbol} represents ${largestHolding.allocationPct}% of total portfolio value (Threshold: > 30%).`,
    });
    insights.push(`${largestHolding.symbol} is the largest portfolio exposure (${largestHolding.allocationPct}%).`);
  } else {
    rules.push({
      id: "rule-single-concentration",
      type: "success",
      title: "Balanced Holding Concentration",
      description: "No single holding exceeds the 30% concentration risk threshold.",
    });
  }

  // Rule 2: Sector Concentration
  const sectors = getSectorAllocations(holdings);
  const techSector = sectors.find((s) => s.sector.toLowerCase().includes("tech"));
  if (techSector && techSector.allocationPct >= 40) {
    rules.push({
      id: "rule-sector-tech",
      type: "warning",
      title: "Significant Tech Exposure",
      description: `Technology sector represents ${techSector.allocationPct}% of equity value.`,
    });
    insights.push(`Technology sector exposure is significant at ${techSector.allocationPct}% of portfolio.`);
  }

  // Rule 3: Diversification Assessment
  if (holdings.length >= 5) {
    rules.push({
      id: "rule-diversification",
      type: "success",
      title: "Diversified Portfolio Base",
      description: `Portfolio is spread across ${holdings.length} distinct holdings in ${sectors.length} sectors.`,
    });
  } else {
    rules.push({
      id: "rule-diversification",
      type: "warning",
      title: "Concentrated Holding Count",
      description: "Portfolio contains fewer than 5 active positions.",
    });
  }

  insights.push("Overall portfolio concentration risk is MODERATE.");
  insights.push("Consider researching diversification opportunities into financials or consumer sectors.");

  return {
    overallRisk: largestHolding.allocationPct > 30 ? "MODERATE" : "LOW",
    rules,
    insights,
  };
}
