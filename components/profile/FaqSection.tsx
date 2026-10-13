"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ExternalLink } from "lucide-react";
import { playUiClick } from "@/lib/sound";

interface FaqItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

const defaultFaqs: FaqItem[] = [
  {
    id: "faq-1",
    question: "Are you open to full time or remote opportunities?",
    answer:
      "Yes, I’m actively open to full time software engineering opportunities, including remote roles. I value ownership, thoughtful problem solving, and building reliable software that solves real business problems.",
  },
  {
    id: "faq-2",
    question: "What is the best way to get in touch?",
    answer: (
      <span>
        You can reach me through the Contact section, email me at{" "}
        <a
          href="mailto:khhniloy0@gmail.com"
          className="font-medium text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
        >
          khhniloy0@gmail.com
        </a>
        , or connect with me on{" "}
        <a
          href="https://www.linkedin.com/in/hasibhossain-niloy01/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
        >
          LinkedIn
        </a>{" "}
        or WhatsApp at{" "}
        <a
          href="https://wa.me/8801915910291"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
        >
          +880 1915 910291
        </a>
        . I’d be happy to connect and discuss potential opportunities.
      </span>
    ),
  },
  {
    id: "faq-3",
    question: "Would you be interested in contributing to a SaaS business?",
    answer:
      "Absolutely. I’m currently developing a multi tenant ecommerce SaaS platform, working on features across storefronts, products, inventory, orders, checkout, and business insights. I’m interested in understanding the business behind a product and contributing to its growth through thoughtful engineering.",
  },
  {
    id: "faq-4",
    question: "Which area of software engineering do you focus on most?",
    answer:
      "My primary focus is backend engineering, particularly API design, business logic, database design, authentication, and system reliability. I also work with frontend technologies when needed to build and integrate complete product features.",
  },
  {
    id: "faq-5",
    question: "Do you use AI coding agents in your development workflow?",
    answer:
      "Yes. I actively use Google Antigravity and Codex CLI, and I’ve also worked with Claude CLI and Cursor. I use these tools to accelerate development, explore solutions, and improve productivity while keeping code quality and understanding the implementation a priority.",
  },
  {
    id: "faq-6",
    question: "Have you worked with AI and LLM APIs?",
    answer: (
      <span>
        Yes. I’ve integrated the Gemini API in my previous professional work and in ProcureAI, an AI powered procurement project. I’m also building my knowledge of production grade AI engineering through my{" "}
        <a
          href="https://github.com/khh-Niloy/ai-engineering-lab"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
        >
          <span>AI Engineering Lab</span>
          <ExternalLink className="h-3 w-3 inline" />
        </a>
        , focusing on reliable LLM integration, error handling, and practical implementation patterns.
      </span>
    ),
  },
];

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleFaq = (id: string) => {
    playUiClick();
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="mt-14 scroll-mt-28" aria-label="Frequently Asked Questions">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 mb-2">
        <HelpCircle className="h-6 w-6 text-emerald-400" />
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Frequently Asked Questions
        </h2>
      </div>

      <p className="mt-1.5 text-xs text-zinc-400">
        Common questions about my technical background, work availability, and engineering approach.
      </p>

      {/* Accordion List */}
      <div className="mt-5 flex flex-col gap-3">
        {defaultFaqs.map((faq, index) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                isOpen
                  ? "border-emerald-500/30 bg-[#161618] shadow-lg shadow-emerald-500/5"
                  : "border-white/5 bg-[#141414] hover:border-white/10"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                className="flex w-full items-center justify-between gap-4 p-4.5 sm:p-5 text-left cursor-pointer transition-colors"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${faq.id}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                      isOpen
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-white/5 text-zinc-400 border border-white/5"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={`text-sm sm:text-[15px] font-semibold transition-colors ${
                      isOpen ? "text-white" : "text-zinc-200 hover:text-white"
                    }`}
                  >
                    {faq.question}
                  </span>
                </div>
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/5 bg-[#1b1b1e] text-zinc-400 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-emerald-400" : ""
                  }`}
                >
                  <ChevronDown className="h-4 w-4" />
                </div>
              </button>

              <div
                id={`faq-answer-${faq.id}`}
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-white/5 px-4.5 sm:px-5 pb-5 pt-3.5 text-xs sm:text-[13px] leading-relaxed text-zinc-400">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
