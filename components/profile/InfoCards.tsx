"use client";

import React from "react";
import { LiveClock } from "../shell/LiveClock";
import { Check, GraduationCap, MapPin, Laptop, Milestone } from "lucide-react";

export function InfoCards() {
  const workValues = [
    "High ownership",
    "Clean architecture",
    "Continuous learner",
  ];

  const journeyMilestones = [
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

  return (
    <div className="mt-8 flex flex-col gap-5">
      {/* Row 1: 2 Cards Side-by-Side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 2: Works */}
        <div className="rounded-2xl border border-white/5 bg-[#141414] p-5">
          <div className="flex items-center gap-1.5 text-white font-semibold text-sm">
            <Laptop className="h-4 w-4 text-emerald-400" />
            <span>Remote-First</span>
          </div>

          <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
            Comfortable across global teams, shipping robust code with
            disciplined ownership.
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
            <span>Dhaka, Bangladesh</span>
          </div>

          <LiveClock />
        </div>
      </div>

      {/* Growth & Journey Milestones (Moved on top of Education) */}
      <div className="pt-2">
        <div className="flex items-center gap-2.5 mb-4">
          <Milestone className="h-6 w-6 text-emerald-400" />
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Growth & Journey Milestones
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {journeyMilestones.map((j) => (
            <div
              key={j.year}
              className="rounded-xl border border-white/5 bg-[#141414] p-3.5 hover:border-white/10 transition-all text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">{j.year}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/60" />
              </div>
              <h4 className="mt-1.5 text-xs font-semibold text-zinc-200">{j.title}</h4>
              <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">{j.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div className="pt-2">
        <div className="flex items-center gap-2.5 mb-4">
          <GraduationCap className="h-6 w-6 text-emerald-400" />
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Education
          </h2>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#141414] p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4">
            <div>
              <h4 className="text-sm font-semibold text-white">
                Daffodil International University
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                BSc in Software Engineering
              </p>
            </div>
            <span className="inline-flex self-start sm:self-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
              2023 — 2027
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
