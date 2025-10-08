"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import toast from "react-hot-toast";
import getProjects from "@/helper/getProjects";
import getEachProject from "@/helper/getEachProject";
import Image from "next/image";

interface ProjectFormValues {
  projectName: string;
  shortDes: string;
  techStack: string;
  liveSite: string;

  tagline: string;
  problemSolution: string;
  features: string;
  dependencies: string;
  responsibilities: string;
  githubRepo: string;
}

interface UpdateProjectsProps {
  files: File[];
  setFiles: (files: File[]) => void;
  projects: Record<string, unknown>[];
  setProjects: (projects: Record<string, unknown>[]) => void;
  selectedProject: Record<string, unknown> | null;
  setSelectedProject: (project: Record<string, unknown> | null) => void;
  loadingProjects: boolean;
  setLoadingProjects: (loading: boolean) => void;
}

export default function UpdateProjects({
  files,
  setFiles,
  projects,
  setProjects,
  selectedProject,
  setSelectedProject,
  loadingProjects,
  setLoadingProjects,
}: UpdateProjectsProps) {
  const {
    register,
    handleSubmit,
    formState: {},
    reset,
    setValue,
  } = useForm<ProjectFormValues>({
    defaultValues: {
      projectName: "",
      shortDes: "",
      techStack: "",
      liveSite: "",
      tagline: "",
      problemSolution: "",
      features: "",
      dependencies: "",
      responsibilities: "",
      githubRepo: "",
    },
  });

  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const projectsData = await getProjects();
        setProjects(projectsData || []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [setProjects, setLoadingProjects]);

  const handleProjectSelect = async (projectId: string) => {
    if (!projectId) {
      setSelectedProject(null);
      reset();
      return;
    }

    try {
      const projectData = await getEachProject(projectId);
      setSelectedProject(projectData);

      if (projectData) {
        setValue("projectName", projectData.projectName || "");
        setValue("shortDes", projectData.shortDes || "");
        setValue("liveSite", projectData.liveSite || "");

        setValue("tagline", projectData.tagline);
        setValue("problemSolution", projectData.problemSolution ?? "");
        setValue("responsibilities", projectData.responsibilities ?? "");
        setValue("githubRepo", projectData.githubRepo ?? "");

        const featuresArr = projectData.features ?? "";
        setValue(
          "features",
          Array.isArray(featuresArr) ? featuresArr.join(", ") : ""
        );

        setValue("dependencies", projectData.dependencies ?? "");
        

        setValue(
          "techStack",
          Array.isArray(projectData.techStack)
            ? projectData.techStack.join(", ")
            : ""
        );
      }
    } catch (error) {
      console.error("Failed to fetch project details:", error);
      toast.error("Failed to load project details");
    }
  };

  const onUpdateSubmit = async (data: ProjectFormValues) => {
    if (!selectedProject) {
      toast.error("Please select a project to update");
      return;
    }

    try {
      const formData = new FormData();

      if (files && files.length > 0) {
        formData.append("files", files[0]);
      }

      const techStackString = data.techStack ?? "";
      const featuresString = data.features ?? "";
      const dependenciesString = data.dependencies ?? "";

      formData.append("projectName", data.projectName || "");
      formData.append("shortDes", data.shortDes || "");
      formData.append("techStack", techStackString);
      formData.append("liveSite", data.liveSite || "");
      formData.append("tagline", data.tagline || "");
      formData.append("problemSolution", data.problemSolution || "");
      formData.append("features", featuresString);
      formData.append("dependencies", dependenciesString);
      formData.append("responsibilities", data.responsibilities || "");
      formData.append("githubRepo", data.githubRepo || "");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/projects/${selectedProject._id}`,
        {
          method: "PATCH",
          body: formData,
          credentials: "include",
        }
      );

      const result = await res.json();

      if (!res.ok || !result?.success) {
        toast.error(result?.message || "Failed to update project");
        return;
      }
      toast.success("Project updated successfully! 🚀");
      setFiles([]);
      setSelectedProject(null);
      reset();
      setLoadingProjects(true);
      const refreshed = await getProjects();
      setProjects(refreshed || []);
      setLoadingProjects(false);
    } catch {
      toast.error("Failed to update project");
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-white mb-6">
          Select Project to Update
        </h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="projectSelect">Choose Project</Label>
            <select
              id="projectSelect"
              onChange={(e) => handleProjectSelect(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-transparent px-4 py-3 text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none hover:border-white/20 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loadingProjects}
            >
              <option value="" className="bg-[#0a0f1e] text-gray-400">
                {loadingProjects
                  ? "Loading projects..."
                  : "Select a project to update..."}
              </option>
              {projects.map((project) => (
                <option
                  key={project._id as string}
                  value={project._id as string}
                  className="bg-[#0a0f1e] text-white"
                >
                  {project.projectName as string}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedProject ? (
        <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-8">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white mb-6">
              Current Project Image
            </h2>
            {(selectedProject.image as string) && (
              <div className="mb-4">
                <Image
                  src={selectedProject.image as string}
                  alt={selectedProject.projectName as string}
                  className="w-full max-w-md h-48 object-cover rounded-lg border"
                />
              </div>
            )}
            <div className="w-full max-w-4xl mx-auto">
              <Label className="text-sm text-gray-400 mb-2 block">
                Upload new image (optional)
              </Label>
              <FileUpload onChange={setFiles} />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white mb-6">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="update-projectName">Project Name</Label>
                <Input
                  id="update-projectName"
                  placeholder="e.g., MadChef - Restaurant Management App"
                  {...register("projectName")}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="update-tagline">Tagline</Label>
                <Input
                  id="update-tagline"
                  placeholder="A catchy tagline for your project"
                  {...register("tagline")}
                  className="mt-2"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="update-shortDes">Short Description</Label>
                <Textarea
                  id="update-shortDes"
                  placeholder="Brief description of your project..."
                  {...register("shortDes")}
                  className="mt-2 min-h-[80px]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="update-liveSite">Live Site URL</Label>
                <Input
                  id="update-liveSite"
                  type="url"
                  placeholder="https://example.com"
                  {...register("liveSite")}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="update-githubRepo">GitHub Repository</Label>
                <Input
                  id="update-githubRepo"
                  type="url"
                  placeholder="https://github.com/username/repo"
                  {...register("githubRepo")}
                  className="mt-2"
                  required
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white mb-6">
              Project Details
            </h2>

            <div className="space-y-6">
              <div>
                <Label htmlFor="update-problemSolution">
                  Problem & Solution
                </Label>
                <Textarea
                  id="update-problemSolution"
                  placeholder="What problem does this project solve and how?"
                  {...register("problemSolution")}
                  className="mt-2 min-h-[120px]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="update-features">Key Features</Label>
                <Textarea
                  id="update-features"
                  placeholder="Feature 1, Feature 2, Feature 3"
                  {...register("features")}
                  className="mt-2 min-h-[100px]"
                  required
                />
                <p className="text-sm text-gray-400 mt-1">
                  Separate features with commas
                </p>
              </div>

              <div>
                <Label htmlFor="update-responsibilities">
                  Your Responsibilities
                </Label>
                <Textarea
                  id="update-responsibilities"
                  placeholder="What was your role and responsibilities in this project?"
                  {...register("responsibilities")}
                  className="mt-2 min-h-[100px]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white mb-6">
              Technical Stack
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="update-techStack">Tech Stack</Label>
                <Textarea
                  id="update-techStack"
                  placeholder="React, Next.js, TypeScript, MongoDB"
                  {...register("techStack")}
                  className="mt-2 min-h-[100px]"
                  required
                />
                <p className="text-sm text-gray-400 mt-1">
                  Separate technologies with commas
                </p>
              </div>

              <div>
                <Label htmlFor="update-dependencies">Key Dependencies</Label>
                <Textarea
                  id="update-dependencies"
                  placeholder="axios, framer-motion, tailwindcss"
                  {...register("dependencies")}
                  className="mt-2 min-h-[100px]"
                  required
                />
                <p className="text-sm text-gray-400 mt-1">
                  Separate dependencies with commas
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedProject(null);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Project
            </Button>
          </div>
        </form>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm opacity-50">
          <h2 className="text-xl font-semibold text-white mb-6">
            Update Project Details
          </h2>
          <p className="text-gray-400 text-center py-8">
            Please select a project above to start updating
          </p>
        </div>
      )}
    </div>
  );
}
