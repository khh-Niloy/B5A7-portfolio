"use client";

import React from "react";
import { GitFork, Star, ArrowUpRight } from "lucide-react";
import { playUiClick } from "@/lib/sound";

interface RepoCardProps {
  owner: string;
  name: string;
  description: string;
  language: string;
  languageColor?: string;
  stars?: number;
  forks?: number;
  url: string;
}

export function RepoCard({
  owner,
  name,
  description,
  language,
  languageColor = "#3178c6",
  stars = 0,
  forks = 0,
  url,
}: RepoCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={playUiClick}
      className="group flex flex-col justify-between rounded-xl border border-white/5 bg-[#141414] p-4 transition-all hover:border-emerald-500/30 hover:bg-[#171717] hover:shadow-[0_0_20px_rgba(16,185,129,0.05)]"
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-xs truncate">
            <span className="text-zinc-500">{owner}/</span>
            <span className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
              {name}
            </span>
          </div>
          <ArrowUpRight className="h-3.5 w-3.5 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-400" />
        </div>

        <p className="mt-2 text-xs text-zinc-400 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-4 text-[11px] text-zinc-500 pt-2 border-t border-white/5">
        {language && (
          <div className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: languageColor }}
            />
            <span className="text-zinc-400">{language}</span>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-zinc-500" />
          <span>{stars}</span>
        </div>

        <div className="flex items-center gap-1">
          <GitFork className="h-3 w-3 text-zinc-500" />
          <span>{forks}</span>
        </div>
      </div>
    </a>
  );
}
