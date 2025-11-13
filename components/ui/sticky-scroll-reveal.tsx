"use client";
import React, { useRef } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type StickyScrollItem = {
  year: string;
  description: string;
  title?: string;
  headTitle?: string;
};

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: StickyScrollItem[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const cardLength = content.length;

  React.useEffect(() => {
    const node = ref.current;
    if (!node || cardLength === 0) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = node;
      const maxScrollable = Math.max(scrollHeight - clientHeight, 1);
      const progress = scrollTop / maxScrollable;
      const nextIndex = Math.round(progress * (cardLength - 1));
      setActiveCard(Math.min(cardLength - 1, Math.max(0, nextIndex)));
    };

    handleScroll();
    node.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      node.removeEventListener("scroll", handleScroll);
    };
  }, [cardLength]);

  return (
    <div
      className="relative flex h-92 justify-center space-x-10 overflow-y-auto rounded-md scroll-smooth custom-scroll"
      ref={ref}
    >
      <div className="relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.year + index} className="my-16">
              <motion.h2
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-semibold text-slate-100"
              >
                {item.title ?? item.headTitle}
              </motion.h2>
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                transition={{ duration: 0.3 }}
                className="mt-6 max-w-sm text-base leading-relaxed text-slate-300"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <div
        className={cn(
          "sticky top-12 hidden h-56 w-72 overflow-hidden lg:block",
          contentClassName
        )}
      >
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-white">
            <div className="text-5xl font-black leading-tight drop-shadow-[0_12px_45px_rgba(59,130,246,0.45)]">
              {content[activeCard]?.year}
            </div>
        </div>
      </div>
    </div>
  );
};
