// ─────────────────────────────────────────────────────────────────────────────
// agent/analysis-engine.ts
//
// LYNCH Deterministic Financial Research Engine.
// Converts raw stock profiles and portfolio metrics into rich equity research,
// comparative tables, portfolio vs stock risk insights, and sector views.
// ─────────────────────────────────────────────────────────────────────────────

import {
  DEMO_STOCK_UNIVERSE,
  StockResearchProfile,
  SignalType,
  RiskLevel,
} from "./research-data";

export interface StockComparisonResult {
  stockA: StockResearchProfile;
  stockB: StockResearchProfile;
  winner: "stockA" | "stockB" | "tie";
  winnerSymbol: string;
  advantagesA: string[];
  advantagesB: string[];
  verdict: string;
}

export interface PortfolioContextAnalysis {
  stock: StockResearchProfile;
  holdingWeightPct: number;
  isLargestPosition: boolean;
  portfolioRiskImpact: string;
  lynchRecommendation: string;
}

export interface SectorResearchSummary {
  sector: string;
  growthProfile: string;
  valuationAssessment: string;
  riskLevel: RiskLevel;
  topStock: string;
  keyDrivers: string[];
}

/**
 * Retrieves a stock profile by ticker or alias name safely.
 */
export function getStockProfile(query: string): StockResearchProfile | null {
  const norm = query.toUpperCase().trim();
  if (DEMO_STOCK_UNIVERSE[norm]) return DEMO_STOCK_UNIVERSE[norm];

  // Alias lookup
  if (norm.includes("RELIANCE") || norm.includes("RIL")) return DEMO_STOCK_UNIVERSE.RELIANCE;
  if (norm.includes("TCS") || norm.includes("TATA CONSULTANCY")) return DEMO_STOCK_UNIVERSE.TCS;
  if (norm.includes("INFY") || norm.includes("INFOSYS")) return DEMO_STOCK_UNIVERSE.INFY;
  if (norm.includes("HDFC") || norm.includes("HDFCBANK")) return DEMO_STOCK_UNIVERSE.HDFCBANK;
  if (norm.includes("ICICI") || norm.includes("ICICIBANK")) return DEMO_STOCK_UNIVERSE.ICICIBANK;
  if (norm.includes("BHARTI") || norm.includes("AIRTEL")) return DEMO_STOCK_UNIVERSE.BHARTIARTL;
  if (norm.includes("TATA MOTORS") || norm.includes("TATAMOTORS")) return DEMO_STOCK_UNIVERSE.TATAMOTORS;
  if (norm.includes("LT") || norm.includes("LARSEN")) return DEMO_STOCK_UNIVERSE.LT;
  if (norm.includes("SUN") || norm.includes("SUNPHARMA")) return DEMO_STOCK_UNIVERSE.SUNPHARMA;
  if (norm.includes("ITC")) return DEMO_STOCK_UNIVERSE.ITC;
  if (norm.includes("NTPC")) return DEMO_STOCK_UNIVERSE.NTPC;
  if (norm.includes("MARUTI") || norm.includes("SUZUKI")) return DEMO_STOCK_UNIVERSE.MARUTI;

  return null;
}

/**
 * Deterministically compares two stocks from the universe.
 */
export function compareStocks(symbolA: string, symbolB: string): StockComparisonResult | null {
  const stockA = getStockProfile(symbolA);
  const stockB = getStockProfile(symbolB);

  if (!stockA || !stockB) return null;

  const advantagesA: string[] = [];
  const advantagesB: string[] = [];

  // Fundamentals
  if (stockA.fundamentals.roe > stockB.fundamentals.roe) {
    advantagesA.push(`Superior ROE (${stockA.fundamentals.roe}% vs ${stockB.fundamentals.roe}%)`);
  } else if (stockB.fundamentals.roe > stockA.fundamentals.roe) {
    advantagesB.push(`Superior ROE (${stockB.fundamentals.roe}% vs ${stockA.fundamentals.roe}%)`);
  }

  if (stockA.fundamentals.roce > stockB.fundamentals.roce) {
    advantagesA.push(`Higher capital efficiency ROCE (${stockA.fundamentals.roce}% vs ${stockB.fundamentals.roce}%)`);
  } else if (stockB.fundamentals.roce > stockA.fundamentals.roce) {
    advantagesB.push(`Higher capital efficiency ROCE (${stockB.fundamentals.roce}% vs ${stockA.fundamentals.roce}%)`);
  }

  // Valuation
  if (stockA.valuation.pe < stockB.valuation.pe && stockA.valuation.pe > 0) {
    advantagesA.push(`More attractive P/E valuation (${stockA.valuation.pe}x vs ${stockB.valuation.pe}x)`);
  } else if (stockB.valuation.pe < stockA.valuation.pe && stockB.valuation.pe > 0) {
    advantagesB.push(`More attractive P/E valuation (${stockB.valuation.pe}x vs ${stockA.valuation.pe}x)`);
  }

  // Research Score
  if (stockA.researchScore > stockB.researchScore) {
    advantagesA.push(`Higher overall LYNCH Research Score (${stockA.researchScore} vs ${stockB.researchScore})`);
  } else if (stockB.researchScore > stockA.researchScore) {
    advantagesB.push(`Higher overall LYNCH Research Score (${stockB.researchScore} vs ${stockA.researchScore})`);
  }

  // Balance sheet
  if (stockA.fundamentals.debtToEquity < stockB.fundamentals.debtToEquity) {
    advantagesA.push(`Lower financial leverage (D/E: ${stockA.fundamentals.debtToEquity} vs ${stockB.fundamentals.debtToEquity})`);
  } else if (stockB.fundamentals.debtToEquity < stockA.fundamentals.debtToEquity) {
    advantagesB.push(`Lower financial leverage (D/E: ${stockB.fundamentals.debtToEquity} vs ${stockA.fundamentals.debtToEquity})`);
  }

  let winner: "stockA" | "stockB" | "tie" = "tie";
  if (stockA.researchScore > stockB.researchScore + 3) {
    winner = "stockA";
  } else if (stockB.researchScore > stockA.researchScore + 3) {
    winner = "stockB";
  }

  const winnerSymbol = winner === "stockA" ? stockA.symbol : winner === "stockB" ? stockB.symbol : "Tie";

  const verdict = winner === "stockA"
    ? `${stockA.symbol} ranks higher in LYNCH Research Score (${stockA.researchScore}/100) due to stronger return metrics and fundamental momentum.`
    : winner === "stockB"
    ? `${stockB.symbol} ranks higher in LYNCH Research Score (${stockB.researchScore}/100) due to superior valuation-adjusted return metrics.`
    : `${stockA.symbol} and ${stockB.symbol} offer highly complementary profiles. ${stockA.symbol} excels in capital returns, while ${stockB.symbol} provides strong business quality.`;

  return {
    stockA,
    stockB,
    winner,
    winnerSymbol,
    advantagesA,
    advantagesB,
    verdict,
  };
}

