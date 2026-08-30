"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ActivityFeed from "@/alerts/ActivityFeed";
import { Activity } from "@/alerts/alert-data";

export default function ActivityPage() {
  const router = useRouter();

  const handleAskLynch = (activity: Activity) => {
    router.push("/chat");
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <ActivityFeed onAskLynch={handleAskLynch} />
    </div>
  );
}
