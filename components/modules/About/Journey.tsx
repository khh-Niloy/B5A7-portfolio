"use client";
import React from "react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
export function Journey({ content }: { content: Record<string, unknown>[] }) {
  return (
    <div className="w-full bg-white/3 p-4 rounded-2xl">
      <h2 className="text-2xl font-bold text-center translate-y-5 text-white mb-6">My Journey</h2>
      <StickyScroll content={content as { year: string; description: string; headTitle: string; }[] || []} />
    </div>
  );
}
