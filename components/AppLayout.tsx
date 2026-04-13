"use client";

import React, { useState, useEffect } from "react";
import { SideNav } from "./SideNav";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useStore } from "@/store/useStore";
import { ToastProvider } from "./ToastProvider";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body selection:bg-primary/30 selection:text-primary relative">
      <SideNav />
      {/* Main Content Wrapper - dynamically adjusts left margin/padding based on sidebar state */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-out-quint ${
          mounted && sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        <Navbar />
        {children}
        <Footer />
      </div>
      <ToastProvider />
    </div>
  );
}
