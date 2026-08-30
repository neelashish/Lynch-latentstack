// ─────────────────────────────────────────────────────────────────────────────
// agent/research-data.ts
//
// Centralized Source of Truth for LYNCH Demo Equity Research Dataset.
// Contains 12 companies across 8 sectors with internally consistent metrics.
//
// ⚠️ All figures are demo/fictional data for hackathon prototype testing.
// ─────────────────────────────────────────────────────────────────────────────

export type SignalType = "BUY" | "HOLD" | "WATCH" | "REDUCE" | "AVOID";
export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "VERY HIGH";
export type ValuationRating = "Attractive" | "Fair" | "Premium" | "Expensive";

export interface StockResearchProfile {
  symbol: string;
  companyName: string;
  sector: string;
  industry: string;
  price: string;
  change: string;
  marketCap: string;

  fundamentals: {
    revenueGrowth: string; // e.g. "14.2%"
    earningsGrowth: string; // e.g. "16.5%"
    epsGrowth: string; // e.g. "15.8%"
    operatingMargin: string; // e.g. "24.5%"
    netMargin: string; // e.g. "18.2%"
    roe: number; // e.g. 28.5 (percent)
    roce: number; // e.g. 34.2 (percent)
    debtToEquity: number; // e.g. 0.08
    freeCashFlow: string; // e.g. "₹22,400 Cr"
    fcfYield: string; // e.g. "3.9%"
  };

  valuation: {
    pe: number; // e.g. 27.4
    pb: number; // e.g. 11.2
    evToEbitda: number; // e.g. 18.5
    assessment: ValuationRating;
    valuationNotes: string;
  };

  quality: {
    businessQuality: "Exceptional" | "High" | "Moderate" | "Cyclical";
    profitability: "Superior" | "Strong" | "Average";
    balanceSheet: "Pristine" | "Robust" | "Leveraged";
    cashGeneration: "High Conversion" | "Steady" | "Capital Intensive";
  };

  signals: {
    momentum: "Strong" | "Neutral" | "Weak";
    trend: "Bullish" | "Consolidating" | "Rangebound" | "Soft";
    earningsMomentum: "Accelerating" | "Stable" | "Decelerating";
    relativeStrength: string; // e.g. "+4.2% vs Nifty"
  };

  catalysts: string[];
  risks: string[];
  bullCase: string;
  bearCase: string;

  researchScore: number; // 0-100
  researchPriority: string; // e.g. "#1 High Conviction"
  signal: SignalType;
  confidence: number; // 0-100
  riskLevel: RiskLevel;
  lynchTakeaway: string;
}

