"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toArrayConvert } from "@/lib/ToArrayConvert";
import { getSkillIcon } from "@/lib/skillsIconMap";
import {
  ExternalLink,
  Github,
  Check,
  Share2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Maximize2,
  X,
  Layers,
  Cpu,
  ShieldAlert,
  GitCommit,
  Sparkles,
  BookOpen,
  ArrowRight,
  Copy,
} from "lucide-react";
import { playUiClick } from "@/lib/sound";
import { Project } from "@/interfaces/interface";
import toast from "react-hot-toast";

// Lightweight markdown renderer for case study text, code blocks, lists, and inline links
function FormattedMarkdown({ content }: { content: string }) {
  if (!content) return null;

  // Split content into code blocks and normal text blocks
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 text-zinc-300 text-xs sm:text-sm leading-relaxed">
      {parts.map((part, index) => {
        if (part.startsWith("```")) {
          // Code block (e.g. ASCII diagram or snippet)
          const codeLines = part
            .replace(/^```[a-z]*\n?/, "")
            .replace(/\n?```$/, "");
          return (
            <div
              key={`code-${index}`}
              className="relative my-3 rounded-xl border border-white/10 bg-[#09090b] overflow-hidden shadow-inner group/code"
            >
              <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-white/5 bg-white/[0.02] text-[11px] font-mono text-zinc-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400/80 animate-pulse" />
                  <span>Architecture &amp; Flow Diagram</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playUiClick();
                    if (typeof navigator !== "undefined") {
                      navigator.clipboard.writeText(codeLines);
                      toast.success("Architecture diagram copied!");
                    }
                  }}
                  className="inline-flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  title="Copy diagram"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-4 text-[11px] sm:text-xs font-mono leading-relaxed text-emerald-300/90 overflow-x-auto [scrollbar-width:thin] select-all">
                <code>{codeLines}</code>
              </pre>
            </div>
          );
        }

        // Normal text block
        const paragraphs = part.split(/\n\s*\n/);
        return (
          <React.Fragment key={`text-${index}`}>
            {paragraphs.map((p, pIdx) => {
              const trimmed = p.trim();
              if (!trimmed) return null;

              // Check if heading 4
              if (trimmed.startsWith("#### ")) {
                return (
                  <h4
                    key={`h4-${pIdx}`}
                    className="text-sm sm:text-base font-bold text-white mt-4 mb-2 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                    <span>{trimmed.replace(/^####\s+/, "")}</span>
                  </h4>
                );
              }

              // Check if heading 3
              if (trimmed.startsWith("### ")) {
                return (
                  <h3
                    key={`h3-${pIdx}`}
                    className="text-base sm:text-lg font-bold text-white mt-5 mb-2 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                    <span>{trimmed.replace(/^###\s+/, "")}</span>
                  </h3>
                );
              }

              // Check if bullet or numbered list
              const lines = trimmed.split("\n");
              const isList = lines.every((line) => {
                const l = line.trim();
                return (
                  l.startsWith("- ") ||
                  l.startsWith("* ") ||
                  /^\d+\.\s/.test(l) ||
                  l === ""
                );
              });

              if (isList) {
                return (
                  <ul key={`ul-${pIdx}`} className="space-y-2 my-2 pl-0.5">
                    {lines.map((line, lIdx) => {
                      const cleanLine = line.trim();
                      if (!cleanLine) return null;
                      const isOrdered = /^\d+\.\s/.test(cleanLine);
                      const prefixMatch = cleanLine.match(/^(\d+\.)\s/);
                      const itemText = isOrdered
                        ? cleanLine.replace(/^\d+\.\s+/, "")
                        : cleanLine.replace(/^[-*]\s+/, "");

                      return (
                        <li
                          key={`li-${lIdx}`}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 leading-relaxed"
                        >
                          {isOrdered ? (
                            <span className="font-mono text-xs font-bold text-emerald-400 shrink-0 mt-0.5 min-w-[18px]">
                              {prefixMatch ? prefixMatch[1] : "•"}
                            </span>
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80 shrink-0 mt-2 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                          )}
                          <div className="flex-1">
                            {parseInlineMarkdown(itemText)}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                );
              }

              return (
                <p
                  key={`p-${pIdx}`}
                  className="text-zinc-300 text-xs sm:text-sm leading-relaxed"
                >
                  {parseInlineMarkdown(trimmed)}
                </p>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function parseInlineMarkdown(text: string): React.ReactNode {
  const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\)|`.*?`)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-[#1c1c1f] text-emerald-300 font-mono text-[11px] border border-white/10"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 underline hover:text-emerald-300 inline-flex items-center gap-0.5 font-medium"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

export function Modal({
  id,
  triggerClassName,
  standalone = false,
}: {
  id: string;
  triggerClassName?: string;
  standalone?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const urlProjectId = searchParams?.get("project");

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedDetails, setCopiedDetails] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("section-overview");

  // Sync open state with URL query parameter (?project=...)
  useEffect(() => {
    if (urlProjectId === id) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [urlProjectId, id]);

  const handleOpenModal = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    playUiClick();
    setOpen(true);
    const params = new URLSearchParams(
      searchParams ? searchParams.toString() : "",
    );
    params.set("project", id);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    const params = new URLSearchParams(
      searchParams ? searchParams.toString() : "",
    );
    if (isOpen) {
      params.set("project", id);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    } else {
      params.delete("project");
      const query = params.toString();
      const newUrl = query ? `${pathname}?${query}` : pathname;
      router.push(newUrl, { scroll: false });
    }
  };

  const handleCopyShareLink = async () => {
    playUiClick();
    try {
      const shareUrl = `${window.location.origin}${pathname}?project=${id}`;
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else if (typeof document !== "undefined") {
        const input = document.createElement("input");
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      setCopied(true);
      toast.success("Project share link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error("Failed to copy link");
    }
  };

  // Copies all project information, links, and case study sections as formatted text
  const handleCopyAllDetails = async () => {
    if (!project) return;
    playUiClick();
    try {
      const sections: string[] = [];

      // Title & Tagline
      sections.push(`# ${project.projectName || "Project Details"}`);
      if (project.tagline) {
        sections.push(`> ${project.tagline}`);
      }

      // Metadata
      const meta: string[] = [];
      if (project.role) meta.push(`• Role: ${project.role}`);
      if (project.status) meta.push(`• Status: ${project.status}`);
      if (project.projectType) meta.push(`• Type: ${project.projectType}`);
      const stack = toArrayConvert(project.techStack);
      if (stack.length > 0) meta.push(`• Tech Stack: ${stack.join(", ")}`);
      if (meta.length > 0) {
        sections.push(`\n### Overview\n${meta.join("\n")}`);
      }

      // Links & Repositories
      const links: string[] = [];
      if (project.liveSite) links.push(`• Live Site: ${project.liveSite}`);
      if (project.backendLive) links.push(`• Backend API: ${project.backendLive}`);
      if (project.frontendRepo) links.push(`• Frontend Repo: ${project.frontendRepo}`);
      if (project.backendRepo) links.push(`• Backend Repo: ${project.backendRepo}`);
      if (project.githubRepo) links.push(`• GitHub Repo: ${project.githubRepo}`);
      if (project.rerankerRepo) links.push(`• Reranker Repo: ${project.rerankerRepo}`);
      if (project.demoCheckerRepo) links.push(`• Demo Checker Repo: ${project.demoCheckerRepo}`);
      if (links.length > 0) {
        sections.push(`\n### Links & Repositories\n${links.join("\n")}`);
      }

      // Technical Highlights
      if (project.technicalHighlights) {
        sections.push(`\n### Technical Highlights\n${project.technicalHighlights}`);
      }

      // Case Study Section 1: Overview
      if (project.overview) {
        sections.push(`\n### Case Study: 1. Overview\n${project.overview}`);
      }

      // Case Study Section 2: Problem
      if (project.problem) {
        sections.push(`\n### Case Study: 2. Problem Statement\n${project.problem}`);
      }

      // Case Study Section 3: My Contribution
      if (project.myContribution) {
        sections.push(`\n### Case Study: 3. Key Contribution\n${project.myContribution}`);
      }

      // Case Study Section 4: Key Decisions
      if (project.keyDecisions) {
        sections.push(`\n### Case Study: 4. Key Engineering Decisions\n${project.keyDecisions}`);
      }

      // Case Study Section 5: Results & Evidence
      if (project.resultsEvidence) {
        sections.push(`\n### Case Study: 5. Results & Evidence\n${project.resultsEvidence}`);
      }

      // Architecture
      if (project.architecture) {
        sections.push(`\n### Architecture & Flow\n${project.architecture}`);
      }

      // Limitations & Next Steps
      if (project.limitationsNextSteps) {
        sections.push(`\n### Case Study: Limitations & Next Steps\n${project.limitationsNextSteps}`);
      }

      // Features
      if (project.features && project.features.length > 0) {
        const featureList = toArrayConvert(project.features);
        if (featureList.length > 0) {
          sections.push(`\n### Key Features\n${featureList.map((f) => `• ${f}`).join("\n")}`);
        }
      }

      // Problem & Solution
      if (project.problemSolution) {
        sections.push(`\n### Problem & Solution\n${project.problemSolution}`);
      }

      const fullDetails = sections.join("\n\n");

      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullDetails);
      } else if (typeof document !== "undefined") {
        const textarea = document.createElement("textarea");
        textarea.value = fullDetails;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopiedDetails(true);
      toast.success("All project details copied to clipboard!");
      setTimeout(() => setCopiedDetails(false), 2500);
    } catch (err) {
      console.error("Failed to copy project details:", err);
      toast.error("Failed to copy project details");
    }
  };

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

  const galleryImages: string[] =
    project?.images && project.images.length > 0
      ? project.images
      : project?.image
        ? [project.image]
        : [];

  // Reset active image when project loads or changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [project?._id, open]);

  // Close lightbox when parent modal closes
  useEffect(() => {
    if (!open) {
      setIsLightboxOpen(false);
    }
  }, [open]);

  // Capture keyboard navigation & Escape for lightbox with capture phase to stop modal close
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveImageIndex((prev) =>
          prev > 0 ? prev - 1 : galleryImages.length - 1,
        );
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveImageIndex((prev) =>
          prev < galleryImages.length - 1 ? prev + 1 : 0,
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isLightboxOpen, galleryImages.length]);

  // Available case study sections for sticky navigation
  const availableSections = useMemo(() => {
    if (!project) return [];
    const sections: { id: string; number: string; title: string }[] = [];
    if (project.overview || project.shortDes) {
      sections.push({ id: "section-overview", number: "01", title: "Overview" });
    }
    if (project.problem || project.problemSolution) {
      sections.push({ id: "section-problem", number: "02", title: "Problem" });
    }
    if (project.myContribution || project.responsibilities) {
      sections.push({
        id: "section-contribution",
        number: "03",
        title: "Contribution",
      });
    }
    if (project.architecture) {
      sections.push({
        id: "section-architecture",
        number: "04",
        title: "Architecture",
      });
    }
    if (project.keyDecisions) {
      sections.push({
        id: "section-decisions",
        number: "05",
        title: "Key Decisions",
      });
    }
    if (project.resultsEvidence) {
      sections.push({
        id: "section-results",
        number: "06",
        title: "Results & Evidence",
      });
    }
    if (project.limitationsNextSteps) {
      sections.push({
        id: "section-next-steps",
        number: "07",
        title: "Limitations & Next Steps",
      });
    }
    return sections;
  }, [project]);

  const scrollToSection = (sectionId: string) => {
    playUiClick();
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (availableSections.length === 0) return;
    const container = e.currentTarget;
    const containerTop = container.getBoundingClientRect().top;
    for (let i = availableSections.length - 1; i >= 0; i--) {
      const el = document.getElementById(availableSections[i].id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top - containerTop <= 110) {
          setActiveSection(availableSections[i].id);
          break;
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!standalone && (
        <DialogTrigger asChild>
          <button
            type="button"
            onClick={handleOpenModal}
            className={`w-full py-2.5 px-4 rounded-xl border border-white/10 bg-[#18181b] hover:bg-[#202024] hover:border-emerald-500/30 text-xs font-semibold text-zinc-200 hover:text-white shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.99] select-none ${
              triggerClassName || ""
            }`}
          >
            <span>Details</span>
          </button>
        </DialogTrigger>
      )}

      <DialogContent
        onEscapeKeyDown={(e) => {
          if (isLightboxOpen) {
            e.preventDefault();
            setIsLightboxOpen(false);
          }
        }}
        onPointerDownOutside={(e) => {
          if (isLightboxOpen) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if (isLightboxOpen) {
            e.preventDefault();
          }
        }}
        onScroll={handleScroll}
        className="w-[94%] sm:w-full max-w-3xl lg:max-w-4xl max-h-[88vh] overflow-y-auto bg-[#121214] border border-white/10 rounded-2xl p-5 sm:p-7 shadow-2xl [scrollbar-width:none]"
      >
        {/* Subtle glowing emerald accent top bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none" />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
            <span className="text-xs text-zinc-400">
              Loading project details...
            </span>
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
              <div className="flex items-start justify-between gap-3 pr-8">
                <div className="space-y-1.5">
                  <DialogTitle className="text-2xl font-bold tracking-tight text-white">
                    {project?.projectName || "Project Details"}
                  </DialogTitle>
                  {project?.tagline && (
                    <p className="text-sm text-zinc-400 font-normal leading-relaxed">
                      {project.tagline}
                    </p>
                  )}
                  {/* Role & Status badges */}
                  {(project?.role || project?.status) && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {project?.role && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>{project.role}</span>
                        </span>
                      )}
                      {project?.status && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/25 px-2.5 py-0.5 rounded-full">
                          <span>Status: {project.status}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyAllDetails}
                    className="inline-flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-[#18181b] hover:bg-[#202024] border border-white/10 hover:border-emerald-500/40 rounded-xl transition-all shadow-sm cursor-pointer select-none active:scale-95"
                    title="Copy all project details to clipboard"
                  >
                    {copiedDetails ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Copy Details</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className="inline-flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-[#18181b] hover:bg-[#202024] border border-white/10 hover:border-emerald-500/40 rounded-xl transition-all shadow-sm cursor-pointer select-none active:scale-95"
                    title="Copy shareable link"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Share</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 text-left">
              {/* Project Images Gallery / Carousel */}
              {galleryImages.length > 0 && (
                <div className="space-y-3">
                  <div
                    onClick={() => {
                      playUiClick();
                      setIsLightboxOpen(true);
                    }}
                    className="relative w-full h-64 sm:h-80 md:h-[370px] lg:h-[410px] overflow-hidden rounded-xl border border-white/10 bg-[#0e0e10] shadow-inner group/gallery select-none cursor-pointer"
                    title="Click to view full image"
                  >
                    <img
                      src={galleryImages[activeImageIndex] || galleryImages[0]}
                      alt={`${project?.projectName || "Project"} preview ${activeImageIndex + 1}`}
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/gallery:scale-[1.01]"
                    />

                    {/* Tap to see full image button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playUiClick();
                        setIsLightboxOpen(true);
                      }}
                      className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black/90 border border-white/20 text-white/90 hover:text-white backdrop-blur-md text-xs font-medium transition-all duration-200 flex items-center gap-1.5 shadow-lg active:scale-95 cursor-pointer hover:border-emerald-500/50 hover:text-emerald-300 z-10"
                      title="Tap to see full image"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="hidden sm:inline">
                        Tap to see full image
                      </span>
                      <span className="sm:hidden">Full Image</span>
                    </button>

                    {/* Subtle hover overlay hint */}
                    <div className="absolute inset-0 bg-black/15 opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-200 pointer-events-none flex items-center justify-center">
                      <span className="px-3.5 py-1.5 rounded-full bg-black/75 border border-white/25 text-white text-xs font-medium backdrop-blur-md flex items-center gap-1.5 shadow-2xl">
                        <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Click to see full image</span>
                      </span>
                    </div>

                    {galleryImages.length > 1 && (
                      <>
                        {/* Prev Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playUiClick();
                            setActiveImageIndex((prev) =>
                              prev > 0 ? prev - 1 : galleryImages.length - 1,
                            );
                          }}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/85 border border-white/15 text-white/90 hover:text-white backdrop-blur-md transition-all shadow-lg active:scale-90 cursor-pointer"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        {/* Next Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playUiClick();
                            setActiveImageIndex((prev) =>
                              prev < galleryImages.length - 1 ? prev + 1 : 0,
                            );
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/85 border border-white/15 text-white/90 hover:text-white backdrop-blur-md transition-all shadow-lg active:scale-90 cursor-pointer"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>

                        {/* Counter Badge */}
                        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/70 border border-white/15 backdrop-blur-md text-[11px] font-mono text-zinc-200 flex items-center gap-1.5 shadow-md">
                          <ImageIcon className="w-3 h-3 text-emerald-400" />
                          <span>
                            {activeImageIndex + 1} / {galleryImages.length}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Navigation Strip */}
                  {galleryImages.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 [scrollbar-width:none]">
                      {galleryImages.map((img, idx) => (
                        <button
                          key={`thumb-${idx}`}
                          type="button"
                          onClick={() => {
                            playUiClick();
                            setActiveImageIndex(idx);
                          }}
                          className={`relative shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden border transition-all duration-200 cursor-pointer ${
                            idx === activeImageIndex
                              ? "border-emerald-400 ring-2 ring-emerald-400/50 shadow-[0_0_10px_rgba(52,211,153,0.4)] scale-105"
                              : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/30"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover object-top"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Action Links Row */}
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
                {(project as any)?.backendLive && (
                  <a
                    href={(project as any).backendLive}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={playUiClick}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-zinc-300 bg-[#18181b] border border-white/10 rounded-xl hover:border-white/20 hover:text-white transition-all shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Backend API</span>
                  </a>
                )}
                {(project as any)?.rerankerRepo && (
                  <a
                    href={(project as any).rerankerRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={playUiClick}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-zinc-300 bg-[#18181b] border border-white/10 rounded-xl hover:border-white/20 hover:text-white transition-all shadow-sm"
                  >
                    <Github className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Reranker Repo</span>
                  </a>
                )}
                {(project as any)?.demoCheckerRepo && (
                  <a
                    href={(project as any).demoCheckerRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={playUiClick}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-zinc-300 bg-[#18181b] border border-white/10 rounded-xl hover:border-white/20 hover:text-white transition-all shadow-sm"
                  >
                    <Github className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Demo Checker</span>
                  </a>
                )}
                {!project?.frontendRepo &&
                  !project?.backendRepo &&
                  project?.githubRepo && (
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

                <button
                  type="button"
                  onClick={handleCopyAllDetails}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-zinc-300 bg-[#18181b] border border-white/10 rounded-xl hover:border-emerald-500/30 hover:text-white transition-all shadow-sm cursor-pointer select-none active:scale-95"
                  title="Copy all project details to clipboard"
                >
                  {copiedDetails ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Details Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Copy All Details</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-zinc-300 bg-[#18181b] border border-white/10 rounded-xl hover:border-emerald-500/30 hover:text-white transition-all shadow-sm cursor-pointer select-none active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied Link</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Share Project</span>
                    </>
                  )}
                </button>
              </div>

              {/* FIXED BUTTONS TO NAVIGATE EACH SECTION (WRAPPING CLEANLY) */}
              {availableSections.length > 0 && (
                <div className="sticky top-0 z-20 py-2.5 bg-[#121214]/95 backdrop-blur-md border-y border-white/10 flex flex-wrap items-center gap-1.5 shadow-lg">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mr-1 hidden sm:inline">
                    Jump to:
                  </span>
                  {availableSections.map((sec) => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => scrollToSection(sec.id)}
                      className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none flex items-center gap-1.5 ${
                        activeSection === sec.id
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(52,211,153,0.3)]"
                          : "bg-[#18181b] text-zinc-400 hover:text-white border border-white/5 hover:border-white/20"
                      }`}
                    >
                      <span className="text-[10px] opacity-70 font-mono">
                        {sec.number}
                      </span>
                      <span>{sec.title}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Technical Highlights list */}
              {project?.technicalHighlights && (
                <div className="rounded-xl border border-white/5 bg-[#141414] p-4">
                  <div className="flex items-center gap-2 mb-2.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
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

              {/* 1. OVERVIEW */}
              {(project?.overview || project?.shortDes) && (
                <div id="section-overview" className="scroll-mt-20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                    <span>1. Overview</span>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-[#141414] p-4 sm:p-5">
                    <FormattedMarkdown
                      content={project.overview || project.shortDes || ""}
                    />
                  </div>
                </div>
              )}

              {/* 2. PROBLEM */}
              {(project?.problem || project?.problemSolution) && (
                <div id="section-problem" className="scroll-mt-20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                    <span>2. Problem</span>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-[#141414] p-4 sm:p-5">
                    <FormattedMarkdown
                      content={project.problem || project.problemSolution || ""}
                    />
                  </div>
                </div>
              )}

              {/* 3. MY CONTRIBUTION */}
              {(project?.myContribution || project?.responsibilities) && (
                <div id="section-contribution" className="scroll-mt-20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <GitCommit className="w-3.5 h-3.5 text-emerald-400" />
                    <span>3. My Contribution</span>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-[#141414] p-4 sm:p-5">
                    <FormattedMarkdown
                      content={
                        project.myContribution ||
                        project.responsibilities ||
                        ""
                      }
                    />
                  </div>
                </div>
              )}

              {/* 4. ARCHITECTURE */}
              {project?.architecture && (
                <div id="section-architecture" className="scroll-mt-20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                    <span>4. Architecture &amp; System Flow</span>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-[#141414] p-4 sm:p-5">
                    <FormattedMarkdown content={project.architecture} />
                  </div>
                </div>
              )}

              {/* 5. THREE KEY ENGINEERING DECISIONS */}
              {project?.keyDecisions && (
                <div id="section-decisions" className="scroll-mt-20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    <span>5. Key Engineering Decisions</span>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-[#141414] p-4 sm:p-5">
                    <FormattedMarkdown content={project.keyDecisions} />
                  </div>
                </div>
              )}

              {/* 6. RESULTS AND EVIDENCE */}
              {project?.resultsEvidence && (
                <div id="section-results" className="scroll-mt-20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>6. Results and Evidence</span>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-[#141414] p-4 sm:p-5">
                    <FormattedMarkdown content={project.resultsEvidence} />
                  </div>
                </div>
              )}

              {/* 7. LIMITATIONS AND NEXT STEPS */}
              {project?.limitationsNextSteps && (
                <div id="section-next-steps" className="scroll-mt-20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                    <span>7. Limitations and Next Steps</span>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-[#141414] p-4 sm:p-5">
                    <FormattedMarkdown content={project.limitationsNextSteps} />
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
                          {icon && (
                            <span className="text-xs shrink-0">{icon}</span>
                          )}
                          <span>{t}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Key Features (Legacy / Supplementary) */}
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

              {/* Dependencies (Legacy / Supplementary) */}
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
            </div>
          </>
        )}
      </DialogContent>

      {/* Fullscreen Lightbox / Full-Image Viewer */}
      {isLightboxOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex flex-col justify-between bg-black/95 backdrop-blur-xl p-3 sm:p-6 animate-in fade-in duration-200 select-none"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(false);
            }}
          >
            {/* Top Bar */}
            <div
              className="flex items-center justify-between gap-3 w-full max-w-7xl mx-auto z-10 pt-1"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm sm:text-base font-semibold text-white tracking-tight">
                  {project?.projectName || "Project Preview"}
                </span>
                {galleryImages.length > 1 && (
                  <span className="text-xs font-mono text-zinc-300 bg-white/10 border border-white/15 px-2.5 py-0.5 rounded-full">
                    {activeImageIndex + 1} / {galleryImages.length}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={galleryImages[activeImageIndex] || galleryImages[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-zinc-200 hover:text-white transition-all text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                  title="Open original image in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Open Original</span>
                </a>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playUiClick();
                    setIsLightboxOpen(false);
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/20 hover:text-rose-400 border border-white/10 text-zinc-300 transition-all cursor-pointer"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Image Display */}
            <div
              className="relative flex items-center justify-center flex-1 w-full max-w-7xl mx-auto my-3 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleryImages[activeImageIndex] || galleryImages[0]}
                alt={`${project?.projectName || "Project"} full screenshot ${activeImageIndex + 1}`}
                className="max-w-full max-h-[72vh] sm:max-h-[78vh] object-contain rounded-xl shadow-2xl transition-all duration-200"
              />

              {galleryImages.length > 1 && (
                <>
                  {/* Prev Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playUiClick();
                      setActiveImageIndex((prev) =>
                        prev > 0 ? prev - 1 : galleryImages.length - 1,
                      );
                    }}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 text-white backdrop-blur-md transition-all shadow-xl active:scale-90 cursor-pointer hover:border-emerald-500/50"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playUiClick();
                      setActiveImageIndex((prev) =>
                        prev < galleryImages.length - 1 ? prev + 1 : 0,
                      );
                    }}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 text-white backdrop-blur-md transition-all shadow-xl active:scale-90 cursor-pointer hover:border-emerald-500/50"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Controls & Thumbnail Strip */}
            <div
              className="w-full max-w-7xl mx-auto flex flex-col items-center gap-2 z-10 pb-1"
              onClick={(e) => e.stopPropagation()}
            >
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 px-2 [scrollbar-width:none]">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={`lightbox-thumb-${idx}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playUiClick();
                        setActiveImageIndex(idx);
                      }}
                      className={`relative shrink-0 w-16 h-11 sm:w-20 sm:h-14 rounded-lg overflow-hidden border transition-all duration-200 cursor-pointer ${
                        idx === activeImageIndex
                          ? "border-emerald-400 ring-2 ring-emerald-400/50 shadow-md scale-105"
                          : "border-white/20 opacity-50 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover object-top"
                      />
                    </button>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Use{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-[10px]">
                  ←
                </kbd>{" "}
                /{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-[10px]">
                  →
                </kbd>{" "}
                arrow keys to navigate ·{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-[10px]">
                  ESC
                </kbd>{" "}
                or click outside to close
              </p>
            </div>
          </div>,
          document.body,
        )}
    </Dialog>
  );
}
