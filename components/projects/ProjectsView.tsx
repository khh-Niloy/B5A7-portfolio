"use client";

import React, { useState, useEffect } from "react";
import { ModernProjectCard } from "./ModernProjectCard";
import { RepoCard } from "./RepoCard";
import { Github } from "lucide-react";

interface ProjectItem {
  _id: string;
  projectName: string;
  shortDes: string;
  techStack: string[];
  image?: string;
  liveSite?: string;
  githubRepo?: string;
  projectType?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const defaultProjects: ProjectItem[] = [
  {
    _id: "6abcd99af74854517a94c551",
    projectName: "ProcureAI",
    image:
      "https://res.cloudinary.com/dwrvergmd/image/upload/v1790761369/60kxj6xi26a-1790761369555-screenshot-2026-09-30-at-3-36-51pm-png.png.png",
    shortDes:
      "AI-powered procurement management platform streamlining purchase workflows, vendor quotation comparisons, and intelligent decision support with Gemini AI.",
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
    _id: "696943e5232760dfe1d022be",
    projectName: "Realtime Notification System",
    image:
      "https://res.cloudinary.com/dwrvergmd/image/upload/v1768506891/37lumps5uqc-1768506890956-screenshot-2026-01-16-at-1-40-32am-png.png.png",
    shortDes:
      "High-performance alert platform eliminating polling delays through WebSocket room architecture, delivering instant category updates.",
    techStack: [
      "Reactjs",
      "Socket.IO",
      "Nodejs",
      "Express",
      "TypeScript",
      "MongoDB",
    ],
    liveSite: "https://realtime-notification-system-fronte.vercel.app/",
    githubRepo:
      "https://github.com/khh-Niloy/realtime-notification-system-frontend",
  },
  {
    _id: "68e3e6e2dc0d3b0b3e1b387a",
    projectName: "RaizMart",
    image:
      "https://res.cloudinary.com/dwrvergmd/image/upload/v1763124914/kkz2ic47kp-1763124914625-screenshot-2025-11-14-at-5-21-41pm-png.png.png",
    shortDes:
      "Full-stack marketplace with attribute-based variant generation, cash-on-delivery, comprehensive admin analytics, and role-based authentication.",
    techStack: [
      "Next.js 15",
      "TypeScript",
      "Redux Toolkit",
      "Express",
      "MongoDB",
      "Tailwind CSS",
    ],
    liveSite: "https://www.raizmart.com/",
    githubRepo: "https://github.com/khh-Niloy/raizmart-frontend",
  },
  {
    _id: "68e61edb644076265bb4c780",
    projectName: "LocalLens",
    image:
      "https://res.cloudinary.com/dwrvergmd/image/upload/v1766826692/m03702vk3ph-1766826692542-screenshot-2025-12-27-at-3-11-02pm-png.png.png",
    shortDes:
      "Real-time tourism marketplace connecting tourists with local guides with instant Socket.IO communication and Redis caching.",
    techStack: [
      "Next.js",
      "Node.js",
      "Express",
      "JWT",
      "TypeScript",
      "Postman",
      "Tailwind CSS",
    ],
    liveSite: "https://local-lens-frontend.vercel.app/",
    githubRepo: "https://github.com/khh-Niloy/localLens-backend-prisma",
  },
];

export function ProjectsView() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);

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

  // const openSourceRepos = [
  //   {
  //     owner: "khh-Niloy",
  //     name: "procureai-platform-frontend",
  //     description:
  //       "Modern Next.js & TypeScript frontend with multi-factor quote analysis dashboards and automated PDF generators.",
  //     language: "TypeScript",
  //     languageColor: "#3178C6",
  //     stars: 1,
  //     forks: 0,
  //     url: "https://github.com/khh-Niloy/procureai-platform-frontend",
  //   },
  //   {
  //     owner: "khh-Niloy",
  //     name: "procureai-platform-backend",
  //     description:
  //       "NestJS backend engine featuring structured Gemini AI reasoning pipelines and BullMQ asynchronous queues.",
  //     language: "TypeScript",
  //     languageColor: "#3178C6",
  //     stars: 1,
  //     forks: 0,
  //     url: "https://github.com/khh-Niloy/procureai-platform-backend",
  //   },
  //   {
  //     owner: "khh-Niloy",
  //     name: "realtime-notification-system-backend",
  //     description:
  //       "Socket.IO real-time notification engine with dynamic category rooms and durable MongoDB message history.",
  //     language: "JavaScript",
  //     languageColor: "#F7DF1E",
  //     stars: 1,
  //     forks: 0,
  //     url: "https://github.com/khh-Niloy/realtime-notification-system-backend",
  //   },
  //   {
  //     owner: "khh-Niloy",
  //     name: "localLens-backend-prisma",
  //     description:
  //       "Location-aware backend service using Prisma ORM and PostgreSQL for hyperlocal discovery.",
  //     language: "TypeScript",
  //     languageColor: "#3178C6",
  //     stars: 0,
  //     forks: 0,
  //     url: "https://github.com/khh-Niloy/localLens-backend-prisma",
  //   },
  // ];

  return (
    <div className="text-left">
      {/* 2-Column Project Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {(projects.length > 0 ? projects : defaultProjects).map((p) => (
          <ModernProjectCard
            key={p._id}
            id={p._id}
            projectName={p.projectName}
            shortDes={p.shortDes}
            techStack={p.techStack}
            image={p.image}
            liveSite={p.liveSite}
            githubRepo={p.githubRepo}
            initials={p.projectName.slice(0, 2).toUpperCase()}
          />
        ))}
      </div>

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
