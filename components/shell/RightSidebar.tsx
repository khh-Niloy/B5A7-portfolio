"use client";

import React, { useState } from "react";
import { ArrowUpRight, Hammer, BookOpen } from "lucide-react";
import { FaGithub, FaLinkedin, FaWhatsapp, FaFacebook } from "react-icons/fa";
import { playUiClick } from "@/lib/sound";
import { LearningModal } from "./LearningModal";

export function RightSidebar() {
  const [buildingTab, setBuildingTab] = useState<"working" | "learning">(
    "working",
  );
  const [learningModalOpen, setLearningModalOpen] = useState(false);
  const [learningTopic, setLearningTopic] = useState<
    "system-design" | "llm-rag"
  >("system-design");

  const socials = [
    {
      platform: "GitHub",
      handle: "@khh-Niloy",
      href: "https://github.com/khh-Niloy",
      icon: FaGithub,
    },
    {
      platform: "LinkedIn",
      handle: "/in/hasibhossain-niloy01",
      href: "https://www.linkedin.com/in/hasibhossain-niloy01/",
      icon: FaLinkedin,
    },
    {
      platform: "WhatsApp",
      handle: "+880 1915-910291",
      href: "https://wa.me/8801915910291",
      icon: FaWhatsapp,
    },
    {
      platform: "Facebook",
      handle: "/khhniloy.niloy",
      href: "https://www.facebook.com/khhniloy.niloy/",
      icon: FaFacebook,
    },
  ];

  return (
    <aside
      className="hidden xl:flex flex-col gap-6 w-[340px] shrink-0 sticky top-0 h-screen overflow-y-auto p-6 [scrollbar-width:none]"
      aria-label="Sidebar information"
    >
      {/* Featured Highlight / Currently Building */}
      <div className="rounded-2xl border border-white/5 bg-[#141414] p-5 transition-all hover:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
            <Hammer className="h-3.5 w-3.5 text-emerald-400" />
            <span>Currently Building</span>
          </div>

          {/* Toggle: Working & Learning */}
          <div className="flex items-center gap-1 rounded-full bg-[#1b1b1e] p-0.5 border border-white/5">
            <button
              onClick={() => {
                playUiClick();
                setBuildingTab("working");
              }}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-all cursor-pointer ${
                buildingTab === "working"
                  ? "border-t border-white/40 bg-gradient-to-b from-[#313134] to-[#101011] text-emerald-400 shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Working
            </button>
            <button
              onClick={() => {
                playUiClick();
                setBuildingTab("learning");
              }}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-all cursor-pointer ${
                buildingTab === "learning"
                  ? "border-t border-white/40 bg-gradient-to-b from-[#313134] to-[#101011] text-emerald-400 shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Learning
            </button>
          </div>
        </div>

        {buildingTab === "working" ? (
          <div className="mt-3 animate-in fade-in duration-200">
            <h4 className="text-sm font-semibold text-white">
              ProcureAI Platform
            </h4>
            <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
              AI-powered procurement management platform streamlining purchase
              workflows, vendor quotation comparisons, and intelligent decision
              support with Gemini AI.
            </p>

            <a
              href="https://procureai-platform-frontend.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playUiClick}
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:underline"
            >
              <span>Visit live preview</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        ) : (
          <div className="mt-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">
                AI Engineering Lab
              </h4>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                Ongoing
              </span>
            </div>
            <span className="inline-block text-[11px] font-medium text-zinc-400 mt-0.5">
              Learning &amp; Ongoing Repository
            </span>
            <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
              An ongoing collection of practical AI/LLM engineering projects
              built while learning production oriented AI integration. Currently
              includes an AI Ticket Classifier implementing structured outputs,
              prompt engineering, retries, timeouts, model fallback, and runtime
              validation.
            </p>

            <a
              href="https://github.com/khh-Niloy"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playUiClick}
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:underline"
            >
              <span>Explore repository</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Featured Highlight / Currently Learning */}
      <div className="rounded-2xl border border-white/5 bg-[#141414] p-5 transition-all hover:border-white/10">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
          <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
          <span>Currently Learning</span>
        </div>

        <div className="mt-3.5 flex flex-wrap gap-2">
          <button
            onClick={() => {
              playUiClick();
              setLearningTopic("system-design");
              setLearningModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-full border-t border-white/40 bg-gradient-to-b from-[#313134] to-[#101011] px-3.5 py-1.5 text-xs font-medium text-white shadow-sm hover:brightness-110 hover:scale-105 transition-all cursor-pointer"
            title="Explore System Design Curriculum"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
            <span>System design</span>
          </button>

          <button
            onClick={() => {
              playUiClick();
              setLearningTopic("llm-rag");
              setLearningModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-full border-t border-white/40 bg-gradient-to-b from-[#313134] to-[#101011] px-3.5 py-1.5 text-xs font-medium text-white shadow-sm hover:brightness-110 hover:scale-105 transition-all cursor-pointer"
            title="Explore LLM-RAG Curriculum"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
            <span>LLM-RAG</span>
          </button>
        </div>

        <button
          onClick={() => {
            playUiClick();
            setLearningTopic("system-design");
            setLearningModalOpen(true);
          }}
          className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:underline transition-colors cursor-pointer text-left"
        >
          <span>Click to see what I&apos;ve learned so far</span>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
        </button>
      </div>

      {/* Section: Find me on */}
      <div className="mt-5">
        <div className="flex items-center gap-2.5 text-base font-bold text-white mb-4">
          <span>Find me on</span>
        </div>

        <div className="flex flex-col gap-5">
          {socials.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.platform}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playUiClick}
                className="group flex items-center justify-between rounded-xl transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-t border-white/40 bg-gradient-to-b from-[#313134] to-[#101011] text-zinc-200 group-hover:text-emerald-400 shadow-sm transition-all shrink-0">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-semibold text-white transition-colors">
                      {s.platform}
                    </span>
                    <span className="text-[13px] text-zinc-400 group-hover:text-zinc-300 transition-colors">
                      {s.handle}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="h-4.5 w-4.5 text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-400" />
              </a>
            );
          })}
        </div>
      </div>

      {/* Interactive Carousel Learning Modal */}
      <LearningModal
        isOpen={learningModalOpen}
        onClose={() => setLearningModalOpen(false)}
        initialTopic={learningTopic}
      />
    </aside>
  );
}
