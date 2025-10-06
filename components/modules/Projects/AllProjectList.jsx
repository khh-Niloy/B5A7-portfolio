import React from "react";
import ProjectCard from "./ProjectCard";
import getProjects from "@/helper/getProjects";

export default async function AllProjectList() {
  const projects = await getProjects();
  console.log(projects);

  return (
    <div className="text-white pt-32 pb-20">
      <div className="mb-16 flex items-center justify-center flex-col">
        <h1 id="tech" className="text-4xl text-center font-semibold">
          A showcase of projects I have built <br />{" "}
          <span className="text-[#CBACF9]">using modern technologies.</span>
        </h1>
        <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"></div>
      </div>

      <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 mt-16">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            image={project.image}
            projectName={project.projectName}
            shortDes={project.shortDes}
            techStack={project.techStack}
            liveSite={project.liveSite}
          />
        ))}
      </div>
    </div>
  );
}
