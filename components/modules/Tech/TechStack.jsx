import React from "react";
import getSkills from "@/helper/getSkills";
import TechName from "./TechName";

export default async function TechStack() {
  const skills = await getSkills();

  const frontendData = skills?.data?.find(
    (skill) => skill.category === "frontend"
  );
  const backendData = skills?.data?.find(
    (skill) => skill.category === "backend"
  );
  const databaseData = skills?.data?.find(
    (skill) => skill.category === "database"
  );
  const toolsData = skills?.data?.find(
    (skill) => skill.category === "Tools & Services"
  );

  const frontendSkills = frontendData?.skills || [];
  const backendSkills = backendData?.skills || [];
  const databaseSkills = databaseData?.skills || [];
  const toolsSkills = toolsData?.skills || [];

  return (
    <div className="px-8 py-12">
      <div className="mb-16 flex items-center justify-center flex-col">
        <h1 className="text-4xl font-bold text-white mb-2">Tech Stack</h1>
        <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {frontendSkills.length > 0 && (
          <TechName headTitle="Frontend" techArray={frontendSkills} give={2} />
        )}

        {backendSkills.length > 0 && (
          <TechName headTitle="Backend" techArray={backendSkills} give={2} />
        )}

        {databaseSkills.length > 0 && (
          <TechName headTitle="Database" techArray={databaseSkills} give={2} />
        )}

        {toolsSkills.length > 0 && (
          <TechName
            headTitle="Tools & Services"
            techArray={toolsSkills}
            give={2}
          />
        )}
      </div>
    </div>
  );
}
