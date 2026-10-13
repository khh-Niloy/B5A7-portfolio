"use client";

import React, { useRef } from "react";
import { User, Wrench, FolderGit2, Briefcase, Mail } from "lucide-react";
import { playUiClick } from "@/lib/sound";

export interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const SECTION_TABS: TabItem[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "contact", label: "Contact", icon: Mail },
];

interface SectionTabsProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
}

export function SectionTabs({
  activeSection,
  onSelectSection,
}: SectionTabsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleClick = (id: string) => {
    playUiClick();
    onSelectSection(id);
  };

  return (
    <div
      ref={containerRef}
      className="sticky top-16 z-20 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 border-b border-white/10 bg-[#0d0d0d]/90 backdrop-blur-md transition-colors duration-200 pt-10"
    >
      <nav
        className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Section Navigation Tabs"
      >
        {SECTION_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleClick(tab.id)}
              className={`relative flex items-center gap-2 rounded-full px-4 py-1.5 text-xs sm:text-[13px] font-semibold transition-all cursor-pointer shrink-0 ${
                isActive
                  ? " text-emerald-400 shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
              aria-current={isActive ? "true" : undefined}
            >
              <Icon
                className={`h-3.5 w-3.5 transition-colors ${
                  isActive ? "text-emerald-400" : "text-zinc-500"
                }`}
              />
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute -bottom-2.5 left-3 right-3 h-[2px] bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
