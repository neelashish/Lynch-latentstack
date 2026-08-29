"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/components/Card.tsx — Generic reusable card shell
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** padding preset — "sm" | "md" (default) | "lg" | "none" */
  padding?: "none" | "sm" | "md" | "lg";
  /** whether to show a hover state */
  hover?: boolean;
  onClick?: () => void;
}

const paddingMap = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export default function Card({
  children,
  className = "",
  padding = "md",
  hover = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        "rounded-xl border border-white/[0.06] bg-[#0d1117]",
        paddingMap[padding],
        hover
          ? "transition-colors duration-200 hover:border-white/[0.12] hover:bg-[#111820] cursor-pointer"
          : "",
        onClick ? "cursor-pointer" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
