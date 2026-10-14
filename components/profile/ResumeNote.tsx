"use client";

import React from "react";
import { FileDown, ExternalLink } from "lucide-react";
import { playUiClick } from "@/lib/sound";
import { usePortfolio } from "@/components/portfolio/PortfolioContext";

export function ResumeNote() {
  const { data } = usePortfolio();
  const resumeUrl =
    data?.resumeUrl ||
    data?.contacts?.find((c) => c.name.toLowerCase().includes("resume"))?.link ||
    "https://drive.google.com/file/d/1mepMM01uzz6R7qLAdUZM-ODszg-Kvz7V/view?usp=sharing";

  return (
    <div className="mt-12 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-5 text-center transition-all hover:border-emerald-500/40">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-emerald-400 mb-3">
        <FileDown className="h-5 w-5" />
      </div>

      <p className="text-xs sm:text-sm text-zinc-300 font-medium">
        Want the formal two-page breakdown of my engineering career?
      </p>

      <p className="mt-1 text-xs text-zinc-500">
        Up-to-date with work experience, verified credentials, and university coursework.
      </p>

      <a
        href={resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={playUiClick}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-5 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all cursor-pointer"
      >
        <span>View Full PDF Résumé</span>
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
