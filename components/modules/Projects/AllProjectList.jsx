"use client";
import React, { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";

export default function AllProjectList() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/projects`);
        const result = await res.json();
        const data = result.data || [];
        setProjects(data);
        setFilteredProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjects([]);
        setFilteredProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((project) => project.projectType === selectedCategory)
      );
    }
  }, [selectedCategory, projects]);

  return (
    <div className="text-white pt-32 pb-20">
      <div className="mb-16 flex items-center justify-center flex-col">
        <h1 id="tech" className="text-4xl text-center mb-2 font-semibold">
          Projects built with modern tech.
        </h1>
        <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"></div>
        
        {/* Toggle Button */}
        <div className="mt-8 flex items-center gap-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-1">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-5 py-1.5 rounded-md text-sm font-normal transition-all duration-300 ${
              selectedCategory === "all"
                ? "bg-white/10 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedCategory("personal project")}
            className={`px-5 py-1.5 rounded-md text-sm font-normal transition-all duration-300 ${
              selectedCategory === "personal project"
                ? "bg-white/10 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Personal
          </button>
          <button
            onClick={() => setSelectedCategory("client project")}
            className={`px-5 py-1.5 rounded-md text-sm font-normal transition-all duration-300 ${
              selectedCategory === "client project"
                ? "bg-white/10 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Client
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No projects found in this category.</p>
        </div>
      ) : (
        <div
          className={`mt-16 ${
            filteredProjects.length === 1
              ? "flex justify-center items-start"
              : "grid lg:grid-cols-2 grid-cols-1 gap-5"
          }`}
        >
          {filteredProjects.map((project) => (
            <div
              key={project.id || project._id}
              className={filteredProjects.length === 1 ? "w-full max-w-2xl" : ""}
            >
              <ProjectCard
                image={project.image}
                projectName={project.projectName}
                shortDes={project.shortDes}
                techStack={project.techStack}
                liveSite={project.liveSite}
                id={project._id}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
