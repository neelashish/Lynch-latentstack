"use client";

import { useRouter } from "next/navigation";
import Dashboard from "@/ui/dashboard/Dashboard";
import { Stock } from "@/ui/data/demo";

export default function Home() {
  const router = useRouter();

  const handleStockClick = (stock: Stock) => {
    router.push(`/stock/${stock.symbol}`);
  };

  const handleViewAnalysis = (symbol: string) => {
    router.push(`/stock/${symbol}`);
  };

  return (
    <Dashboard 
      onStockClick={handleStockClick}
      onViewAnalysis={handleViewAnalysis}
    />
  );
}
