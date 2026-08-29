"use client";

import { useRouter, useParams } from "next/navigation";
import StockPage from "@/ui/stock/StockPage";
import { DEMO_RELIANCE } from "@/ui/data/demo";

export default function StockDetail() {
  const router = useRouter();
  const params = useParams();
  
  // Note: For hackathon demo, we simply load the DEMO_RELIANCE data
  // but change the symbol to match the route param if desired.
  const symbol = params?.symbol as string;
  
  const demoStock = {
    ...DEMO_RELIANCE,
    symbol: (symbol || DEMO_RELIANCE.symbol).toUpperCase()
  };

  return (
    <StockPage 
      stock={demoStock} 
      onBack={() => router.push("/")} 
    />
  );
}
