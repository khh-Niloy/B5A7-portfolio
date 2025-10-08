"use client";

import React, { useEffect, useMemo, useState } from "react";
import getAbout from "@/helper/getAbout";
import { formatDuration, formatMonthYear } from "@/lib/formateDuration";

type ExperienceItem = {
  companyName: string;
  role: string;
  startDate: string | Date;
  endDate: "present" | string | Date;
  location: "remote" | "onsite" | "hybrid";
  jobType: "full-time" | "part-time" | "contract" | "internship";
  jobTechStack: string[];
  worked: string[];
};

export default function Experience() {
  const [experience, setExperience] = useState<ExperienceItem[]>([]);

  useEffect(() => {
    const fetchAbout = async () => {
      const about = await getAbout();
      const list: ExperienceItem[] = Array.isArray(about?.experience)
        ? about.experience
        : [];
      setExperience(list);
    };
    fetchAbout();
  }, []);

  const items = useMemo(() => experience, [experience]);

  return (
    <section className="rounded-xl border border-white/5 bg-white/2 p-6 backdrop-blur-sm">
      <h2 className="text-3xl text-center font-semibold text-white mb-6">
        Experience
      </h2>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />
        <ul className="space-y-6">
          {items.map((exp, idx) => {
            const startLabel = formatMonthYear(exp.startDate);
            const isPresent = exp.endDate === "present";
            const endLabel = isPresent
              ? "Present"
              : formatMonthYear(exp.endDate as string | Date);
            const duration = formatDuration(exp.startDate, exp.endDate);
            const company = exp.companyName;
            const locationLabel = exp.location
              ? exp.location.charAt(0).toUpperCase() + exp.location.slice(1)
              : "";
            return (
              <li key={`${company}-${idx}`} className="relative pl-12">
                <span className="absolute left-3.5 top-2 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]" />

                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="text-white font-medium">
                      {exp.role}{" "}
                      <span className="text-gray-400">@ {company}</span>
                    </div>
                    <div className="text-gray-400 text-sm">
                      {startLabel} – {endLabel}
                      {duration && (
                        <>
                          <span className="mx-2 text-gray-600">•</span>
                          <span className="text-emerald-400/90">
                            {duration}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {locationLabel && (
                    <div className="text-gray-500 text-sm mt-1">
                      {locationLabel}
                    </div>
                  )}

                  {Array.isArray(exp.jobTechStack) &&
                    exp.jobTechStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3 items-center">
                        <h4 className="text-white font-light">
                          Tech i am working with
                        </h4>
                        {exp.jobTechStack.map((tech, tIdx) => (
                          <span
                            key={`${tech}-${tIdx}`}
                            className="flex items-center gap-2 rounded-lg px-3.5 py-2 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/50 transition-all duration-200 whitespace-nowrap text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
