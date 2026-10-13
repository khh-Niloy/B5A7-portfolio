"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Clock, Briefcase } from "lucide-react";
import { EqualizerBanner } from "../shell/EqualizerBanner";
import {
  SiGooglegemini,
  SiNextdotjs,
  SiTypescript,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiPrisma,
  SiClaude,
  SiNestjs,
  SiMongoose,
  SiRedis,
  SiSupabase,
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
      width={24}
      height={24}
      className={`${className || "h-5 w-5"} shrink-0 object-contain`}
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

interface ProfileHeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  dhakaTime: string;
}

export function ProfileHeader({
  dhakaTime,
}: ProfileHeaderProps) {
  const aiTools = [
    {
      name: "Gemini",
      icon: SiGooglegemini,
      color: "#4e75f8",
      iconClass: "h-3.5 w-3.5",
      className:
        "border border-[#3a456e]/90 border-b-[#4e75f8] border-b-[1.5px] bg-gradient-to-b from-[#28314e] via-[#161c31] to-[#222d56] shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),inset_0_-2px_4px_rgba(78,117,248,0.4),0_2px_8px_rgba(0,0,0,0.4)] hover:brightness-110 hover:scale-105",
    },
    {
      name: "Claude",
      icon: SiClaude,
      color: "#d97757",
      iconClass: "h-3.5 w-3.5",
      className:
        "border border-[#554d4d]/90 border-b-[#c87155] border-b-[1.5px] bg-gradient-to-b from-[#443734] via-[#2a1f1e] to-[#482d25] shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),inset_0_-2px_4px_rgba(217,119,87,0.4),0_2px_8px_rgba(0,0,0,0.4)] hover:brightness-110 hover:scale-105",
    },
    {
      name: "Antigravity",
      icon: AntigravityIcon,
      color: "#38bdf8",
      iconClass: "h-5 w-5",
      className:
        "border border-[#334b63]/60 border-b-[#00d2ff] bg-gradient-to-b from-[#223042] via-[#131d2a] to-[#1a3347] shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),inset_0_-2px_4px_rgba(0,210,255,0.4),0_2px_8px_rgba(0,0,0,0.4)] hover:brightness-110 hover:scale-105",
    },
    {
      name: "Codex",
      icon: CodexIcon,
      color: "#10a37f",
      iconClass: "h-3.5 w-3.5",
      className:
        "border border-[#2a453b]/80 border-b-[#10a37f] border-b-[1.5px] bg-gradient-to-b from-[#1b2f27] via-[#101c17] to-[#152a22] shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),inset_0_-2px_4px_rgba(16,163,127,0.4),0_2px_8px_rgba(0,0,0,0.4)] hover:brightness-110 hover:scale-105",
    },
  ];

  const coreStack = [
    { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
    { name: "NestJS", icon: SiNestjs, color: "#E0234E" },
    { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
    { name: "Express", icon: SiExpress },
    { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
    { name: "Prisma", icon: SiPrisma },
    { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
    { name: "Mongoose", icon: SiMongoose, color: "#880000" },
    { name: "Redis", icon: SiRedis, color: "#DC382D" },
    { name: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
    { name: "Next.js", icon: SiNextdotjs },
  ];

  return (
    <div className="flex flex-col items-center text-center">
      {/* Equalizer Banner (Full-bleed edge-to-edge, zero gaps) */}
      <div className="-mx-4 sm:-mx-6 md:-mx-8 -mt-4 sm:-mt-6 md:-mt-8 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] md:w-[calc(100%+4rem)]">
        <EqualizerBanner />
      </div>

      {/* Avatar overlapping banner */}
      <div className="relative -mt-14 mb-4">
        <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-[#0d0d0d] bg-[#1a1a1a] shadow-xl">
          <Image
            src="https://avatars.githubusercontent.com/u/174131986?v=4"
            alt="Hasib Hossain Niloy"
            fill
            priority
            className="object-cover scale-[1.45] origin-[center_50%] transition-transform duration-300"
            unoptimized
          />
        </div>
      </div>

      {/* Name and Verified Badge */}
      <div className="flex items-center justify-center gap-2">
        <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-white/90">
          Hasib Hossain Niloy
        </h1>
      </div>

      {/* Tagline */}
      <p className="mt-1.5 text-sm sm:text-base text-white/90 max-w-xl leading-relaxed">
        I value ownership, problem solving, and taking responsibility for my
        work.
      </p>

      {/* Open to new conversations status pill */}
      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-2 text-xs font-medium text-emerald-300">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>Open to Work & Collaboration</span>
      </div>

      {/* Role and Location Meta Row */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Briefcase className="h-3.5 w-3.5 text-emerald-400" />
          <span>
            Actively seeking <span className="text-zinc-200 font-medium">Software Engineer roles</span>
          </span>
        </div>
        <span className="hidden sm:inline text-zinc-600">•</span>
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-zinc-500" />
          <span>Dhaka, Bangladesh</span>
        </div>
        <span className="hidden sm:inline text-zinc-600">•</span>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-zinc-500" />
          <span>{dhakaTime || "3:07 PM"}</span>
        </div>
      </div>

      {/* Chip Rows */}
      {/* Row 1: AI Tools */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
        {aiTools.map((t) => {
          const Icon = t.icon;
          return (
            <span
              key={t.name}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.25 text-[13px] font-medium !text-white transition-all duration-200 select-none cursor-default ${t.className}`}
            >
              {Icon && (
                <Icon
                  className={`${t.iconClass || "h-3.5 w-3.5"} shrink-0`}
                  style={{ color: t.color }}
                />
              )}
              <span>{t.name}</span>
            </span>
          );
        })}
      </div>

      {/* Row 2: Tech Stack Chips */}
      <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2">
        {coreStack.map((tech) => {
          const Icon = tech.icon;
          return (
            <span
              key={tech.name}
              className="inline-flex items-center gap-1.5 rounded-full border-t border-white/40 bg-gradient-to-b from-[#313134] to-[#101011] px-3.5 py-1.25 text-[13px] font-medium text-white hover:text-zinc-200 hover:border-white/15 transition-all"
            >
              <Icon className="h-3.5 w-3.5" style={{ color: tech.color }} />
              <span>{tech.name}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
