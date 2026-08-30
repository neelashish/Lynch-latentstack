"use client";

import React, { use } from "react";
import StockResearchView from "@/ui/stock/StockResearchView";

export default function StockSymbolPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const resolvedParams = use(params);
  const symbol = resolvedParams.symbol?.toUpperCase() || "TCS";

  return <StockResearchView initialSymbol={symbol} />;
}