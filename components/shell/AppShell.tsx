"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { RightSidebar } from "./RightSidebar";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  children: React.ReactNode;
  pageTitle?: string;
  showRightSidebar?: boolean;
  activeSection?: string;
  onSelectSection?: (id: string) => void;
}

export function AppShell({
  children,
  pageTitle,
  showRightSidebar = true,
  activeSection,
  onSelectSection,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex justify-center selection:bg-emerald-500/30 selection:text-emerald-200 transition-colors duration-250">
      <div className="flex w-full max-w-[1400px] min-h-screen">
        {/* Left Sidebar (Desktop & Tablet) */}
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          activeSection={activeSection}
          onSelectSection={onSelectSection}
        />

        {/* Center Column */}
        <main className="min-w-0 flex-1 md:border-r border-[var(--border-subtle)] bg-[var(--bg-page)] min-h-screen pb-24 md:pb-12 transition-colors duration-250">
          <TopBar pageTitle={pageTitle} />
          <div className="p-4 sm:p-6 md:p-8">{children}</div>
        </main>

        {/* Right Sidebar (Desktop xl screens) */}
        {showRightSidebar && <RightSidebar />}
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