/**
 * Analyzes how a stock specifically impacts the user's demo portfolio.
 */
export function analyzeStockInPortfolioContext(symbol: string): PortfolioContextAnalysis | null {
  const stock = getStockProfile(symbol);
  if (!stock) return null;

  // Demo portfolio weights map
  const portfolioWeights: Record<string, number> = {
    TCS: 32,
    RELIANCE: 24,
    INFY: 18,
    HDFCBANK: 14,
    GOLD: 8,
    CASH: 4,
  };

  const weight = portfolioWeights[stock.symbol] || 0;
  const isLargest = stock.symbol === "TCS";

  let portfolioRiskImpact = "";
  let lynchRecommendation = "";

  if (weight > 25) {
    portfolioRiskImpact = `CRITICAL POSITION: ${stock.symbol} represents ${weight}% of your total portfolio. A 10% decline in ${stock.symbol} will impact overall portfolio NAV by -3.2%.`;
    lynchRecommendation = `Hold existing core position but trim future capital allocation to bring sector weight under 25%.`;
  } else if (weight > 10) {
    portfolioRiskImpact = `CORE HOLDING: ${stock.symbol} represents ${weight}% of your portfolio. Well-balanced weight within single-stock risk limits.`;
    lynchRecommendation = `Maintain position and accumulate on dips toward lower valuation boundaries.`;
  } else if (weight > 0) {
    portfolioRiskImpact = `MINOR POSITION: ${stock.symbol} represents ${weight}% of total portfolio value.`;
    lynchRecommendation = `Consider building position toward 10% allocation if research score remains above 80.`;
  } else {
    portfolioRiskImpact = `NOT IN PORTFOLIO: You currently have zero direct allocation to ${stock.symbol}.`;
    lynchRecommendation = `Candidate for portfolio diversification if sector rebalancing is initiated.`;
  }

  return {
    stock,
    holdingWeightPct: weight,
    isLargestPosition: isLargest,
    portfolioRiskImpact,
    lynchRecommendation,
  };
}

/**
 * Sector research summaries.
 */
export function getSectorResearchSummaries(): SectorResearchSummary[] {
  return [
    {
      sector: "Technology & IT Services",
      growthProfile: "Moderate Growth (8-12%)",
      valuationAssessment: "Premium / Fair",
      riskLevel: "MODERATE",
      topStock: "TCS (Research Score: 88)",
      keyDrivers: [
        "Cloud migration & Generative AI modernization contracts",
        "Superior ROE profiles (>30%) with near-zero leverage",
        "Short-term discretionary IT spending headwinds in US/EU",
      ],
    },
    {
      sector: "Banking & Financials",
      growthProfile: "Strong Credit Growth (15-18%)",
      valuationAssessment: "Attractive",
      riskLevel: "LOW",
      topStock: "ICICI Bank (Research Score: 89) & HDFC Bank (86)",
      keyDrivers: [
        "Private sector credit expansion & robust deposit franchises",
        "Valuations at 10-year historical lows relative to book value",
        "Slight Net Interest Margin (NIM) pressure due to deposit rates",
      ],
    },
    {
      sector: "Energy & Conglomerate",
      growthProfile: "Solid Cash Compounding (12-16%)",
      valuationAssessment: "Fair",
      riskLevel: "MODERATE",
      topStock: "Reliance Industries (Research Score: 84)",
      keyDrivers: [
        "Telecom duopoly structure driving ARPU expansion",
        "SOTP value unlocking via Jio/Retail listings",
        "Capital intensive green energy CapEx cycles",
      ],
    },
    {
      sector: "Telecommunications",
      growthProfile: "High Operating Leverage (15%+)",
      valuationAssessment: "Fair",
      riskLevel: "LOW",
      topStock: "Bharti Airtel (Research Score: 87)",
      keyDrivers: [
        "ARPU trajectory moving toward ₹250+ via tariff hikes",
        "High EBITDA conversion to Free Cash Flow",
        "5G enterprise network monetization",
      ],
    },
  ];
}