"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShareModal } from "./ShareModal";
import { playUiClick } from "@/lib/sound";
import { usePortfolio } from "@/components/portfolio/PortfolioContext";

interface TopBarProps {
  pageTitle?: string;
}

export function TopBar({ pageTitle }: TopBarProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const { data } = usePortfolio();

  const name = data?.name || "Hasib Hossain Niloy";
  const shortName = name.split(" ")[0] || "Niloy";
  const avatar = data?.avatar || "https://avatars.githubusercontent.com/u/174131986?v=4";
  const title = data?.title || "Software Engineer & Full-Stack Builder";
  const resumeUrl =
    data?.resumeUrl ||
    data?.contacts?.find((c) => c.name.toLowerCase().includes("resume"))?.link ||
    "https://drive.google.com/file/d/1mepMM01uzz6R7qLAdUZM-ODszg-Kvz7V/view?usp=sharing";

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-page)]/90 px-4 md:px-6 backdrop-blur-md transition-colors duration-250">
        {/* Left: Avatar & Identity or Page Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={playUiClick}
            className="group flex items-center gap-3"
          >
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/10 group-hover:border-emerald-500/50 transition-colors">
              <Image
                src={avatar}
                alt={name}
                fill
                className="object-cover scale-[1.35] origin-[center_42%] transition-transform duration-300"
                unoptimized
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-white">
                  {pageTitle ? pageTitle : shortName}
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 line-clamp-1 max-w-[200px] sm:max-w-[320px]">
                {pageTitle ? name : title}
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Resume Button */}
        <div className="flex items-center gap-2.5">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playUiClick}
            className="group relative inline-flex items-center justify-center isolate overflow-hidden rounded-[17px] border-[4px] border-[#4ade80]/20 bg-[#1a8f57] bg-clip-padding px-5 py-[8px] text-[14px] font-bold !text-white select-none whitespace-nowrap transition-all duration-200 [background-image:radial-gradient(circle,rgba(255,255,255,0.10)_1.25px,transparent_1.35px),linear-gradient(180deg,#38a169_0%,#1f8a55_45%,#0b5934_100%)] [background-size:8px_8px,100%_100%] [box-shadow:inset_0_1px_1px_0_rgba(255,255,255,0.45),inset_0_-2px_3px_0_rgba(0,0,0,0.35),0_2px_8px_rgba(0,0,0,0.4),0_0_16px_rgba(34,197,94,0.25)] before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-full before:bg-gradient-to-b before:from-white/20 before:via-white/[0.03] before:to-transparent hover:-translate-y-0.5 hover:scale-[1.015] hover:brightness-105 hover:[box-shadow:inset_0_1px_1.5px_0_rgba(255,255,255,0.6),inset_0_-2px_3px_0_rgba(0,0,0,0.35),0_4px_14px_rgba(0,0,0,0.45),0_0_24px_rgba(34,197,94,0.4)] active:translate-y-0 active:scale-[0.98] active:brightness-95 active:[box-shadow:inset_0_1px_1px_0_rgba(255,255,255,0.3),inset_0_2px_4px_0_rgba(0,0,0,0.4),0_2px_6px_rgba(0,0,0,0.4),0_0_12px_rgba(34,197,94,0.2)]"
          >
            <span className="relative z-[2] !text-white">Resume</span>
          </a>
        </div>
      </header>

      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} />
    </>
  );
}
