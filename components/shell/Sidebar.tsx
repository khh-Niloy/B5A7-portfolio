"use client";

import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { playUiClick } from "@/lib/sound";
import { usePortfolio } from "@/components/portfolio/PortfolioContext";

interface FaqItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

const defaultSidebarFaqs: FaqItem[] = [
  {
    id: "sfaq-1",
    question: "Are you open to full time or remote opportunities?",
    answer:
      "Yes, I’m actively open to full time software engineering opportunities, including remote roles. I value ownership, thoughtful problem solving, and building reliable software that solves real business problems.",
  },
  {
    id: "sfaq-2",
    question: "What is the best way to get in touch?",
    answer:
      "You can reach me through the Contact section, email me at khhniloy0@gmail.com, or connect with me on LinkedIn or WhatsApp at +880 1915 910291. I’d be happy to connect and discuss potential opportunities.",
  },
  {
    id: "sfaq-3",
    question: "Would you be interested in contributing to a SaaS business?",
    answer:
      "Absolutely. I’m currently developing a multi tenant ecommerce SaaS platform, working on features across storefronts, products, inventory, orders, checkout, and business insights. I’m interested in understanding the business behind a product and contributing to its growth through thoughtful engineering.",
  },
  {
    id: "sfaq-4",
    question: "Which area of software engineering do you focus on most?",
    answer:
      "My primary focus is backend engineering, particularly API design, business logic, database design, authentication, and system reliability. I also work with frontend technologies when needed to build and integrate complete product features.",
  },
  {
    id: "sfaq-5",
    question: "Do you use AI coding agents in your development workflow?",
    answer:
      "Yes. I actively use Google Antigravity and Codex CLI, and I’ve also worked with Claude CLI and Cursor. I use these tools to accelerate development, explore solutions, and improve productivity while keeping code quality and understanding the implementation a priority.",
  },
  {
    id: "sfaq-6",
    question: "Have you worked with AI and LLM APIs?",
    answer:
      "Yes. I’ve integrated the Gemini API in my previous professional work and in ProcureAI, an AI powered procurement project. I’m also building my knowledge of production grade AI engineering through my AI Engineering Lab, focusing on reliable LLM integration, error handling, and practical implementation patterns.",
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  activeSection?: string;
  onSelectSection?: (id: string) => void;
}

export function Sidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  const { data } = usePortfolio();
  const [openFaq, setOpenFaq] = useState<string | null>("sfaq-1");

  const sidebarFaqs =
    data?.faqs && data.faqs.length > 0
      ? data.faqs
          .filter((f) => f.isSidebar !== false)
          .map((f, idx) => ({
            id: f.id || `sfaq-${idx + 1}`,
            question: f.question,
            answer: f.answer,
          }))
      : defaultSidebarFaqs;

  const handleToggleFaq = (id: string) => {
    playUiClick();
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  const name = data?.name || "Hasib Hossain Niloy";

  return (
    <aside
      className={`sticky top-0 h-screen shrink-0 z-40 flex flex-col justify-between border-r border-[var(--border-subtle)] bg-[var(--bg-sidebar)] transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[280px]"
      } hidden md:flex`}
      aria-label="FAQ sidebar"
    >
      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto p-4 pt-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {collapsed ? (
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => {
                playUiClick();
                if (onToggleCollapse) onToggleCollapse();
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
              title="Expand FAQ Sidebar"
              aria-label="Expand FAQ Sidebar"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 [writing-mode:vertical-lr] rotate-180">
              FAQ
            </span>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <HelpCircle className="h-4 w-4" />
              <span>FAQ</span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-4 leading-relaxed">
              Quick answers about my background, technical focus, and work
              availability.
            </p>

            {/* Accordion List */}
            <div className="flex flex-col gap-2.5">
              {sidebarFaqs.map((faq, index) => {
                const isOpen = openFaq === faq.id;

                return (
                  <div
                    key={faq.id}
                    className={`overflow-hidden rounded-xl border transition-all duration-200 ${
                      isOpen
                        ? "border-emerald-500/30 bg-[#161618] shadow-sm"
                        : "border-white/5 bg-[#141414] hover:border-white/10"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleFaq(faq.id)}
                      className="flex w-full items-start justify-between gap-2.5 p-3 text-left cursor-pointer transition-colors"
                      aria-expanded={isOpen}
                      aria-controls={`sfaq-${faq.id}`}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold mt-0.5 transition-colors ${
                            isOpen
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-white/5 text-zinc-400 border border-white/5"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span
                          className={`text-xs font-semibold leading-snug transition-colors ${
                            isOpen
                              ? "text-white"
                              : "text-zinc-300 hover:text-white"
                          }`}
                        >
                          {faq.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-3.5 w-3.5 shrink-0 text-zinc-400 transition-transform duration-200 mt-1 ${
                          isOpen ? "rotate-180 text-emerald-400" : ""
                        }`}
                      />
                    </button>

                    <div
                      id={`sfaq-${faq.id}`}
                      className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="border-t border-white/5 px-3 pb-3 pt-2 text-[11px] leading-relaxed text-zinc-400">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="p-4 border-t border-[var(--border-subtle)] shrink-0">
        {onToggleCollapse && (
          <div className="flex items-center justify-center pb-2">
            <button
              id="collapse-sidebar-btn"
              onClick={() => {
                playUiClick();
                onToggleCollapse();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-[var(--text-primary)] transition-all cursor-pointer"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand" : "Collapse"}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          </div>
        )}

        {!collapsed && (
          <p className="mt-2 text-center text-[10px] text-[var(--text-tertiary)]">
            © {new Date().getFullYear()} {name}
          </p>
        )}
      </div>
    </aside>
  );
}