export const DEMO_STOCK_UNIVERSE: Record<string, StockResearchProfile> = {
  TCS: {
    symbol: "TCS",
    companyName: "Tata Consultancy Services Ltd",
    sector: "Technology",
    industry: "IT Services & Consulting",
    price: "₹4,120.50",
    change: "+1.2%",
    marketCap: "₹14,90,000 Cr",
    fundamentals: {
      revenueGrowth: "12.4%",
      earningsGrowth: "14.1%",
      epsGrowth: "13.8%",
      operatingMargin: "24.6%",
      netMargin: "18.8%",
      roe: 48.2,
      roce: 58.6,
      debtToEquity: 0.04,
      freeCashFlow: "₹42,500 Cr",
      fcfYield: "3.8%",
    },
    valuation: {
      pe: 28.5,
      pb: 13.8,
      evToEbitda: 19.4,
      assessment: "Premium",
      valuationNotes: "Trades at a 15% premium to historical 5-year average P/E due to industry-leading return metrics.",
    },
    quality: {
      businessQuality: "Exceptional",
      profitability: "Superior",
      balanceSheet: "Pristine",
      cashGeneration: "High Conversion",
    },
    signals: {
      momentum: "Strong",
      trend: "Bullish",
      earningsMomentum: "Stable",
      relativeStrength: "+3.8% vs Nifty IT",
    },
    catalysts: [
      "Large-scale UK/EU cloud migration deal wins",
      "BFSI tech spending cycle normalization",
      "Operating margin expansion via workforce optimization",
    ],
    risks: [
      "US discretionary IT spending delays",
      "Wage inflation pressures in senior engineering cohorts",
      "Currency fluctuation risks (USD/INR volatility)",
    ],
    bullCase: "Sustained order book wins above $10B per quarter drive double-digit EPS compounding and margin expansion to 26%.",
    bearCase: "Prolonged slowdown in US banking tech spend suppresses revenue growth to single digits, compressing trailing P/E.",
    researchScore: 88,
    researchPriority: "#1 High Priority",
    signal: "BUY",
    confidence: 88,
    riskLevel: "LOW",
    lynchTakeaway: "Pristine compounder with industry-leading ROE (48%) and robust cash generation, justifying its valuation premium.",
  },

  INFY: {
    symbol: "INFY",
    companyName: "Infosys Ltd",
    sector: "Technology",
    industry: "IT Services",
    price: "₹1,845.00",
    change: "-0.6%",
    marketCap: "₹7,65,000 Cr",
    fundamentals: {
      revenueGrowth: "9.8%",
      earningsGrowth: "11.2%",
      epsGrowth: "11.0%",
      operatingMargin: "21.2%",
      netMargin: "16.4%",
      roe: 31.4,
      roce: 38.5,
      debtToEquity: 0.06,
      freeCashFlow: "₹21,100 Cr",
      fcfYield: "3.6%",
    },
    valuation: {
      pe: 24.2,
      pb: 7.8,
      evToEbitda: 16.2,
      assessment: "Fair",
      valuationNotes: "Valuation is inline with 5-year median, reflecting balanced risk/reward relative to TCS.",
    },
    quality: {
      businessQuality: "High",
      profitability: "Strong",
      balanceSheet: "Pristine",
      cashGeneration: "High Conversion",
    },
    signals: {
      momentum: "Neutral",
      trend: "Consolidating",
      earningsMomentum: "Stable",
      relativeStrength: "-1.2% vs Nifty IT",
    },
    catalysts: [
      "Generative AI service contract acceleration (Topaz platform)",
      "Large deal total contract value (TCV) expansion",
      "Subcontractor cost reductions",
    ],
    risks: [
      "Client decision cycles dragging out in retail/telecom verticals",
      "Pricing pressure on renewal contracts",
    ],
    bullCase: "Generative AI migration programs add $1.2B in incremental annual contract value over 18 months.",
    bearCase: "Attrition spike in key AI talent combined with European spending softness caps operating margins near 20%.",
    researchScore: 78,
    researchPriority: "#4 Watch & Accumulate",
    signal: "WATCH",
    confidence: 78,
    riskLevel: "MODERATE",
    lynchTakeaway: "Solid Tier-1 IT player offering reasonable valuation and strong execution, though slightly behind TCS in margin defense.",
  },

  RELIANCE: {
    symbol: "RELIANCE",
    companyName: "Reliance Industries Ltd",
    sector: "Energy / Conglomerate",
    industry: "Oil, Retail & Telecom",
    price: "₹2,980.00",
    change: "+1.8%",
    marketCap: "₹20,15,000 Cr",
    fundamentals: {
      revenueGrowth: "11.5%",
      earningsGrowth: "15.2%",
      epsGrowth: "14.8%",
      operatingMargin: "17.8%",
      netMargin: "9.4%",
      roe: 14.8,
      roce: 13.2,
      debtToEquity: 0.38,
      freeCashFlow: "₹38,200 Cr",
      fcfYield: "2.8%",
    },
    valuation: {
      pe: 26.8,
      pb: 2.4,
      evToEbitda: 13.5,
      assessment: "Fair",
      valuationNotes: "Sum-of-the-parts (SOTP) valuation reflects embedded value in Jio Telecom and Reliance Retail.",
    },
    quality: {
      businessQuality: "High",
      profitability: "Strong",
      balanceSheet: "Robust",
      cashGeneration: "Capital Intensive",
    },
    signals: {
      momentum: "Strong",
      trend: "Bullish",
      earningsMomentum: "Accelerating",
      relativeStrength: "+5.1% vs Nifty 50",
    },
    catalysts: [
      "Telecom tariff hikes boosting Jio ARPU to ₹220+",
      "Spin-off / IPO unlocking for Retail & Jio digital arms",
      "Green energy giga-factory commissioning in Gujarat",
    ],
    risks: [
      "Global refining margin volatility (GRM compression)",
      "High CapEx requirements in 5G and new energy ecosystems",
    ],
    bullCase: "Unlocking value in Jio and Retail via separate listings triggers a 25% SOTP re-rating.",
    bearCase: "Prolonged weakness in petrochemical spreads offsets consumer segment earnings growth.",
    researchScore: 84,
    researchPriority: "#2 High Priority",
    signal: "BUY",
    confidence: 85,
    riskLevel: "MODERATE",
    lynchTakeaway: "Dominant multi-engine growth conglomerate benefiting from telecom tariff hikes and consumer retail scale.",
  },

  HDFCBANK: {
    symbol: "HDFCBANK",
    companyName: "HDFC Bank Ltd",
    sector: "Banking",
    industry: "Private Sector Bank",
    price: "₹1,680.00",
    change: "+0.8%",
    marketCap: "₹12,80,000 Cr",
    fundamentals: {
      revenueGrowth: "16.4%",
      earningsGrowth: "18.1%",
      epsGrowth: "15.2%",
      operatingMargin: "38.5%",
      netMargin: "21.4%",
      roe: 16.8,
      roce: 15.4,
      debtToEquity: 1.15,
      freeCashFlow: "N/A (Bank)",
      fcfYield: "N/A",
    },
    valuation: {
      pe: 18.2,
      pb: 2.6,
      evToEbitda: 11.8,
      assessment: "Attractive",
      valuationNotes: "Trading at historical 10-year valuation lows relative to book value post-merger integration.",
    },
    quality: {
      businessQuality: "Exceptional",
      profitability: "Superior",
      balanceSheet: "Robust",
      cashGeneration: "Steady",
    },
    signals: {
      momentum: "Neutral",
      trend: "Consolidating",
      earningsMomentum: "Accelerating",
      relativeStrength: "+2.1% vs Nifty Bank",
    },
    catalysts: [
      "Deposit growth acceleration normalizing credit-to-deposit ratio",
      "Post-merger operating synergies and branch network cross-selling",
      "NIM expansion back toward 4.1%",
    ],
    risks: [
      "Deposit rate competition across private sector banks",
      "Unsecured retail credit default spikes in broader industry",
    ],
    bullCase: "Credit-to-deposit ratio returns below 85%, unlocking loan growth above 18% and re-rating stock toward 3.5x P/B.",
    bearCase: "Elevated cost of funds limits Net Interest Margin (NIM) expansion to below 3.7%.",
    researchScore: 86,
    researchPriority: "#3 High Priority",
    signal: "BUY",
    confidence: 86,
    riskLevel: "LOW",
    lynchTakeaway: "Premier private banking franchise trading at an attractive valuation relative to historical price-to-book ratios.",
  },

  ICICIBANK: {
    symbol: "ICICIBANK",
    companyName: "ICICI Bank Ltd",
    sector: "Banking",
    industry: "Private Sector Bank",
    price: "₹1,210.00",
    change: "+1.1%",
    marketCap: "₹8,50,000 Cr",
    fundamentals: {
      revenueGrowth: "17.8%",
      earningsGrowth: "21.4%",
      epsGrowth: "20.1%",
      operatingMargin: "41.2%",
      netMargin: "23.1%",
      roe: 18.9,
      roce: 17.2,
      debtToEquity: 1.08,
      freeCashFlow: "N/A (Bank)",
      fcfYield: "N/A",
    },
    valuation: {
      pe: 17.1,
      pb: 3.1,
      evToEbitda: 11.2,
      assessment: "Fair",
      valuationNotes: "Valued at a premium to HDFC Bank due to superior current NIMs and asset quality metrics.",
    },
    quality: {
      businessQuality: "Exceptional",
      profitability: "Superior",
      balanceSheet: "Robust",
      cashGeneration: "Steady",
    },
    signals: {
      momentum: "Strong",
      trend: "Bullish",
      earningsMomentum: "Accelerating",
      relativeStrength: "+6.4% vs Nifty Bank",
    },
    catalysts: [
      "Industry-leading NIM of 4.3% with low credit costs",
      "Digital banking adoption via iMobile Pay",
      "Strong SME and retail loan book expansion",
    ],
    risks: [
      "Macro interest rate cuts compressing yield on advances",
      "Increased regulatory risk weights on personal loans",
    ],
    bullCase: "ROA stays above 2.2% with credit costs below 50 bps, driving total return compounding of 20%+.",
    bearCase: "Unsecured loan portfolio slippages increase credit provisioning costs.",
    researchScore: 89,
    researchPriority: "#1 High Priority",
    signal: "BUY",
    confidence: 90,
    riskLevel: "LOW",
    lynchTakeaway: "Top-performing bank with industry-leading ROA (2.3%) and flawless asset quality defense.",
  },

  BHARTIARTL: {
    symbol: "BHARTIARTL",
    companyName: "Bharti Airtel Ltd",
    sector: "Telecommunications",
    industry: "Telecom Services",
    price: "₹1,420.00",
    change: "+2.4%",
    marketCap: "₹8,20,000 Cr",
    fundamentals: {
      revenueGrowth: "15.1%",
      earningsGrowth: "24.5%",
      epsGrowth: "22.8%",
      operatingMargin: "51.8%",
      netMargin: "14.2%",
      roe: 21.2,
      roce: 18.4,
      debtToEquity: 1.12,
      freeCashFlow: "₹18,500 Cr",
      fcfYield: "3.2%",
    },
    valuation: {
      pe: 38.5,
      pb: 6.2,
      evToEbitda: 11.4,
      assessment: "Fair",
      valuationNotes: "EV/EBITDA is the preferred valuation metric for telecom; 11.4x reflects market duopoly structure.",
    },
    quality: {
      businessQuality: "High",
      profitability: "Superior",
      balanceSheet: "Robust",
      cashGeneration: "High Conversion",
    },
    signals: {
      momentum: "Strong",
      trend: "Bullish",
      earningsMomentum: "Accelerating",
      relativeStrength: "+8.2% vs Nifty 50",
    },
    catalysts: [
      "ARPU expansion from ₹211 toward target ₹300 via premiumization",
      "Monetization of 5G enterprise networks",
      "Deleveraging of spectrum debt",
    ],
    risks: [
      "CapEx drag on 5G network expansion",
      "Regulatory spectrum auction liabilities",
    ],
    bullCase: "ARPU reaches ₹250+ by Q4, generating ₹30,000 Cr annual free cash flow for aggressive debt reduction.",
    bearCase: "Competitive intensity delays expected tariff hike cycle.",
    researchScore: 87,
    researchPriority: "#2 High Priority",
    signal: "BUY",
    confidence: 88,
    riskLevel: "LOW",
    lynchTakeaway: "Structural beneficiary of India's telecom duopoly with accelerating ARPU growth and high operating leverage.",
  },

  TATAMOTORS: {
    symbol: "TATAMOTORS",
    companyName: "Tata Motors Ltd",
    sector: "Automobile",
    industry: "Passenger & Commercial Vehicles",
    price: "₹980.00",
    change: "-1.4%",
    marketCap: "₹3,58,000 Cr",
    fundamentals: {
      revenueGrowth: "18.2%",
      earningsGrowth: "32.4%",
      epsGrowth: "28.5%",
      operatingMargin: "14.2%",
      netMargin: "6.8%",
      roe: 26.4,
      roce: 22.1,
      debtToEquity: 0.42,
      freeCashFlow: "₹26,800 Cr",
      fcfYield: "7.5%",
    },
    valuation: {
      pe: 14.8,
      pb: 3.8,
      evToEbitda: 6.2,
      assessment: "Attractive",
      valuationNotes: "Trading at an attractive 6.2x EV/EBITDA due to cyclical auto market concerns.",
    },
    quality: {
      businessQuality: "Moderate",
      profitability: "Strong",
      balanceSheet: "Robust",
      cashGeneration: "High Conversion",
    },
    signals: {
      momentum: "Weak",
      trend: "Rangebound",
      earningsMomentum: "Decelerating",
      relativeStrength: "-4.5% vs Nifty Auto",
    },
    catalysts: [
      "JLR net zero debt milestone achievement",
      "Demerger into Commercial Vehicles and Passenger Vehicles listed entities",
      "EV market share dominance in domestic PV segment",
    ],
    risks: [
      "Jaguar Land Rover sales softness in China and Europe",
      "Domestic EV discounting pressures from new entrants",
    ],
    bullCase: "JLR order book remains resilient while domestic EV business achieves 12% EBITDA margin.",
    bearCase: "Global luxury auto demand slowdown impairs JLR cash flow, delaying de-leveraging.",
    researchScore: 82,
    researchPriority: "#5 Value Opportunity",
    signal: "BUY",
    confidence: 81,
    riskLevel: "MODERATE",
    lynchTakeaway: "Strong turnaround story with high FCF yield (7.5%) and net debt elimination, despite short-term cyclical auto headwinds.",
  },

  LT: {
    symbol: "LT",
    companyName: "Larsen & Toubro Ltd",
    sector: "Industrials",
    industry: "Engineering & Construction",
    price: "₹3,650.00",
    change: "+0.5%",
    marketCap: "₹5,01,000 Cr",
    fundamentals: {
      revenueGrowth: "14.8%",
      earningsGrowth: "17.2%",
      epsGrowth: "16.4%",
      operatingMargin: "11.8%",
      netMargin: "7.2%",
      roe: 16.2,
      roce: 15.8,
      debtToEquity: 0.85,
      freeCashFlow: "₹14,200 Cr",
      fcfYield: "2.8%",
    },
    valuation: {
      pe: 32.4,
      pb: 4.1,
      evToEbitda: 18.2,
      assessment: "Fair",
      valuationNotes: "Commands premium valuation due to record ₹4.8 Lakh Cr order book and capex proxy status.",
    },
    quality: {
      businessQuality: "High",
      profitability: "Strong",
      balanceSheet: "Robust",
      cashGeneration: "Capital Intensive",
    },
    signals: {
      momentum: "Neutral",
      trend: "Consolidating",
      earningsMomentum: "Stable",
      relativeStrength: "+1.2% vs Nifty 50",
    },
    catalysts: [
      "India infrastructure Capex execution speed-up",
      "Middle East hydrocarbon and renewable energy order inflows",
      "Divestment of non-core concessions assets",
    ],
    risks: [
      "Working capital expansion in international projects",
      "Raw material price inflation (steel, cement)",
    ],
    bullCase: "Order book execution speeds up to 18% annual growth with 100 bps margin expansion.",
    bearCase: "Delayed government payments expand working capital cycle to over 22% of revenue.",
    researchScore: 83,
    researchPriority: "#3 High Priority",
    signal: "BUY",
    confidence: 84,
    riskLevel: "LOW",
    lynchTakeaway: "Premier infrastructure proxy with a massive order book providing multi-year revenue visibility.",
  },

  SUNPHARMA: {
    symbol: "SUNPHARMA",
    companyName: "Sun Pharmaceutical Industries Ltd",
    sector: "Pharmaceuticals",
    industry: "Specialty Pharmaceuticals",
    price: "₹1,710.00",
    change: "+1.5%",
    marketCap: "₹4,10,000 Cr",
    fundamentals: {
      revenueGrowth: "10.4%",
      earningsGrowth: "13.8%",
      epsGrowth: "13.2%",
      operatingMargin: "27.5%",
      netMargin: "20.1%",
      roe: 17.5,
      roce: 21.4,
      debtToEquity: 0.05,
      freeCashFlow: "₹11,800 Cr",
      fcfYield: "2.9%",
    },
    valuation: {
      pe: 35.2,
      pb: 5.4,
      evToEbitda: 22.1,
      assessment: "Premium",
      valuationNotes: "P/E reflects growing revenue contribution from high-margin US specialty portfolio (Ilumya, Cequua).",
    },
    quality: {
      businessQuality: "High",
      profitability: "Superior",
      balanceSheet: "Pristine",
      cashGeneration: "High Conversion",
    },
    signals: {
      momentum: "Strong",
      trend: "Bullish",
      earningsMomentum: "Accelerating",
      relativeStrength: "+7.4% vs Nifty Pharma",
    },
    catalysts: [
      "US Specialty revenue expansion past $1B annual run-rate",
      "Domestic formulation market share gains in chronic therapies",
      "R&D pipeline clinical trial approvals",
    ],
    risks: [
      "US FDA import alerts / warning letters on manufacturing facilities",
      "Generic drug price erosion in US oral solid formulations",
    ],
    bullCase: "Specialty portfolio revenue reaches 35% of total sales, pushing EBITDA margins above 30%.",
    bearCase: "Regulatory resolution delays at Halol plant impact generic launches.",
    researchScore: 85,
    researchPriority: "#2 High Priority",
    signal: "BUY",
    confidence: 86,
    riskLevel: "LOW",
    lynchTakeaway: "Defensive healthcare leader transforming from generic manufacturer to high-margin global specialty pharma player.",
  },

  ITC: {
    symbol: "ITC",
    companyName: "ITC Ltd",
    sector: "Consumer Goods",
    industry: "FMCG, Paper & Hotels",
    price: "₹490.00",
    change: "+0.2%",
    marketCap: "₹6,12,000 Cr",
    fundamentals: {
      revenueGrowth: "7.8%",
      earningsGrowth: "9.5%",
      epsGrowth: "9.2%",
      operatingMargin: "36.2%",
      netMargin: "27.4%",
      roe: 29.8,
      roce: 37.1,
      debtToEquity: 0.01,
      freeCashFlow: "₹17,400 Cr",
      fcfYield: "2.8%",
    },
    valuation: {
      pe: 27.8,
      pb: 8.2,
      evToEbitda: 19.5,
      assessment: "Fair",
      valuationNotes: "Valuation is supported by high dividend payout yield (3.5%) and debt-free balance sheet.",
    },
    quality: {
      businessQuality: "Exceptional",
      profitability: "Superior",
      balanceSheet: "Pristine",
      cashGeneration: "High Conversion",
    },
    signals: {
      momentum: "Neutral",
      trend: "Rangebound",
      earningsMomentum: "Stable",
      relativeStrength: "+0.5% vs Nifty FMCG",
    },
    catalysts: [
      "Hotel business demerger listing unlocking capital efficiency",
      "FMCG non-cigarette business margin expansion toward 12%",
      "Rural demand recovery driving volume growth",
    ],
    risks: [
      "Tax hikes on cigarettes in Union Budget",
      "Agri-commodity inflation impacting paperboards and packaged foods",
    ],
    bullCase: "FMCG margins expand by 150 bps annually while cigarette volume grows at stable 4%.",
    bearCase: "Unexpected tax hikes restrict cigarette volume growth to zero.",
    researchScore: 81,
    researchPriority: "#4 Watch & Income",
    signal: "WATCH",
    confidence: 82,
    riskLevel: "LOW",
    lynchTakeaway: "Cash-generative consumer anchor with excellent ROE (30%), offering stability and defensive dividend yields.",
  },

  NTPC: {
    symbol: "NTPC",
    companyName: "NTPC Ltd",
    sector: "Utilities / Energy",
    industry: "Power Generation",
    price: "₹410.00",
    change: "+1.9%",
    marketCap: "₹3,97,000 Cr",
    fundamentals: {
      revenueGrowth: "11.2%",
      earningsGrowth: "14.5%",
      epsGrowth: "14.0%",
      operatingMargin: "26.4%",
      netMargin: "11.5%",
      roe: 13.8,
      roce: 11.2,
      debtToEquity: 1.35,
      freeCashFlow: "₹8,200 Cr",
      fcfYield: "2.1%",
    },
    valuation: {
      pe: 18.5,
      pb: 2.2,
      evToEbitda: 10.1,
      assessment: "Fair",
      valuationNotes: "Re-rated significantly over past 2 years due to green energy transition and NTPC Green IPO plans.",
    },
    quality: {
      businessQuality: "High",
      profitability: "Strong",
      balanceSheet: "Leveraged",
      cashGeneration: "Capital Intensive",
    },
    signals: {
      momentum: "Strong",
      trend: "Bullish",
      earningsMomentum: "Accelerating",
      relativeStrength: "+9.1% vs Nifty PSE",
    },
    catalysts: [
      "NTPC Green Energy Ltd IPO valuation unlock",
      "60 GW renewable energy capacity target by 2032",
      "High thermal plant load factor (PLF) supporting regulated equity returns",
    ],
    risks: [
      "High debt load for renewable CapEx expansion",
      "State DISCOM payment delay risks",
    ],
    bullCase: "Green energy subsidiary listing unlocks ₹80,000 Cr market value.",
    bearCase: "Rising interest rates increase borrowing costs for solar/wind projects.",
    researchScore: 80,
    researchPriority: "#5 Value Opportunity",
    signal: "WATCH",
    confidence: 80,
    riskLevel: "MODERATE",
    lynchTakeaway: "Power generation giant transitioning to clean energy with strong regulated returns backing growth.",
  },

  MARUTI: {
    symbol: "MARUTI",
    companyName: "Maruti Suzuki India Ltd",
    sector: "Automobile",
    industry: "Passenger Vehicles",
    price: "₹12,400.00",
    change: "-0.8%",
    marketCap: "₹3,90,000 Cr",
    fundamentals: {
      revenueGrowth: "12.1%",
      earningsGrowth: "16.8%",
      epsGrowth: "16.2%",
      operatingMargin: "11.8%",
      netMargin: "8.5%",
      roe: 18.2,
      roce: 22.8,
      debtToEquity: 0.01,
      freeCashFlow: "₹12,500 Cr",
      fcfYield: "3.2%",
    },
    valuation: {
      pe: 26.4,
      pb: 4.8,
      evToEbitda: 17.1,
      assessment: "Fair",
      valuationNotes: "Valued fairly relative to historical averages as SUV market share expansion offsets entry-level hatchback softness.",
    },
    quality: {
      businessQuality: "High",
      profitability: "Strong",
      balanceSheet: "Pristine",
      cashGeneration: "High Conversion",
    },
    signals: {
      momentum: "Neutral",
      trend: "Consolidating",
      earningsMomentum: "Stable",
      relativeStrength: "+0.8% vs Nifty Auto",
    },
    catalysts: [
      "Grand Vitara & Fronx SUV volume expansion",
      "First EV launch (e-Vitara) in 2025",
      "Hybrid technology adoption in domestic market",
    ],
    risks: [
      "Entry-level hatchback market contraction",
      "Yen currency movement impacting imported component costs",
    ],
    bullCase: "SUV market share crosses 26% while hybrid powertrain volume doubles.",
    bearCase: "Delayed EV launches allow competitors to dominate domestic EV passenger car space.",
    researchScore: 82,
    researchPriority: "#4 Watch & Accumulate",
    signal: "WATCH",
    confidence: 83,
    riskLevel: "LOW",
    lynchTakeaway: "Market leader in domestic passenger vehicles with pristine cash reserves, successfully pivoting into high-margin SUVs.",
  },
};