"use client";

import React, { ReactNode, useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "motion/react";

interface AnimatedTooltipProps {
  items: {
    image: ReactNode; id: number; name: string 
}[];
}

export const AnimatedTooltip: React.FC<AnimatedTooltipProps> = ({ items }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0); // going to set this value on mouse move
  // rotate the tooltip
  const rotate = useSpring(useTransform(x, [-100, 100], [-0, 0]), springConfig);
  // translate the tooltip
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );
  const handleMouseMove = (event: { target: { offsetWidth: number; }; nativeEvent: { offsetX: number; }; }) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
  };

  return (
    <>
      {items.map((item, idx) => (
        <div
          className="group relative "
          key={item.name}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className="absolute -top-11 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-[#0C0E23] border border-[#3637497D] px-4 py-2 text-xs shadow-xl"
              >
                <div className="relative z-30 text-xs font-semibold text-white">
                  {item.name}
                </div>
                {/* <div className="text-xs text-white">{item.designation}</div> */}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-2 rounded-full border border-[#66699C6E] bg-[radial-gradient(circle,_rgba(255,255,255,1)_0%,_rgba(255,255,255,0.0)_4%,_rgba(255,255,255,0.07)_100%)] hover:-translate-y-1 duration-300 transition-all">
            {item.image}
          </div>
        </div>
      ))}
    </>
  );
};
