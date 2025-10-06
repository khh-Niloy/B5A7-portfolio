"use client";
import React from "react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
export function Journey({ content }: { content: any }) {
  return (
    <div className="w-full bg-white/3 p-4 rounded-2xl">
      <StickyScroll content={content || []} />
    </div>
  );
}
