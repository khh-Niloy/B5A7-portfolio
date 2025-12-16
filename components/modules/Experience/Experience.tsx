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
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-6 shadow-[0_18px_45px_-25px_rgba(12,16,32,0.75)] backdrop-blur-sm">
      <div className="relative">
        <h2 className="text-3xl text-center font-semibold text-white mb-8">
          Experience
        </h2>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />
          <ul className="space-y-5">
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

                  <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-5 transition-all duration-200">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {exp.role}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white/70 text-sm">
                            @ {company}
                          </span>
                          {locationLabel && (
                            <span className="text-white/50 text-sm">
                              • {locationLabel}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-white text-sm whitespace-nowrap bg-white/5 px-3 py-2 rounded-lg shadow-[0_18px_45px_-25px_rgba(12,16,32,0.75)] backdrop-blur-sm">
                        {startLabel} – {endLabel}
                        {duration && (
                          <>
                            <span className="mx-2 text-white">•</span>
                            <span className="text-emerald-300 font-bold">
                              {duration}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex md:flex-row flex-col justify-between items-center">
                      <div>
                        {Array.isArray(exp.worked) && exp.worked.length > 0 && (
                          <ul className="space-y-2 mb-4">
                            {exp.worked.map((work, wIdx) => (
                              <li
                                key={`${work}-${wIdx}`}
                                className="text-white/80 text-sm flex items-start gap-2.5"
                              >
                                <span className="text-emerald-400 flex-shrink-0">
                                  •
                                </span>
                                <span className="leading-relaxed">{work}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="border border-white/10 px-5 py-5 rounded-lg shadow-[0_18px_45px_-25px_rgba(12,16,32,0.75)] backdrop-blur-sm">
                        {Array.isArray(exp.jobTechStack) &&
                          exp.jobTechStack.length > 0 && (
                            <div className="flex flex-col gap-2 items-end">
                              <h4 className="text-white text-sm mb-2 font-medium">
                                Tech i am working with
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {exp.jobTechStack.map((tech, tIdx) => (
                                  <span
                                    key={`${tech}-${tIdx}`}
                                    className="rounded-lg px-3 py-1.5 bg-white/5 border border-white/10 text-xs text-white/90 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-200"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
