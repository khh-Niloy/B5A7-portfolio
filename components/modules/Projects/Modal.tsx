"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toArrayConvert } from "@/lib/ToArrayConvert";
import { ExternalLink, Github } from "lucide-react";
import { useState, useEffect } from "react";
import { Project } from "@/interfaces/interface";

export function Modal({ id }: { id: string }) {
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
      // Reset state when dialog closes
      setProject(null);
      setError(null);
    }
  }, [open, id]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="cursor-pointer" variant="outline">
          Details
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-2xl max-h-[70vh] overflow-y-auto bg-[#090D22]/95 border-[#3637497D]">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-400 text-sm mb-2">{error}</p>
            <p className="text-[#BEC1DD] text-xs">Please try again later</p>
          </div>
        ) : !project ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-[#BEC1DD] text-sm">No project data available</p>
          </div>
        ) : (
          <>
            <DialogHeader className="border-b border-[#3637497D]/50 pb-4 mb-3">
              <DialogTitle className="text-2xl font-semibold text-white">
                {project?.projectName || "Project Details"}
              </DialogTitle>
              {project?.tagline && (
                <p className="text-[#BEC1DD] text-sm font-light mt-1">
                  {project.tagline}
                </p>
              )}
            </DialogHeader>

            <div className="space-y-6">
              {(project?.liveSite ||
                project?.frontendRepo ||
                project?.backendRepo) && (
                <div className="flex items-center gap-3">
                  {project?.liveSite && (
                    <a
                      href={project.liveSite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#CBACF9] bg-[#13162d]/40 border border-[#3637497D] rounded-lg hover:bg-[#13162d]/60 hover:border-[#CBACF9]/30 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Site
                    </a>
                  )}
                  {project?.frontendRepo && (
                    <a
                      href={project.frontendRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#BEC1DD] bg-[#13162d]/40 border border-[#3637497D] rounded-lg hover:bg-[#13162d]/60 hover:border-[#BEC1DD]/30 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      Frontend repository
                    </a>
                  )}
                  {project?.backendRepo && (
                    <a
                      href={project.backendRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#BEC1DD] bg-[#13162d]/40 border border-[#3637497D] rounded-lg hover:bg-[#13162d]/60 hover:border-[#BEC1DD]/30 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      Backend repository
                    </a>
                  )}
                </div>
              )}

              {project?.technicalHighlights && (
                <div>
                  <h4 className="text-white font-medium mb-3 text-sm uppercase tracking-wider text-[#BEC1DD]">
                    Technical Highlights
                  </h4>
                  <ul className="space-y-2">
                    {project.technicalHighlights
                      .split(",")
                      .map((highlight, i) => (
                        <li
                          key={`highlight-${i}`}
                          className="text-[#BEC1DD] text-sm flex items-start gap-2"
                        >
                          <span className="text-[#CBACF9]">•</span>
                          <span>{highlight.trim()}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {project?.shortDes && (
                <div>
                  <h4 className="text-white font-medium mb-2 text-sm uppercase tracking-wider text-[#BEC1DD]">
                    Overview
                  </h4>
                  <p className="text-[#BEC1DD] leading-relaxed text-sm">
                    {project.shortDes}
                  </p>
                </div>
              )}

              {project?.problemSolution && (
                <div>
                  <h4 className="text-white font-medium mb-2 text-sm uppercase tracking-wider text-[#BEC1DD]">
                    Problem & Solution
                  </h4>
                  <p className="text-[#BEC1DD] leading-relaxed text-sm">
                    {project.problemSolution}
                  </p>
                </div>
              )}

              {toArrayConvert(project?.techStack).length > 0 && (
                <div>
                  <h4 className="text-white font-medium mb-3 text-sm uppercase tracking-wider text-[#BEC1DD]">
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {toArrayConvert(project?.techStack).map((t, i) => (
                      <span
                        key={`tech-${i}`}
                        className="px-3 py-1 bg-[#13162d]/60 text-[#BEC1DD] text-xs rounded-lg border border-[#3637497D]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {toArrayConvert(project?.features).length > 0 && (
                <div>
                  <h4 className="text-white font-medium mb-3 text-sm uppercase tracking-wider text-[#BEC1DD]">
                    Key Features
                  </h4>
                  <ul className="space-y-2 grid grid-cols-2">
                    {toArrayConvert(project?.features).map((f, i) => (
                      <li
                        key={`feat-${i}`}
                        className="text-[#BEC1DD] text-sm flex items-start gap-2"
                      >
                        <span className="text-[#CBACF9]">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project?.dependencies && (
                <div>
                  <h4 className="text-white font-medium mb-2 text-sm uppercase tracking-wider text-[#BEC1DD]">
                    Dependencies
                  </h4>
                  <p className="text-[#BEC1DD] leading-relaxed text-sm">
                    {project.dependencies}
                  </p>
                </div>
              )}

              {project?.responsibilities && (
                <div>
                  <h4 className="text-white font-medium mb-2 text-sm uppercase tracking-wider text-[#BEC1DD]">
                    Responsibilities
                  </h4>
                  <p className="text-[#BEC1DD] leading-relaxed text-sm">
                    {project.responsibilities}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
