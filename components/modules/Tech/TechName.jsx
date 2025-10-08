import React from "react";
import { getSkillIcon } from "@/lib/skillsIconMap";

export default function TechName({ headTitle, techArray, give, forMobile }) {
  // console.log("techArray:", techArray);
  
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-white mb-5">{headTitle}</h2>
      
      <div className="flex flex-wrap gap-2.5">
        {techArray && techArray.map((skillName, index) => {
          const { icon } = getSkillIcon(skillName);
          
          return (
            <div
              key={`${skillName}-${index}`}
              className="flex items-center gap-2 rounded-lg px-3.5 py-2 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/50 transition-all duration-200 whitespace-nowrap"
            >
              {icon && <span className="text-base flex-shrink-0">{icon}</span>}
              <span className="text-sm text-gray-300">{skillName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
