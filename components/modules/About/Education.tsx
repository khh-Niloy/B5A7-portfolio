import React from "react";
import { Check } from "lucide-react";

export default function Education({
  content,
}: {
  content: Record<string, unknown>;
}) {
  const { education, sampleText } = content;
  const { varsity, department, startYear, endYear } = education as Record<
    string,
    unknown
  >;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-7 shadow-[0_18px_45px_-25px_rgba(12,16,32,0.75)] backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(192,132,252,0.12),transparent_62%)]" />

      <div className="relative flex flex-col gap-8 md:flex-row md:items-start">
        <div className="flex-1 space-y-5 text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.3em] text-white/70">
            <span>🎓</span>
            Education
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-semibold leading-tight text-white">
              {varsity as string}
            </h2>
            <p className="text-base text-white/70">{department as string}</p>
            <p className="text-xs uppercase tracking-[0.25em] text-white/40">
              {startYear as string} — {endYear as string}
            </p>
          </div>
        </div>

        <div className="md:w-[40%]">
          <ul className="space-y-3">
            {(sampleText as string[]).map((item: string, index: number) => (
              <li
                key={index}
                className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent px-4 py-3 text-sm text-white/80 transition-all duration-200 hover:border-white/20 hover:bg-white/15 hover:text-white"
              >
                <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/20 via-emerald-500/20 to-transparent text-emerald-300 shadow-[0_10px_30px_-18px_rgba(16,185,129,0.8)] group-hover:from-emerald-400/35 group-hover:text-emerald-200">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
