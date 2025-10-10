import { ArrowUpRight } from "lucide-react";
import React from "react";
import AnimatedTooltipPreview from "./AnimatedTooltipPreview";
import { LinkPreview } from "@/components/ui/link-preview";
import { Modal } from "./Modal";

export default function ProjectCard({
  image,
  projectName,
  shortDes,
  techStack,
  liveSite,
  id,
}) {
  return (
    <div className="w-full bg-gradient-to-br from-[#04071D] to-[#0C0E23] border border-[#3637497D] rounded-xl p-5 relative hover:scale-[1.02] duration-500 transition-all">
      <div className="bg-[#13162d] rounded-xl relative overflow-hidden sm:h-52 h-40 mb-6">
        <img src="/projectDivImage.png" alt="" className="w-full" />
        <img
          src={`${image}`}
          alt={image}
          className="absolute xl:top-8 lg:top-20 top-8 sm:w-[90%] w-full rotate-2 sm:left-6 rounded-xl"
        />
      </div>

      <div>
        <h1 className="text-xl font-semibold">{projectName}</h1>
        <p className="text-[#BEC1DD] text-xs mt-2 font-light">{shortDes}</p>

        <div className="flex sm:flex-row flex-col lg:flex-col xl:flex-row items-start sm:gap-0 gap-3 xl:gap-3 lg:gap-5 justify-between lg:items-start sm:items-center xl:items-center mt-4">
          <div className="flex items-center justify-center">
            <AnimatedTooltipPreview techStack={techStack} />
          </div>

          <div className="flex gap-3 items-center">
            <LinkPreview url={liveSite} className="font-bold">
              <h1 className="text-[#CBACF9] text-sm flex items-center">
                Check Live Site <ArrowUpRight />
              </h1>
            </LinkPreview>

            <Modal id={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
