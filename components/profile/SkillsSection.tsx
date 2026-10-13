"use client";

import React from "react";
import Image from "next/image";
import { Wrench } from "lucide-react";
import {
  SiGooglegemini,
  SiClaude,
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiRedis,
  SiPostgresql,
  SiPrisma,
  SiMongodb,
  SiMongoose,
  SiSupabase,
  SiGit,
  SiGithub,
  SiPostman,
  SiDocker,
} from "react-icons/si";

function AntigravityIcon({
  className,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Image
      src="/icons/antigravity.png"
      alt="Antigravity"
      width={20}
      height={20}
      className={`${className || "h-3.5 w-3.5"} shrink-0 object-contain`}
      unoptimized
      priority
    />
  );
}

function CodexIcon({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      className={`${className || "h-3.5 w-3.5"} shrink-0`}
      style={style}
    >
      <path
        clipRule="evenodd"
        d="M8.086.457a6.105 6.105 0 013.046-.415c1.333.153 2.521.72 3.564 1.7a.117.117 0 00.107.029c1.408-.346 2.762-.224 4.061.366l.063.03.154.076c1.357.703 2.33 1.77 2.918 3.198.278.679.418 1.388.421 2.126a5.655 5.655 0 01-.18 1.631.167.167 0 00.04.155 5.982 5.982 0 011.578 2.891c.385 1.901-.01 3.615-1.183 5.14l-.182.22a6.063 6.063 0 01-2.934 1.851.162.162 0 00-.108.102c-.255.736-.511 1.364-.987 1.992-1.199 1.582-2.962 2.462-4.948 2.451-1.583-.008-2.986-.587-4.21-1.736a.145.145 0 00-.14-.032c-.518.167-1.04.191-1.604.185a5.924 5.924 0 01-2.595-.622 6.058 6.058 0 01-2.146-1.781c-.203-.269-.404-.522-.551-.821a7.74 7.74 0 01-.495-1.283 6.11 6.11 0 01-.017-3.064.166.166 0 00.008-.074.115.115 0 00-.037-.064 5.958 5.958 0 01-1.38-2.202 5.196 5.196 0 01-.333-1.589 6.915 6.915 0 01.188-2.132c.45-1.484 1.309-2.648 2.577-3.493.282-.188.55-.334.802-.438.286-.12.573-.22.861-.304a.129.129 0 00.087-.087A6.016 6.016 0 015.635 2.31C6.315 1.464 7.132.846 8.086.457zm-.804 7.85a.848.848 0 00-1.473.842l1.694 2.965-1.688 2.848a.849.849 0 001.46.864l1.94-3.272a.849.849 0 00.007-.854l-1.94-3.393zm5.446 6.24a.849.849 0 000 1.695h4.848a.849.849 0 000-1.696h-4.848z"
      />
    </svg>
  );
}

interface SkillItem {
  name: string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  color?: string;
}

interface SkillCategory {
  category: string;
  skills: SkillItem[];
}

export function SkillsSection() {
  const skillGroups: SkillCategory[] = [
    {
      category: "AI",
      skills: [
        { name: "Gemini", icon: SiGooglegemini, color: "#4e75f8" },
        { name: "Claude", icon: SiClaude, color: "#d97757" },
        { name: "Antigravity", icon: AntigravityIcon, color: "#38bdf8" },
        { name: "Codex", icon: CodexIcon, color: "#10a37f" },
      ],
    },
    {
      category: "Backend",
      skills: [
        { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
        { name: "Nodejs", icon: SiNodedotjs, color: "#339933" },
        { name: "Expressjs", icon: SiExpress },
        { name: "Nestjs", icon: SiNestjs, color: "#E0234E" },
        { name: "Redis", icon: SiRedis, color: "#DC382D" },
      ],
    },
    {
      category: "Databases",
      skills: [
        { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
        { name: "Prisma", icon: SiPrisma },
        { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
        { name: "Mongoose", icon: SiMongoose, color: "#880000" },
        { name: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
      ],
    },
    {
      category: "Frontend",
      skills: [
        { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
        { name: "Nextjs", icon: SiNextdotjs },
        { name: "Tailwindcss", icon: SiTailwindcss, color: "#06B6D4" },
      ],
    },
    {
      category: "Tools & DevOps",
      skills: [
        { name: "Git", icon: SiGit, color: "#F05032" },
        { name: "GitHub", icon: SiGithub },
        { name: "Postman", icon: SiPostman, color: "#FF6C37" },
        { name: "Docker", icon: SiDocker, color: "#2496ED" },
      ],
    },
  ];

  return (
    <section
      id="skills"
      className="mt-14 scroll-mt-32 space-y-10 text-left"
      aria-label="Skills & Tools"
    >
      <div>
        <div className="flex items-center gap-2.5 mb-6">
          <Wrench className="h-6 w-6 text-emerald-400" />
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Skills & Tools
          </h2>
        </div>

        <div className="space-y-5">
          {skillGroups.map((group) => (
            <div key={group.category} className="">
              <span className="text-xs font-semibold text-zinc-400 mb-3 block">
                {group.category}
              </span>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <span
                      key={skill.name}
                      className="inline-flex items-center gap-1.5 rounded-full border-t border-white/40 bg-gradient-to-b from-[#313134] to-[#101011] px-3.5 py-1.25 text-[13px] font-medium text-white hover:text-zinc-200 hover:border-white/15 transition-all select-none cursor-default"
                    >
                      <Icon
                        className="h-3.5 w-3.5 shrink-0"
                        style={{ color: skill.color }}
                      />
                      <span>{skill.name}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
