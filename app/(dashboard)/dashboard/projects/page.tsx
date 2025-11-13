"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { createProject } from "@/actions/projects/createProject";
import getProjects from "@/helper/getProjects";
import getEachProject from "@/helper/getEachProject";
import Image from "next/image";

interface Project {
  _id: string;
  image: string;
  shortDes: string;
  techStack: string[];
  liveSite: string;
  projectName: string;
  tagline: string;
  problemSolution: string;
  features: string[];
  dependencies: string[];
  responsibilities: string;
  githubRepo: string;
  projectType: "client project" | "personal project";
  createdAt: string;
  updatedAt: string;
}

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
  projectType: "client project" | "personal project";
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { dirtyFields, isDirty },
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
      projectType: "personal project",
    },
  });

  const projectType = watch("projectType");
  const hasChanges = isDirty || (files && files.length > 0);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data || []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = () => {
    setIsEditing(false);
    setEditingProject(null);
    setShowForm(true);
    setFiles([]);
    reset();
  };

  const handleEdit = async (project: Project) => {
    setIsEditing(true);
    setEditingProject(project);
    setShowForm(true);
    setFiles([]);

    try {
      const fresh = await getEachProject(project._id);
      const resetValues = {
        projectName: fresh?.projectName || "",
        shortDes: fresh?.shortDes || "",
        liveSite: fresh?.liveSite || "",
        tagline: fresh?.tagline || "",
        problemSolution: fresh?.problemSolution || "",
        responsibilities: fresh?.responsibilities || "",
        githubRepo: fresh?.githubRepo || "",
        features: Array.isArray(fresh?.features)
          ? fresh.features.join(", ")
          : "",
        dependencies: fresh.dependencies ?? "",
        techStack: Array.isArray(fresh?.techStack)
          ? fresh.techStack.join(", ")
          : "",
        projectType:
          (fresh?.projectType as "client project" | "personal project") ||
          "personal project",
      };
      reset(resetValues);
    } catch {
      const resetValues = {
        projectName: project.projectName || "",
        shortDes: project.shortDes || "",
        liveSite: project.liveSite || "",
        tagline:
          ((project as unknown as Record<string, unknown>).tagline as string) ||
          "",
        problemSolution:
          ((project as unknown as Record<string, unknown>)
            .problemSolution as string) || "",
        responsibilities:
          ((project as unknown as Record<string, unknown>)
            .responsibilities as string) || "",
        githubRepo:
          ((project as unknown as Record<string, unknown>)
            .githubRepo as string) || "",
        features: Array.isArray(
          (project as unknown as Record<string, unknown>).features
        )
          ? (
              (project as unknown as Record<string, unknown>)
                .features as string[]
            ).join(", ")
          : "",
        dependencies: Array.isArray(
          (project as unknown as Record<string, unknown>).dependencies
        )
          ? (
              (project as unknown as Record<string, unknown>)
                .dependencies as string[]
            ).join(", ")
          : "",
        techStack: Array.isArray(project.techStack)
          ? project.techStack.join(", ")
          : "",
        projectType:
          (project.projectType as "client project" | "personal project") ||
          "personal project",
      };
      reset(resetValues);
    }
  };

  // const handleDelete = async (projectId: string) => {
  //   if (confirm("Are you sure you want to delete this project?")) {
  //     try {
  //       setProjects(projects.filter((project) => project._id !== projectId));
  //       toast.success("Project deleted successfully!");
  //     } catch (error) {
  //       console.error("Failed to delete project:", error);
  //       toast.error("Failed to delete project");
  //     }
  //   }
  // };

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      if (files.length === 0 && !isEditing) {
        toast.error("Please upload a project image");
        return;
      }

      // Check if there are changes when editing
      if (isEditing && !isDirty && (!files || files.length === 0)) {
        toast.error("No changes detected. Please modify at least one field.");
        return;
      }

      const formData = new FormData();

      // Only append file if a new one is uploaded
      if (files.length > 0) {
        formData.append("files", files[0]);
      }

      if (isEditing && editingProject) {
        // For updates, only send changed fields
        if (dirtyFields.projectName) {
          formData.append("projectName", data.projectName);
        }
        if (dirtyFields.shortDes) {
          formData.append("shortDes", data.shortDes);
        }
        if (dirtyFields.tagline) {
          formData.append("tagline", data.tagline);
        }
        if (dirtyFields.liveSite) {
          formData.append("liveSite", data.liveSite);
        }
        if (dirtyFields.githubRepo) {
          formData.append("githubRepo", data.githubRepo);
        }
        if (dirtyFields.problemSolution) {
          formData.append("problemSolution", data.problemSolution);
        }
        if (dirtyFields.responsibilities) {
          formData.append("responsibilities", data.responsibilities);
        }
        if (dirtyFields.techStack) {
          const techStackArray = data.techStack
            .split(",")
            .map((tech) => tech.trim().replace(/\.$/, ""))
            .filter((tech) => tech !== "");
          formData.append("techStack", JSON.stringify(techStackArray));
        }
        if (dirtyFields.features) {
          const featuresArray = data.features
            .split(",")
            .map((feature) => feature.trim().replace(/\.$/, ""))
            .filter((feature) => feature !== "");
          formData.append("features", JSON.stringify(featuresArray));
        }
        if (dirtyFields.dependencies) {
          formData.append("dependencies", data.dependencies);
        }
        if (dirtyFields.projectType) {
          formData.append("projectType", data.projectType);
        }
      } else {
        // For create, send all fields
        const techStackArray = data.techStack
          .split(",")
          .map((tech) => tech.trim().replace(/\.$/, ""))
          .filter((tech) => tech !== "");

        const featuresArray = data.features
          .split(",")
          .map((feature) => feature.trim().replace(/\.$/, ""))
          .filter((feature) => feature !== "");

        formData.append("projectName", data.projectName);
        formData.append("shortDes", data.shortDes);
        formData.append("techStack", JSON.stringify(techStackArray));
        formData.append("liveSite", data.liveSite);
        formData.append("tagline", data.tagline);
        formData.append("problemSolution", data.problemSolution);
        formData.append("features", JSON.stringify(featuresArray));
        formData.append("dependencies", data.dependencies);
        formData.append("responsibilities", data.responsibilities);
        formData.append("githubRepo", data.githubRepo);
        // Ensure projectType is always a valid value
        const projectTypeValue = data.projectType || "personal project";
        formData.append("projectType", projectTypeValue);
      }

      if (isEditing && editingProject) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API}/projects/${editingProject._id}`,
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
        setShowForm(false);
        setFiles([]);
        reset();
        fetchProjects();
      } else {
        const result = await createProject(formData);
        if (result?.success) {
          toast.success("Project created successfully! 🚀");
          setShowForm(false);
          setFiles([]);
          reset();
          fetchProjects();
        } else {
          toast.error(result?.message || "Failed to create project");
        }
      }
    } catch (error) {
      console.error("Failed to save project:", error);
      toast.error("Failed to save project");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditingProject(null);
    setFiles([]);
    reset();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-10 px-4 md:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Project Management
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-400">
            Create, edit, and manage your portfolio projects.
          </p>
        </div>

        {!showForm && (
          <Button
            onClick={handleCreate}
            className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-200 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        )}
      </div>

      {showForm && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:p-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-white">
              {isEditing ? "Edit Project" : "Create New Project"}
            </h2>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-white/10 text-gray-300 hover:bg-white/5 w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label>Project Image</Label>
              {isEditing && editingProject?.image && (
                <div className="mt-2 mb-4">
                  <div className="relative w-full max-w-md h-48">
                    <Image
                      src={editingProject.image}
                      alt="Current project"
                      fill
                      className="object-cover rounded-lg border border-white/10"
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Current project image
                  </p>
                </div>
              )}
              <div className="mt-2">
                <FileUpload onChange={setFiles} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="e.g., MadChef - Restaurant Management App"
                  {...register("projectName")}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  placeholder="A catchy tagline for your project"
                  {...register("tagline")}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="liveSite">Live Site URL</Label>
                <Input
                  id="liveSite"
                  type="url"
                  placeholder="https://example.com"
                  {...register("liveSite")}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="githubRepo">GitHub Repository</Label>
                <Input
                  id="githubRepo"
                  type="url"
                  placeholder="https://github.com/username/repo"
                  {...register("githubRepo")}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="projectType">Project Type</Label>
                <Select
                  value={projectType}
                  onValueChange={(value) =>
                    setValue(
                      "projectType",
                      value as "client project" | "personal project",
                      { shouldDirty: true }
                    )
                  }
                >
                  <SelectTrigger id="projectType" className="mt-2 w-full">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client project">
                      Client Project
                    </SelectItem>
                    <SelectItem value="personal project">
                      Personal Project
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="shortDes">Short Description</Label>
              <Textarea
                id="shortDes"
                placeholder="Brief description of your project..."
                {...register("shortDes")}
                className="mt-2 min-h-[80px]"
                required
              />
            </div>

            <div>
              <Label htmlFor="problemSolution">Problem & Solution</Label>
              <Textarea
                id="problemSolution"
                placeholder="What problem does this project solve and how?"
                {...register("problemSolution")}
                className="mt-2 min-h-[120px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div>
                <Label htmlFor="techStack">Tech Stack</Label>
                <Textarea
                  id="techStack"
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
                <Label htmlFor="features">Key Features</Label>
                <Textarea
                  id="features"
                  placeholder="Feature 1, Feature 2, Feature 3"
                  {...register("features")}
                  className="mt-2 min-h-[100px]"
                  required
                />
                <p className="text-sm text-gray-400 mt-1">
                  Separate features with commas
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="responsibilities">Your Responsibilities</Label>
              <Textarea
                id="responsibilities"
                placeholder="What was your role and responsibilities in this project?"
                {...register("responsibilities")}
                className="mt-2 min-h-[100px]"
                required
              />
            </div>

            <div>
              <Label htmlFor="dependencies">Key Dependencies</Label>
              <Textarea
                id="dependencies"
                placeholder="axios, framer-motion, tailwindcss"
                {...register("dependencies")}
                className="mt-2 min-h-[80px]"
                required
              />
              <p className="text-sm text-gray-400 mt-1">
                Separate dependencies with commas
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="border-white/10 text-gray-300 hover:bg-white/5 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isEditing && !hasChanges}
                className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-200 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEditing ? "Update Project" : "Create Project"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:p-6 backdrop-blur-sm">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-6">
            All Projects ({projects.length})
          </h2>

          {projects.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <p className="text-gray-400 mb-4">No projects yet.</p>
              <Button
                onClick={handleCreate}
                className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-200 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Project
              </Button>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="border border-white/10 rounded-xl p-4 md:p-6 bg-white/5 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                    {project.image && (
                      <div className="flex-shrink-0 w-full sm:w-32 h-32 relative">
                        <Image
                          src={project.image}
                          alt={project.projectName}
                          fill
                          className="object-cover rounded-xl border border-white/10"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg md:text-xl font-semibold text-white mb-3">
                            {project.projectName}
                          </h3>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-400 mb-4">
                            <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs sm:text-sm font-medium w-fit">
                              {project.tagline}
                            </span>
                            <span className="text-gray-500 text-xs sm:text-sm">
                              {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(project)}
                            className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-200"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm md:text-base mb-4 leading-relaxed">
                        {project.shortDes}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.techStack?.slice(0, 6).map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 md:px-3 py-1 md:py-1.5 bg-white/10 text-gray-300 text-xs md:text-sm rounded-lg border border-white/10 hover:bg-white/20 transition-all duration-200"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack?.length > 6 && (
                          <span className="px-2 md:px-3 py-1 md:py-1.5 bg-white/10 text-gray-400 text-xs md:text-sm rounded-lg border border-white/10">
                            +{project.techStack.length - 6} more
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                        {project.liveSite && (
                          <a
                            href={project.liveSite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-all duration-200 w-full sm:w-auto justify-center sm:justify-start"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Live Site
                          </a>
                        )}
                        {project?.githubRepo && (
                          <a
                            href={project.githubRepo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm text-gray-400 hover:text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-200 w-full sm:w-auto justify-center sm:justify-start"
                          >
                            <ExternalLink className="w-4 h-4" />
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
