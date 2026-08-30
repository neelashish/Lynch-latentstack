"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AlertManager from "@/alerts/AlertManager";
import { Activity } from "@/alerts/alert-data";

export default function AlertsPage() {
  const router = useRouter();

  const handleAskLynch = (activity: Activity) => {
    router.push("/chat");
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <AlertManager onAskLynch={handleAskLynch} />
    </div>
  );
}
