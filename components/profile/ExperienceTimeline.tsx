"use client";

import React from "react";
import { Briefcase } from "lucide-react";
import { usePortfolio } from "@/components/portfolio/PortfolioContext";

export function ExperienceTimeline() {
  const { data } = usePortfolio();

  const formatPeriod = (startDate: any, endDate: any, isCurrent?: boolean) => {
    if (!startDate) return "";

    const formatDate = (d: any) => {
      try {
        const date = new Date(d);
        if (isNaN(date.getTime())) return String(d);
        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      } catch {
        return String(d);
      }
    };

    const start = formatDate(startDate);
    const end = isCurrent || endDate === "present" ? "Present" : formatDate(endDate);
    return `${start} – ${end}`;
  };

  const experiences =
    data?.experience && data.experience.length > 0
      ? data.experience.map((exp) => ({
          company: exp.companyName,
          role: exp.role,
          period: formatPeriod(exp.startDate, exp.endDate, exp.isCurrent),
          isCurrent: exp.isCurrent || exp.endDate === "present",
          type: exp.location || "Remote",
          bullets: exp.worked || [],
          techStack: exp.jobTechStack || [],
        }))
      : [
          {
            company: "Lint Technologies",
            role: "Software Engineer",
            period: "July 2025 – Dec 2025",
            isCurrent: false,
            type: "Remote",
            bullets: [
              "Worked on full stack development for client projects and company products, ensuring smooth functionality and UX.",
              "Recognized for being a fast learner and for taking initiative, demonstrating strong commitment.",
              "Contributed to AI related projects using Gemini.",
            ],
            techStack: ["Gemini AI", "Next.js", "TypeScript", "Node.js", "Supabase"],
          },
        ];

  return (
    <section
      className="mt-14 text-left scroll-mt-32"
      id="experience"
      aria-labelledby="experience-heading"
    >
      <div className="flex items-center gap-2.5 mb-6">
        <Briefcase className="h-6 w-6 text-emerald-400" />
        <h2
          id="experience-heading"
          className="text-2xl font-bold tracking-tight text-white"
        >
          Experience
        </h2>
      </div>

      <div className="relative border-l border-white/10 ml-4 pl-6 space-y-10">
        {experiences.map((exp, idx) => {
          const initials =
            exp.company
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "EX";

          return (
            <div key={`${exp.company}-${idx}`} className="relative group">
              {/* Logo tile on timeline */}
              <div className="absolute -left-[45px] top-0 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#161616] text-white shadow-md">
                <span className="font-bold text-sm text-emerald-400">
                  {initials}
                </span>
                {exp.isCurrent && (
                  <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#0d0d0d] shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                )}
              </div>

              {/* Header info */}
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5">
                <h3 className="text-base font-semibold text-white">
                  {exp.role} at{" "}
                  <span className="text-zinc-200 font-semibold">
                    {exp.company}
                  </span>{" "}
                  {exp.type && (
                    <span className="text-zinc-400 font-normal text-sm">
                      ({exp.type})
                    </span>
                  )}
                </h3>
                {exp.period && (
                  <span className="text-xs text-zinc-400 font-medium whitespace-nowrap">
                    {exp.period}
                  </span>
                )}
              </div>

              {/* Bullets */}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="mt-3.5 space-y-2 text-xs sm:text-sm text-zinc-300">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li
                      key={bIdx}
                      className="flex items-start gap-2.5 leading-relaxed"
                    >
                      <span className="text-emerald-400 font-bold mt-0.5 shrink-0">
                        •
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Tech Chips */}
              {exp.techStack && exp.techStack.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {exp.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/5 bg-[#161616] px-2.5 py-0.5 text-[11px] text-zinc-400 hover:border-emerald-500/30 hover:text-emerald-300 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
