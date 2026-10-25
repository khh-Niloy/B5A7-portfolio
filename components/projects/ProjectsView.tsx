"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ModernProjectCard } from "./ModernProjectCard";
import { Modal } from "@/components/modules/Projects/Modal";

interface ProjectItem {
  _id: string;
  projectName: string;
  shortDes?: string;
  overview?: string;
  tagline?: string;
  techStack: string[];
  image?: string;
  images?: string[];
  liveSite?: string;
  githubRepo?: string;
  frontendRepo?: string;
  backendRepo?: string;
  projectType?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const defaultProjects: ProjectItem[] = [
  {
    _id: "6add99ebd681fa3d0b844f2d",
    projectName: "DocHook RAG",
    tagline: "Document Intelligence & High-Speed Neural Retrieval Engine",
    image:
      "https://res.cloudinary.com/dwrvergmd/image/upload/v1790761369/60kxj6xi26a-1790761369555-screenshot-2026-09-30-at-3-36-51pm-png.png.png",
    overview:
      "DocHook RAG is an intelligent document Q&A platform that lets users upload large files (like PDFs, DOCX agreements, or policies) and ask questions to get instant, 100% grounded answers. Instead of letting AI guess or hallucinate answers, DocHook uses a two-stage search pipeline—combining MongoDB Atlas vector search with a Python Cross-Encoder neural reranker—to pinpoint the exact paragraphs needed before answering with Google Gemini 2.5 Flash.",
    shortDes:
      "DocHook RAG is an intelligent document Q&A platform that lets users upload large files and ask questions to get instant, 100% grounded answers using a two-stage search pipeline combining vector search with a Python Cross-Encoder neural reranker and Gemini 2.5 Flash.",
    techStack: [
      "NestJS 11",
      "TypeScript",
      "Python",
      "FastAPI",
      "MongoDB Atlas",
      "BullMQ",
      "Gemini 2.5 Flash",
    ],
    liveSite: "https://doc-hook-rag-frontend.vercel.app/",
    githubRepo: "https://github.com/khh-Niloy/doc-hook-RAG-frontend",
  },
  {
    _id: "6add99eed681fa3d0b844f2e",
    projectName: "ReleaseOps AI",
    tagline: "Autonomous AI CI/CD Failure Investigator with Gemini Tool Calling",
    image:
      "https://res.cloudinary.com/dwrvergmd/image/upload/v1790761369/60kxj6xi26a-1790761369555-screenshot-2026-09-30-at-3-36-51pm-png.png.png",
    overview:
      "ReleaseOps AI is an intelligent developer tool that automatically investigates failed GitHub Actions build and deployment pipelines. Instead of forcing engineers to read through thousands of lines of messy terminal logs, ReleaseOps uses Google Gemini AI with native autonomous tool calling to pinpoint what broke, extract the exact error lines, and recommend ready-to-use code fixes.",
    shortDes:
      "ReleaseOps AI is an intelligent developer tool that automatically investigates failed GitHub Actions build and deployment pipelines using Google Gemini AI with autonomous tool calling to pinpoint root causes and recommend ready-to-use code fixes.",
    techStack: [
      "NestJS",
      "TypeScript",
      "MongoDB",
      "GitHub Actions API",
      "Gemini AI (Tools)",
      "Next.js 16",
    ],
    liveSite: "https://ai-cicd-investigator-frontend.vercel.app/",
    githubRepo: "https://github.com/khh-Niloy/ai-cicd-investigator-frontend",
  },
  {
    _id: "6abcd99af74854517a94c551",
    projectName: "ProcureAI",
    image:
      "https://res.cloudinary.com/dwrvergmd/image/upload/v1790761369/60kxj6xi26a-1790761369555-screenshot-2026-09-30-at-3-36-51pm-png.png.png",
    overview:
      "ProcureAI is an AI-powered web platform that helps companies buy goods and services faster without messy paperwork and slow email chains. It brings team leaders, managers, procurement officers, and suppliers into one clear workflow: a team leader creates a purchase request, the manager approves it, and the procurement officer oversees quotes from vendors.",
    shortDes:
      "ProcureAI is an AI-powered web platform that helps companies buy goods and services faster without messy paperwork and slow email chains with automated quote evaluations and Gemini AI.",
    techStack: [
      "Next.js",
      "NestJS",
      "TypeScript",
      "PostgreSQL",
      "Gemini AI",
      "BullMQ",
    ],
    liveSite: "https://procureai-platform-frontend.vercel.app/",
    githubRepo: "https://github.com/khh-Niloy/procureai-platform-frontend",
  },
  {
    _id: "68e61edb644076265bb4c780",
    projectName: "LocalLens",
    image:
      "https://res.cloudinary.com/dwrvergmd/image/upload/v1766826692/m03702vk3ph-1766826692542-screenshot-2025-12-27-at-3-11-02pm-png.png.png",
    overview:
      "LocalLens is a real-time tourism platform that connects travelers with verified local guides for authentic tours, activities, and local experiences. Instead of relying on static guidebooks or slow booking agencies, travelers can discover nearby adventures, chat live with local guides, and book excursions instantly.",
    shortDes:
      "Real-time tourism marketplace connecting tourists with local guides with instant Socket.IO communication, Redis caching, and integrated SSLCommerz payment.",
    techStack: [
      "Next.js",
      "Node.js",
      "Express",
      "JWT",
      "TypeScript",
      "Redis",
      "Socket.IO",
    ],
    liveSite: "https://local-lens-frontend.vercel.app/",
    githubRepo: "https://github.com/khh-Niloy/localLens-backend-prisma",
  },
];

export function ProjectsView() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const searchParams = useSearchParams();
  const urlProjectId = searchParams?.get("project");

