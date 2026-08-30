"use client";

import React, { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/ui/navigation/Sidebar";
import Header from "@/ui/navigation/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);

  // Safely restore collapsed preference after mount to ensure zero hydration mismatch
  useEffect(() => {
    try {
      const stored = localStorage.getItem("lynch_sidebar_collapsed");
      if (stored === "true") {
        setCollapsed(true);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("lynch_sidebar_collapsed", String(next));
      } catch {
        // Ignore localStorage errors
      }
      return next;
    });
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#070a11] text-white overflow-hidden`}
        suppressHydrationWarning
      >
        <div className="flex h-screen overflow-hidden">
          {/* Global Collapsible Sidebar */}
          <Sidebar
            collapsed={collapsed}
            onToggleCollapse={handleToggleCollapse}
          />

          {/* Main Content Area — Resizes dynamically with sidebar */}
          <div
            className={`flex-1 flex flex-col min-w-0 h-screen transition-all duration-300 ease-in-out ${
              collapsed ? "lg:ml-16" : "lg:ml-60"
            }`}
          >
            {/* Global Header */}
            <Header
              sidebarCollapsed={collapsed}
              onToggleSidebar={handleToggleCollapse}
            />

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
