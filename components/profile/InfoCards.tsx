"use client";

import React from "react";
import { LiveClock } from "../shell/LiveClock";
import {
  Check,
  GraduationCap,
  MapPin,
  Laptop,
  Milestone,
  Award,
  ExternalLink,
} from "lucide-react";
import { usePortfolio } from "@/components/portfolio/PortfolioContext";

export function InfoCards() {
  const { data } = usePortfolio();

  const workValues =
    data?.workValues && data.workValues.length > 0
      ? data.workValues
      : ["High ownership", "Clean architecture", "Continuous learner"];

  const remoteText =
    data?.remoteText ||
    "Comfortable across global teams, shipping robust code with disciplined ownership.";

  const location = data?.location || "Dhaka, Bangladesh";

  const journeyMilestones =
    data?.journey && data.journey.length > 0
      ? data.journey.map((j) => ({
          year: j.year,
          title: j.title,
          desc: (j as any).desc || (j as any).description || "",
        }))
      : [
          {
            year: "2026",
            title: "Backend Architecture & AI Systems",
            desc: "Expanding into high-concurrency systems, background workers (BullMQ/Redis), and production AI integrations.",
          },
          {
            year: "2025",
            title: "Industry Transition @ Lint Technologies",
            desc: "Stepped into professional software development, promoted from intern to full-stack engineer.",
          },
          {
            year: "2024",
            title: "Production Projects with Modern Web Stack",
            desc: "Mastered full-stack engineering, strict deadline management, and scalable cloud architectures.",
          },
          {
            year: "2022",
            title: "Problem Solving & Algorithms",
            desc: "Deepened algorithmic problem solving on Codeforces and Beecrowd using C and C++.",
          },
        ];

  const educationList =
    data?.education && data.education.length > 0
      ? data.education
      : data?.universityInfo
      ? [data.universityInfo]
      : [
          {
            varsity: "Daffodil International University",
            department: "BSc in Software Engineering",
            degree: "BSc in Software Engineering",
            startYear: "2023",
            endYear: "2027",
          },
        ];

  const certifications = data?.certifications || [];

  return (
    <div className="mt-8 flex flex-col gap-5">
      {/* Row 1: 2 Cards Side-by-Side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 2: Remote/Work Values */}
        <div className="rounded-2xl border border-white/5 bg-[#141414] p-5">
          <div className="flex items-center gap-1.5 text-white font-semibold text-sm">
            <Laptop className="h-4 w-4 text-emerald-400" />
            <span>Remote-First</span>
          </div>

          <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
            {remoteText}
          </p>

          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {workValues.map((val) => (
              <span
                key={val}
                className="inline-flex items-center gap-1 rounded-full border border-white/5 bg-[#1c1c1c] px-2.5 py-0.5 text-[11px] font-medium text-zinc-300"
              >
                <Check className="h-3 w-3 text-emerald-400" />
                <span>{val}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Card 1: Based in */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-[#121c16] via-[#141414] to-[#121212] p-5 shadow-[0_0_30px_rgba(16,185,129,0.06)]">
          <div className="flex items-center gap-1.5 text-zinc-300 text-sm font-medium mb-3">
            <MapPin className="h-4 w-4 text-emerald-400" />
            <span>{location}</span>
          </div>

          <LiveClock />
        </div>
      </div>

      {/* Growth & Journey Milestones */}
      {journeyMilestones.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center gap-2.5 mb-4">
            <Milestone className="h-6 w-6 text-emerald-400" />
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Growth &amp; Journey Milestones
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {journeyMilestones.map((j) => (
              <div
                key={`${j.year}-${j.title}`}
                className="rounded-xl border border-white/5 bg-[#141414] p-3.5 hover:border-white/10 transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">
                    {j.year}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/60" />
                </div>
                <h4 className="mt-1.5 text-xs font-semibold text-zinc-200">
                  {j.title}
                </h4>
                <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">
                  {j.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      {educationList.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center gap-2.5 mb-4">
            <GraduationCap className="h-6 w-6 text-emerald-400" />
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Education
            </h2>
          </div>

          <div className="space-y-3">
            {educationList.map((edu, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/5 bg-[#141414] p-5 text-left"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {(edu as any).university || (edu as any).varsity}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {edu.degree || edu.department}
                    </p>
                  </div>
                  {(edu.startYear || edu.endYear) && (
                    <span className="inline-flex self-start sm:self-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
                      {edu.startYear} — {edu.endYear || "Present"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications Section (if configured) */}
      {certifications.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center gap-2.5 mb-4">
            <Award className="h-6 w-6 text-emerald-400" />
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Certifications
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/5 bg-[#141414] p-4 hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-semibold text-white">
                      {cert.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {cert.issuer} {cert.issueDate ? `· ${cert.issueDate}` : ""}
                    </p>
                  </div>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
