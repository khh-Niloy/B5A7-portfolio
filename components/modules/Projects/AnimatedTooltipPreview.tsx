"use client";
import React from "react";
import { AnimatedTooltip } from "../../ui/animated-tooltip";
import { getSkillIcon } from "@/lib/skillsIconMap";

export default function AnimatedTooltipPreview({ techStack }: { techStack: string[] }) {
  const items =
    techStack
      ?.filter((tech: string) => Boolean(getSkillIcon(tech).icon))
      .slice(0, 7)
      .map((tech: string, idx: number) => {
        const { icon } = getSkillIcon(tech);
        return {
          id: idx,
          name: tech,
          image: icon,
        };
      }) || [];
  return (
    <div className="flex flex-row items-center py-1">
      <AnimatedTooltip items={items} />
    </div>
  );
}
