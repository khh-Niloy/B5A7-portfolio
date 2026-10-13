"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
} from "lucide-react";
import { playUiClick } from "@/lib/sound";

interface WeekSlide {
  week: number;
  month: string;
  title: string;
  summary: string;
  topics: string[];
  highlight?: string;
  flow?: string[];
}

interface LearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: "system-design" | "llm-rag";
}

export function LearningModal({
  isOpen,
  onClose,
  initialTopic = "system-design",
}: LearningModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTopic, setActiveTopic] = useState<"system-design" | "llm-rag">(
    initialTopic,
  );
  const [currentWeek, setCurrentWeek] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialTopic) setActiveTopic(initialTopic);
  }, [initialTopic]);

  const activeListLength = activeTopic === "system-design" ? 8 : 3;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        playUiClick();
        setCurrentWeek((prev) => (prev > 1 ? prev - 1 : activeListLength));
      }
      if (e.key === "ArrowRight") {
        playUiClick();
        setCurrentWeek((prev) => (prev < activeListLength ? prev + 1 : 1));
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, activeListLength]);

  if (!isOpen || !mounted) return null;

  const systemDesignWeeks: WeekSlide[] = [
    {
      week: 1,
      month: "Month 1 — Foundations",
      title: "Architecture Fundamentals",
      summary:
        "Core principles of system architecture, tradeoffs between availability and latency, and capacity planning.",
      topics: [
        "Functional vs non-functional requirements",
        "Scalability",
        "Availability",
        "Reliability",
        "Latency vs throughput",
        "Bottlenecks",
        "Vertical vs horizontal scaling",
        "Basic capacity estimation",
      ],
    },
    {
      week: 2,
      month: "Month 1 — Foundations",
      title: "Backend & API Architecture",
      summary:
        "Building resilient network layers, request lifecycles, and traffic distribution mechanisms.",
      topics: [
        "Request lifecycle",
        "REST API design",
        "Stateless architecture",
        "Reverse proxy",
        "Load balancer",
        "Connection pooling",
        "Health checks",
      ],
    },
    {
      week: 3,
      month: "Month 1 — Foundations",
      title: "Database Architecture",
      summary:
        "Relational schemas, indexes, query planning, and transactional ACID guarantees.",
      topics: [
        "SQL schema design",
        "Indexes",
        "Composite indexes",
        "Query optimization",
        "Transactions",
        "ACID",
        "Isolation levels",
        "N+1 problem",
      ],
    },
    {
      week: 4,
      month: "Month 1 — Foundations",
      title: "Database Scaling",
      summary:
        "Handling massive read/write throughput, replication patterns, and database limits.",
      topics: [
        "Read/write workload",
        "Replication",
        "Read replicas",
        "Connection limits",
        "Partitioning concept",
        "When a database becomes the bottleneck",
      ],
    },
    {
      week: 5,
      month: "Month 2 — Performance + Reliability",
      title: "Caching",
      summary:
        "In-memory caching architectures, Redis caching patterns, TTL strategies, and stampede prevention.",
      topics: [
        "Why caching exists",
        "Cache-aside",
        "Redis",
        "TTL",
        "Cache invalidation",
        "Cache stampede / basic protection",
        "What happens when Redis fails",
        "CDN concept",
      ],
    },
    {
      week: 6,
      month: "Month 2 — Performance + Reliability",
      title: "Concurrency",
      summary:
        "Preventing race conditions, optimistic vs pessimistic locking, and guaranteeing idempotency.",
      highlight:
        "High Priority — Essential for transactional and financial reliability",
      topics: [
        "Race conditions",
        "Atomic operations",
        "Transactions",
        "Optimistic locking",
        "Pessimistic locking",
        "Deadlocks",
        "Idempotency",
        "Duplicate requests",
        "Preventing double processing",
      ],
    },
    {
      week: 7,
      month: "Month 2 — Performance + Reliability",
      title: "Async Processing",
      summary:
        "Decoupling heavy tasks with queues, BullMQ producers/consumers, retries, and dead-letter queues.",
      topics: [
        "Synchronous vs asynchronous processing",
        "Background jobs",
        "Queues",
        "Producers / consumers",
        "BullMQ",
        "Retries",
        "Exponential backoff",
        "Dead-letter queues",
        "Job failures",
        "Duplicate jobs",
      ],
    },
    {
      week: 8,
      month: "Month 2 — Performance + Reliability",
      title: "Scaling & Reliability",
      summary:
        "End-to-end distributed system integration: handling backpressure, timeouts, and graceful degradation.",
      flow: [
        "Traffic",
        "Load Balancer",
        "Multiple API instances",
        "Redis",
        "Database",
        "Queue",
        "Workers",
      ],
      topics: [
        "Rate limiting",
        "Backpressure concept",
        "Failure handling",
        "Timeouts",
        "Retry strategy",
        "Graceful degradation",
        "Logging",
        "Basic metrics",
        "Basic monitoring",
      ],
    },
  ];

  const llmRagWeeks: WeekSlide[] = [
    {
      week: 1,
      month: "",
      title: "LLM Fundamentals",
      summary: "",
      topics: [
        "LLM basics",
        "Tokens",
        "Context window",
        "System/user/developer instructions",
        "Temperature / sampling",
        "Reasoning vs non-reasoning models",
        "Input/output tokens",
        "Latency",
        "Cost",
        "Model selection",
        "Multimodal models",
        "Streaming",
      ],
    },
    {
      week: 2,
      month: "",
      title: "LLM API Engineering",
      summary: "",
      topics: [
        "OpenAI API",
        "Gemini API",
        "Claude API",
        "SDK usage",
        "Structured Outputs",
        "JSON Schema",
        "Zod validation",
        "Streaming responses",
        "Error handling",
        "Timeouts",
        "Retries",
        "Rate limits",
        "Model fallback",
        "Token/cost tracking",
      ],
    },
    {
      week: 3,
      month: "",
      title: "Prompt & Context Engineering",
      summary: "",
      topics: [
        "System prompts",
        "Context construction",
        "Few-shot examples",
        "Prompt composition",
        "Output constraints",
        "Context prioritization",
        "Prompt injection basics",
        "Prompt/version management",
        "Context window management",
      ],
    },
  ];

  const activeList =
    activeTopic === "system-design" ? systemDesignWeeks : llmRagWeeks;
  const activeSlide =
    activeList.find((w) => w.week === currentWeek) || activeList[0];

  const handlePrevWeek = () => {
    playUiClick();
    setCurrentWeek((prev) => (prev > 1 ? prev - 1 : activeList.length));
  };

  const handleNextWeek = () => {
    playUiClick();
    setCurrentWeek((prev) => (prev < activeList.length ? prev + 1 : 1));
  };

  const handleSelectWeek = (num: number) => {
    playUiClick();
    setCurrentWeek(num);
  };

  const handleTopicSwitch = (topic: "system-design" | "llm-rag") => {
    playUiClick();
    setActiveTopic(topic);
    setCurrentWeek(1);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/45 backdrop-blur-md animate-in fade-in duration-200"
      style={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#141416] shadow-2xl text-white flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="learning-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-[#161618]">
          <div className="flex items-center gap-2.5">
            <div>
              <h3
                id="learning-title"
                className="text-base sm:text-lg font-bold text-white"
              >
                What I&apos;ve Learned So Far
              </h3>
              <p className="text-xs text-zinc-400">
                Engineering roadmap &amp; core concepts
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playUiClick();
              onClose();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#1a1a1a] text-zinc-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Topic Selector Tabs */}
        <div className="flex items-center gap-2 px-5 sm:px-6 py-2 border-b border-white/5 bg-[#121214]">
          <button
            onClick={() => handleTopicSwitch("system-design")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTopic === "system-design"
                ? "border-t border-white/40 bg-gradient-to-b from-[#313134] to-[#101011] text-white shadow-sm"
                : "border border-white/5 bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-emerald-400" />
            <span>System Design</span>
          </button>

          <button
            onClick={() => handleTopicSwitch("llm-rag")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTopic === "llm-rag"
                ? "border-t border-white/40 bg-gradient-to-b from-[#313134] to-[#101011] text-white shadow-sm"
                : "border border-white/5 bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
            }`}
          >
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span>LLM-RAG</span>
          </button>
        </div>

        {/* Number Selector Bar (1, 2, 3, 4, 5, 6, 7, 8) */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-b border-white/5 bg-[#141416]">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 [scrollbar-width:none]">
            {activeList.map((item) => {
              const isSelected = item.week === currentWeek;
              return (
                <button
                  key={item.week}
                  onClick={() => handleSelectWeek(item.week)}
                  className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? "border-t border-white/40 bg-gradient-to-b from-[#38383c] to-[#161617] text-emerald-400"
                      : "border border-white/5 bg-[#18181a] text-zinc-400 hover:text-white hover:bg-white/10"
                  }`}
                  aria-label={`Jump to section ${item.week}`}
                >
                  {item.week}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <button
              onClick={handlePrevWeek}
              className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-white/10 bg-[#1c1c1f] text-zinc-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
              aria-label="Previous section"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextWeek}
              className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-white/10 bg-[#1c1c1f] text-zinc-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
              aria-label="Next section"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Carousel Slide Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Slide Header: Clean Title only */}
          <div className="pb-3 border-b border-white/5">
            <h4 className="text-lg sm:text-xl font-bold text-white">
              {activeSlide.title}
            </h4>
          </div>

          {/* Special Visual Architecture Flow for Week 8 */}
          {"flow" in activeSlide && activeSlide.flow && (
            <div className="rounded-xl border border-white/10 bg-[#101012] p-4">
              <span className="block text-[11px] font-bold tracking-wider uppercase text-zinc-400 mb-2.5">
                End-to-End System Flow:
              </span>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {activeSlide.flow.map((node, i) => (
                  <React.Fragment key={node}>
                    <span className="rounded-md border border-white/15 bg-[#1c1c20] px-2.5 py-1 text-xs font-semibold text-zinc-100 shadow-sm">
                      {node}
                    </span>
                    {i < (activeSlide.flow?.length || 0) - 1 && (
                      <ArrowRight className="h-3 w-3 text-emerald-400 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Topics Checklist */}
          <div className="">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {activeSlide.topics.map((t) => (
                <div
                  key={t}
                  className="flex items-start gap-2.5 text-xs sm:text-[13px] text-zinc-200"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-t border-white/10 bg-[#161618]">
          <button
            onClick={handlePrevWeek}
            disabled={currentWeek === 1}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#1c1c1f] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-zinc-400 font-medium">
            Use arrow keys{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-zinc-300">
              ←
            </kbd>{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-zinc-300">
              →
            </kbd>{" "}
            to browse
          </span>

          <button
            onClick={handleNextWeek}
            disabled={currentWeek === activeList.length}
            className="inline-flex items-center gap-1.5 rounded-lg border-t border-white/40 bg-gradient-to-b from-[#313134] to-[#101011] px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5 text-emerald-400" />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
