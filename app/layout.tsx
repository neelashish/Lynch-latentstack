import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "LYNCH | AI Financial Intelligence",
  description: "AI-powered financial research assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#070a11] text-white overflow-hidden`}
      >
        <div className="flex h-screen overflow-hidden">
          {/* Global Sidebar component */}
          <Sidebar activeItem="overview" />

          {/* Main content area */}
          <div className="flex-1 flex flex-col min-w-0 h-screen lg:ml-60">
            {/* Global Header component */}
            <Header title="Overview" />

            {/* Page content */}
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
