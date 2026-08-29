"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ui/components/Modal.tsx — Simple reusable modal overlay
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** max width of modal content */
  maxWidth?: "sm" | "md" | "lg";
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "md",
}: ModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={[
          "relative w-full rounded-2xl border border-white/[0.08]",
          "bg-[#0d1117] shadow-2xl shadow-black/60",
          maxWidthMap[maxWidth],
        ].join(" ")}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <span className="text-sm font-semibold text-white tracking-wide">
              {title}
            </span>
            <button
              onClick={onClose}
              className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-600
                hover:text-gray-300 hover:bg-white/[0.06] transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
