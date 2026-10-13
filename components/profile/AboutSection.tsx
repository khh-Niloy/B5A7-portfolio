"use client";

import React, { useState } from "react";
import { User, ChevronDown, ChevronUp } from "lucide-react";
import { playUiClick } from "@/lib/sound";

export function AboutSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="mt-8 text-left" aria-labelledby="about-heading">
      <div className="flex items-center gap-2.5 mb-4">
        <User className="h-6 w-6 text-emerald-400" />
        <h2
          id="about-heading"
          className="text-2xl font-bold tracking-tight text-white"
        >
          About
        </h2>
      </div>

      <div className="text-sm text-zinc-400 leading-relaxed space-y-3">
        <p>
          I’m a Software Engineer focused on building reliable, maintainable
          software that solves real business problems. I believe great software
          starts with understanding the problem, business logic, and workflow
          before choosing the right technical solution.
        </p>

        {expanded ? (
          <div className="space-y-3 animate-in fade-in duration-300">
            <p>
              With experience in full stack development and client projects,
              I’ve worked on backend systems, REST APIs, authentication, role
              and permission based access control, payment integrations,
              caching, background jobs, and database optimization.
            </p>
            <p>
              I primarily work with TypeScript and the modern JavaScript
              ecosystem, with a strong interest in backend engineering, system
              design, and practical AI integration. I value continuous learning,
              problem solving, and ownership, with a long term goal of growing
              into leadership while creating meaningful technical and business
              impact.
            </p>
          </div>
        ) : null}

        <button
          onClick={() => {
            playUiClick();
            setExpanded(!expanded);
          }}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline pt-1 transition-colors"
        >
          {expanded ? (
            <>
              Read less <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              Read more <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>
    </section>
  );
}
