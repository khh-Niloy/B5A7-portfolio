"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toArrayConvert } from "@/lib/ToArrayConvert";
import { getSkillIcon } from "@/lib/skillsIconMap";
import { ExternalLink, Github, Check } from "lucide-react";
import { playUiClick } from "@/lib/sound";
import { Project } from "@/interfaces/interface";

export function Modal({
  id,
  triggerClassName,
}: {
  id: string;
  triggerClassName?: string;
}) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && id && id.trim() !== "") {
      setLoading(true);
      setError(null);
      setProject(null);
      fetch(`${process.env.NEXT_PUBLIC_BASE_API}/projects/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch project: ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.data) {
            setProject(data.data);
          } else {
            setError("Project data not found");
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch project:", error);
          setError(error.message || "Failed to load project details");
          setLoading(false);
        });
    } else if (!open) {
      setProject(null);
      setError(null);
    }
  }, [open, id]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          onClick={playUiClick}
          className={`w-full py-2.5 px-4 rounded-xl border border-white/10 bg-[#18181b] hover:bg-[#202024] hover:border-emerald-500/30 text-xs font-semibold text-zinc-200 hover:text-white shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.99] select-none ${
            triggerClassName || ""
          }`}
        >
          <span>Details</span>
        </button>
      </DialogTrigger>

      <DialogContent className="w-[94%] sm:w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#121214] border border-white/10 rounded-2xl p-5 sm:p-7 shadow-2xl [scrollbar-width:none]">
        {/* Subtle glowing emerald accent top bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none" />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
            <span className="text-xs text-zinc-400">Loading project details...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <p className="text-red-400 text-sm mb-2 font-medium">{error}</p>
            <p className="text-zinc-400 text-xs">Please try again later</p>
          </div>
        ) : !project ? (
          <div className="flex items-center justify-center py-14">
            <p className="text-zinc-400 text-sm">No project data available</p>
          </div>
        ) : (
          <>
            <DialogHeader className="border-b border-white/10 pb-4 mb-1 text-left">
              <DialogTitle className="text-2xl font-bold tracking-tight text-white">
                {project?.projectName || "Project Details"}
              </DialogTitle>
              {project?.tagline && (
                <p className="text-sm text-zinc-400 font-normal mt-1 leading-relaxed">
                  {project.tagline}
                </p>
              )}
            </DialogHeader>

            <div className="space-y-6 text-left">
              {/* Optional Project Hero Image */}
              {project?.image && (
                <div className="relative w-full h-44 sm:h-56 overflow-hidden rounded-xl border border-white/10 bg-[#141414] shadow-inner">
                  <img
                    src={project.image}
                    alt={project.projectName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              )}

              {/* Action Links Row */}
              {(project?.liveSite ||
                project?.frontendRepo ||
                project?.backendRepo ||
                project?.githubRepo) && (
                <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                  {project?.liveSite && (
                    <a
                      href={project.liveSite}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playUiClick}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Live Site</span>
                    </a>
                  )}
                  {project?.frontendRepo && (
                    <a
                      href={project.frontendRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playUiClick}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-zinc-300 bg-[#18181b] border border-white/10 rounded-xl hover:border-white/20 hover:text-white transition-all shadow-sm"
                    >
                      <Github className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Frontend Repo</span>
                    </a>
                  )}
                  {project?.backendRepo && (
                    <a
                      href={project.backendRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playUiClick}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-zinc-300 bg-[#18181b] border border-white/10 rounded-xl hover:border-white/20 hover:text-white transition-all shadow-sm"
                    >
                      <Github className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Backend Repo</span>
                    </a>
                  )}
                  {!project?.frontendRepo && !project?.backendRepo && project?.githubRepo && (
                    <a
                      href={project.githubRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playUiClick}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-zinc-300 bg-[#18181b] border border-white/10 rounded-xl hover:border-white/20 hover:text-white transition-all shadow-sm"
                    >
                      <Github className="w-3.5 h-3.5 text-zinc-400" />
                      <span>GitHub Repo</span>
                    </a>
                  )}
                </div>
              )}

              {/* Technical Highlights */}
              {project?.technicalHighlights && (
                <div>
                  <div className="flex items-center gap-2 mb-2.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                    <span>Technical Highlights</span>
                  </div>
                  <ul className="space-y-2">
                    {project.technicalHighlights
                      .split(",")
                      .map((highlight, i) => (
                        <li
                          key={`highlight-${i}`}
                          className="text-zinc-300 text-xs sm:text-sm flex items-start gap-2.5 leading-relaxed"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80 shrink-0 mt-2 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                          <span>{highlight.trim()}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Overview */}
              {project?.shortDes && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                    <span>Overview</span>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-[#141414] p-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {project.shortDes}
                  </div>
                </div>
              )}

              {/* Problem & Solution */}
              {project?.problemSolution && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                    <span>Problem & Solution</span>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-[#141414] p-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {project.problemSolution}
                  </div>
                </div>
              )}

              {/* Tech Stack */}
              {toArrayConvert(project?.techStack).length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                    <span>Tech Stack</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {toArrayConvert(project?.techStack).map((t, i) => {
                      const { icon } = getSkillIcon(t);
                      return (
                        <span
                          key={`tech-${i}`}
                          className="inline-flex items-center gap-1.5 rounded-full border-t border-white/40 bg-gradient-to-b from-[#313134] to-[#101011] px-3.5 py-1 text-xs font-medium text-white shadow-sm"
                        >
                          {icon && <span className="text-xs shrink-0">{icon}</span>}
                          <span>{t}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Key Features */}
              {toArrayConvert(project?.features).length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                    <span>Key Features</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {toArrayConvert(project?.features).map((f, i) => (
                      <div
                        key={`feat-${i}`}
                        className="flex items-start gap-2.5 p-3 rounded-xl border border-white/5 bg-[#141414] text-xs text-zinc-300 leading-relaxed"
                      >
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dependencies */}
              {project?.dependencies && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                    <span>Dependencies</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 rounded-xl border border-white/5 bg-[#141414] p-3.5">
                    {project.dependencies.split(",").map((dep, i) => (
                      <span
                        key={`dep-${i}`}
                        className="inline-flex items-center rounded-md border border-white/5 bg-[#1c1c1f] px-2.5 py-1 text-[11px] font-mono text-zinc-300"
                      >
                        {dep.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Responsibilities */}
              {project?.responsibilities && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                    <span>Responsibilities</span>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-[#141414] p-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {project.responsibilities}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
