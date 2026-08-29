"use client";

import LynchChat from "@/agent/Chat";

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-61px)] w-full overflow-hidden">
      <LynchChat />
    </div>
  );
}