  const displayProjects = projects.length > 0 ? projects : defaultProjects;
  const isProjectInList = displayProjects.some((p) => p._id === urlProjectId);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/projects`);
        const result = await res.json();
        const data = result.data || [];
        const active = data.filter((p: ProjectItem) => p.isActive !== false);

        // Helper to extract creation timestamp (supporting createdAt or MongoDB ObjectId)
        const getProjectTime = (p: ProjectItem) => {
          if (p.createdAt) {
            const t = new Date(p.createdAt).getTime();
            if (!isNaN(t)) return t;
          }
          if (p._id && p._id.length >= 8) {
            const parsed = parseInt(p._id.substring(0, 8), 16) * 1000;
            if (!isNaN(parsed)) return parsed;
          }
          return 0;
        };

        // Sort descending (most recent first)
        const sorted = [...active].sort(
          (a, b) => getProjectTime(b) - getProjectTime(a)
        );

        if (sorted.length > 0) {
          setProjects(sorted);
        } else {
          setProjects(defaultProjects);
        }
      } catch {
        setProjects(defaultProjects);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="text-left">
      {/* 2-Column Project Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {displayProjects.map((p) => (
          <ModernProjectCard
            key={p._id}
            id={p._id}
            projectName={p.projectName}
            shortDes={p.shortDes}
            overview={p.overview}
            techStack={p.techStack}
            image={p.image}
            liveSite={p.liveSite}
            githubRepo={p.githubRepo}
            frontendRepo={p.frontendRepo}
            backendRepo={p.backendRepo}
            initials={p.projectName.slice(0, 2).toUpperCase()}
          />
        ))}
      </div>

      {/* Fallback standalone modal when a project URL is shared and not in the displayed list */}
      {urlProjectId && !isProjectInList && (
        <Modal id={urlProjectId} standalone />
      )}

      {/* Open Source Section */}
      {/* <div className="mt-14 pt-8 border-t border-white/5">
        <div className="flex items-center gap-2 mb-6">
          <Github className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-semibold text-white">Open Source</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {openSourceRepos.map((repo) => (
            <RepoCard
              key={repo.name}
              owner={repo.owner}
              name={repo.name}
              description={repo.description}
              language={repo.language}
              languageColor={repo.languageColor}
              stars={repo.stars}
              forks={repo.forks}
              url={repo.url}
            />
          ))}
        </div>
      </div> */}
    </div>
  );
}
