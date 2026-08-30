// ─────────────────────────────────────────────────────────────────────────────
// app/portfolio/types.ts
//
// Self-contained TypeScript definitions for the LYNCH Portfolio Feature.
// ─────────────────────────────────────────────────────────────────────────────

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface Holding {
  symbol: string;
  name: string;
  sector: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  allocationPct: number;
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
  isConnected: boolean;
  connectedBroker?: string;
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

export type ConnectorBroker = "Zerodha" | "Groww" | "Upstox" | "CoinDCX" | "Manual Entry";
