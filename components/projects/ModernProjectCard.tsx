"use client";

import React from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { playUiClick } from "@/lib/sound";
import { Modal } from "@/components/modules/Projects/Modal";
import { LinkPreview } from "@/components/ui/link-preview";

interface ModernProjectCardProps {
  id: string;
  projectName: string;
  shortDes: string;
  techStack: string[];
  image?: string;
  liveSite?: string;
  githubRepo?: string;
  initials?: string;
}

export function ModernProjectCard({
  id,
  projectName,
  shortDes,
  techStack = [],
  image,
  liveSite,
  githubRepo,
  initials,
}: ModernProjectCardProps) {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-white/5 bg-[#141414] p-3 sm:p-4 transition-all duration-300 hover:border-emerald-500/30 hover:bg-[#161616] hover:shadow-[0_0_30px_rgba(16,185,129,0.06)]">
      <div>
        {/* Thumbnail with perspective tilt image (Matching Image 1) */}
        <div className="relative h-44 sm:h-38 w-full overflow-hidden rounded-xl bg-[#13162d] border border-white/5 mb-4">
          {image ? (
            <img
              src={image}
              alt={projectName}
              className="absolute top-6 sm:top-4 sm:w-[100%] w-[94%] rotate-2 sm:left-0 left-3 rounded-xl shadow-2xl transition-transform duration-500 group-hover:rotate-0 group-hover:scale-105 object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0c1c14] via-[#0f281e] to-[#0a120e]">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-black/40 backdrop-blur-md shadow-2xl">
                <span className="text-lg font-extrabold text-emerald-300">
                  {initials || projectName.slice(0, 2).toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-white group-hover:text-emerald-300 transition-colors">
              {projectName}
            </h3>
            {githubRepo && (
              <a
                href={githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playUiClick}
                className="text-zinc-500 hover:text-white transition-colors"
                title="View Source on GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
          </div>

          <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed line-clamp-2">
            {shortDes}
          </p>
        </div>
      </div>

      {/* Footer: Tech Stack Pills & Equal-Width Action Buttons */}
      <div className="mt-5 space-y-3.5 pt-3 border-t border-white/5">
        {/* Tech Stack Pills (2 badges + '+ more') */}
        <div className="flex flex-wrap items-center gap-1.5 min-h-[30px]">
          {techStack.slice(0, 2).map((tech, idx) => (
            <span
              key={`${tech}-${idx}`}
              className="inline-flex items-center rounded-full border border-white/10 bg-gradient-to-b from-[#2b2b2f] via-[#212124] to-[#161618] px-2.5 py-1 text-[11px] font-medium text-zinc-200 shadow-sm select-none"
            >
              {tech}
            </span>
          ))}
          {techStack.length > 2 && (
            <span
              className="inline-flex items-center rounded-full border border-white/10 bg-[#1c1c1f] px-2.5 py-1 text-[11px] font-medium text-emerald-400/90 shadow-sm select-none"
              title={techStack.slice(2).join(", ")}
            >
              +{techStack.length - 2} more
            </span>
          )}
        </div>

        {/* Actions Row: Details (left) & Live Site (right) with equal width */}
        <div className="grid grid-cols-2 gap-2.5 pt-1 w-full">
          <Modal id={id} triggerClassName="w-full" />

          {liveSite ? (
            <LinkPreview url={liveSite}>
              <span
                onClick={playUiClick}
                className="w-full py-2.5 px-3 rounded-xl border border-white/10 bg-[#18181b] hover:bg-[#202024] hover:border-emerald-500/30 text-xs font-semibold text-emerald-400 hover:text-emerald-300 shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.99] select-none"
              >
                <span>Live Site</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </LinkPreview>
          ) : (
            <span className="w-full py-2.5 px-3 rounded-xl border border-white/5 bg-[#141414] text-xs font-medium text-zinc-500 flex items-center justify-center select-none">
              Demo on Request
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
