"use client";
import React from "react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";


// const content = [
//   {
//     year: "2019",
//     headTitle: "Started Learning UI/UX Design",
//     description:
//       "Began learning UI/UX design principles and started creating mockups for various projects. This was the beginning of my journey into the world of digital design.",
//   },
//   {
//     year: "2020",
//     headTitle: "Started Learning Web Development",
//     description:
//       "Dived into HTML, CSS, and JavaScript. Built my first websites and started understanding the fundamentals of web development.",
//   },
//   {
//     year: "2022",
//     headTitle: "Focused on React Ecosystem",
//     description:
//       "Focused on React ecosystem, built several projects and understood component-based architecture. This opened up new possibilities for building interactive applications.",
//   },
  
// ];
export function Journey({ content }: { content: any }) {
  return (
    <div className="w-full">
      <StickyScroll content={content || []} />
    </div>
  );
}
