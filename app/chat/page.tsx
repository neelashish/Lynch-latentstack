"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LynchChat from "@/agent/Chat";

function ChatContainer() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || undefined;

  return <LynchChat initialQuery={initialQuery} />;
}

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-61px)] w-full overflow-hidden">
      <Suspense fallback={
        <div className="flex h-full w-full items-center justify-center bg-[#070a11]">
          <p className="text-xs text-gray-500 font-mono">Initializing LYNCH Co-Pilot...</p>
        </div>
      }>
        <ChatContainer />
      </Suspense>
    </div>
  );
}
