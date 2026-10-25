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
import {
  Plus,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Layers,
  Terminal,
  FileCode,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { createProject } from "@/actions/projects/createProject";
import { deleteProject } from "@/actions/projects/deleteProject";
import getProjects from "@/helper/getProjects";
import getEachProject from "@/helper/getEachProject";
import Image from "next/image";

interface Project {
  _id: string;
  image: string;
  images?: string[];
  projectName: string;
  tagline: string;
  role?: string;
  status?: string;
  shortDes?: string;
  techStack: string[];
  liveSite?: string;
  frontendRepo?: string;
  backendRepo?: string;
  backendLive?: string;
  rerankerRepo?: string;
  demoCheckerRepo?: string;
  technicalHighlights?: string;
  projectType: "client project" | "personal project";
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;

  // The 7 Case Study Framework Sections (strictly matching output.md)
  overview?: string;
  problem?: string;
  myContribution?: string;
  architecture?: string;
  keyDecisions?: string;
  resultsEvidence?: string;
  limitationsNextSteps?: string;

  // Legacy fields preserved for backward compatibility
  problemSolution?: string;
  features?: string[];
  dependencies?: string[] | string;
  responsibilities?: string;
}

interface ProjectFormValues {
  projectName: string;
  tagline: string;
  role?: string;
  status?: string;
  shortDes?: string;
  techStack: string;
  liveSite?: string;
  frontendRepo?: string;
  backendRepo?: string;
  backendLive?: string;
  rerankerRepo?: string;
  demoCheckerRepo?: string;
  technicalHighlights?: string;
  projectType: "client project" | "personal project";

  // Case Study Sections
  overview?: string;
  problem?: string;
  myContribution?: string;
  architecture?: string;
  keyDecisions?: string;
  resultsEvidence?: string;
  limitationsNextSteps?: string;

  // Legacy fields
  problemSolution?: string;
  features?: string;
  dependencies?: string;
  responsibilities?: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showLegacyFields, setShowLegacyFields] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>([]);

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
      tagline: "",
      role: "",
      status: "",
      shortDes: "",
      techStack: "",
      liveSite: "",
      frontendRepo: "",
      backendRepo: "",
      backendLive: "",
      rerankerRepo: "",
      demoCheckerRepo: "",
      technicalHighlights: "",
      projectType: "personal project",
      overview: "",
      problem: "",
      myContribution: "",
      architecture: "",
      keyDecisions: "",
      resultsEvidence: "",
      limitationsNextSteps: "",
      problemSolution: "",
      features: "",
      dependencies: "",
      responsibilities: "",
    },
  });

  const projectType = watch("projectType");

  const originalGallery =
    editingProject?.images && editingProject.images.length > 0
      ? editingProject.images
      : editingProject?.image
      ? [editingProject.image]
      : [];

  const hasGalleryChanges = isEditing
    ? galleryFiles.length > 0 ||
      JSON.stringify(existingGalleryImages) !== JSON.stringify(originalGallery)
    : galleryFiles.length > 0;

  const hasChanges = isDirty || (files && files.length > 0) || hasGalleryChanges;

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
    setShowLegacyFields(false);
    setFiles([]);
    setGalleryFiles([]);
    setExistingGalleryImages([]);
    reset({
      projectName: "",
      tagline: "",
      role: "Full-Stack Developer · Solo Project",
      status: "Completed",
      shortDes: "",
      techStack: "",
      liveSite: "",
      frontendRepo: "",
      backendRepo: "",
      backendLive: "",
      rerankerRepo: "",
      demoCheckerRepo: "",
      technicalHighlights: "",
      projectType: "personal project",
      overview: "",
      problem: "",
      myContribution: "",
      architecture: "",
      keyDecisions: "",
      resultsEvidence: "",
      limitationsNextSteps: "",
      problemSolution: "",
      features: "",
      dependencies: "",
      responsibilities: "",
    });
  };

  const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      setGalleryFiles((prev) => [...prev, ...selected]);
      e.target.value = "";
    }
  };

  const removeGalleryFile = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingGalleryImages((prev) => prev.filter((_, i) => i !== index));
    toast.success("Image removed from gallery (click Update to save)");
  };

  const handleEdit = async (project: Project) => {
    setIsEditing(true);
    setEditingProject(project);
    setShowForm(true);
    setFiles([]);
    setGalleryFiles([]);

    const initialGallery =
      project.images && project.images.length > 0
        ? project.images
        : project.image
        ? [project.image]
        : [];
    setExistingGalleryImages(initialGallery);

    try {
      const fresh = await getEachProject(project._id);
      const resetValues: ProjectFormValues = {
        projectName: fresh?.projectName || project.projectName || "",
        tagline: fresh?.tagline || project.tagline || "",
        role: fresh?.role || project.role || "",
        status: fresh?.status || project.status || "",
        shortDes: fresh?.shortDes || project.shortDes || "",
        liveSite: fresh?.liveSite || project.liveSite || "",
        frontendRepo: fresh?.frontendRepo || project.frontendRepo || "",
        backendRepo: fresh?.backendRepo || project.backendRepo || "",
        backendLive: fresh?.backendLive || project.backendLive || "",
        rerankerRepo: fresh?.rerankerRepo || project.rerankerRepo || "",
        demoCheckerRepo: fresh?.demoCheckerRepo || project.demoCheckerRepo || "",
        technicalHighlights:
          fresh?.technicalHighlights || project.technicalHighlights || "",
        projectType:
          (fresh?.projectType as "client project" | "personal project") ||
          (project.projectType as "client project" | "personal project") ||
          "personal project",
        overview: fresh?.overview || project.overview || "",
        problem: fresh?.problem || project.problem || "",
        myContribution: fresh?.myContribution || project.myContribution || "",
        architecture: fresh?.architecture || project.architecture || "",
        keyDecisions: fresh?.keyDecisions || project.keyDecisions || "",
        resultsEvidence: fresh?.resultsEvidence || project.resultsEvidence || "",
        limitationsNextSteps:
          fresh?.limitationsNextSteps || project.limitationsNextSteps || "",
        techStack: Array.isArray(fresh?.techStack || project.techStack)
          ? (fresh?.techStack || project.techStack).join(", ")
          : "",
        problemSolution:
          fresh?.problemSolution || project.problemSolution || "",
        responsibilities:
          fresh?.responsibilities || project.responsibilities || "",
        features: Array.isArray(fresh?.features || project.features)
          ? (fresh?.features || project.features).join(", ")
          : "",
        dependencies: Array.isArray(fresh?.dependencies || project.dependencies)
          ? (fresh?.dependencies || project.dependencies).join(", ")
          : String(fresh?.dependencies ?? project.dependencies ?? ""),
      };
      reset(resetValues);
    } catch {
      const resetValues: ProjectFormValues = {
        projectName: project.projectName || "",
        tagline: project.tagline || "",
        role: project.role || "",
        status: project.status || "",
        shortDes: project.shortDes || "",
        liveSite: project.liveSite || "",
        frontendRepo: project.frontendRepo || "",
        backendRepo: project.backendRepo || "",
        backendLive: project.backendLive || "",
        rerankerRepo: project.rerankerRepo || "",
        demoCheckerRepo: project.demoCheckerRepo || "",
        technicalHighlights: project.technicalHighlights || "",
        projectType: project.projectType || "personal project",
        overview: project.overview || "",
        problem: project.problem || "",
        myContribution: project.myContribution || "",
        architecture: project.architecture || "",
        keyDecisions: project.keyDecisions || "",
        resultsEvidence: project.resultsEvidence || "",
        limitationsNextSteps: project.limitationsNextSteps || "",
        techStack: Array.isArray(project.techStack)
          ? project.techStack.join(", ")
          : "",
        problemSolution: project.problemSolution || "",
        responsibilities: project.responsibilities || "",
        features: Array.isArray(project.features)
          ? project.features.join(", ")
          : "",
        dependencies: Array.isArray(project.dependencies)
          ? project.dependencies.join(", ")
          : String(project.dependencies ?? ""),
      };
      reset(resetValues);
    }
  };

  const handleDelete = async (projectId: string, projectName: string) => {
    if (
      confirm(
        `Are you sure you want to delete "${projectName}"? This action cannot be undone.`
      )
    ) {
      try {
        const result = await deleteProject(projectId);
        if (result?.success) {
          setProjects(projects.filter((project) => project._id !== projectId));
          toast.success("Project deleted successfully! 🗑️");
        } else {
          toast.error(result?.message || "Failed to delete project");
        }
      } catch (error) {
        console.error("Failed to delete project:", error);
        toast.error("Failed to delete project");
      }
    }
  };

  const handleToggleActive = async (project: Project) => {
    try {
      const newStatus = project.isActive === false ? true : false;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/projects/${project._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: newStatus }),
          credentials: "include",
        }
      );
      const result = await res.json();
      if (!res.ok || !result?.success) {
        toast.error(result?.message || "Failed to update project status");
        return;
      }
      toast.success(
        `Project marked as ${newStatus ? "active" : "inactive"}!`
      );
      setProjects((prev) =>
        prev.map((p) =>
          p._id === project._id ? { ...p, isActive: newStatus } : p
        )
      );
    } catch (error) {
      console.error("Failed to toggle project status:", error);
      toast.error("Failed to toggle project status");
    }
  };

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      if (files.length === 0 && galleryFiles.length === 0 && !isEditing) {
        toast.error("Please upload at least a card thumbnail image");
        return;
      }

      if (isEditing && !hasChanges) {
        toast.error("No changes detected. Please modify at least one field.");
        return;
      }

      const formData = new FormData();

      // Thumbnail file (card image)
      if (files.length > 0) {
        formData.append("thumbnail", files[0]);
      } else if (galleryFiles.length > 0 && !isEditing) {
        formData.append("thumbnail", galleryFiles[0]);
      }

      // Existing images to keep in gallery
      if (isEditing || existingGalleryImages.length > 0) {
        formData.append("existingImages", JSON.stringify(existingGalleryImages));
      }

      // Multiple new gallery image files
      galleryFiles.forEach((file) => {
        formData.append("images", file);
      });

      if (isEditing && editingProject) {
        // For updates, append changed fields
        if (dirtyFields.projectName) {
          formData.append("projectName", data.projectName);
        }
        if (dirtyFields.tagline) {
          formData.append("tagline", data.tagline);
        }
        if (dirtyFields.role) {
          formData.append("role", data.role || "");
        }
        if (dirtyFields.status) {
          formData.append("status", data.status || "");
        }
        if (dirtyFields.shortDes || (dirtyFields.overview && !data.shortDes)) {
          formData.append("shortDes", data.shortDes || data.overview || "");
        }
        if (dirtyFields.liveSite) {
          formData.append("liveSite", data.liveSite || "");
        }
        if (dirtyFields.frontendRepo) {
          formData.append("frontendRepo", data.frontendRepo || "");
        }
        if (dirtyFields.backendRepo) {
          formData.append("backendRepo", data.backendRepo || "");
        }
        if (dirtyFields.backendLive) {
          formData.append("backendLive", data.backendLive || "");
        }
        if (dirtyFields.rerankerRepo) {
          formData.append("rerankerRepo", data.rerankerRepo || "");
        }
        if (dirtyFields.demoCheckerRepo) {
          formData.append("demoCheckerRepo", data.demoCheckerRepo || "");
        }
        if (dirtyFields.technicalHighlights) {
          formData.append(
            "technicalHighlights",
            data.technicalHighlights || ""
          );
        }
        if (dirtyFields.projectType) {
          formData.append("projectType", data.projectType);
        }
        if (dirtyFields.overview) {
          formData.append("overview", data.overview || "");
        }
        if (dirtyFields.problem) {
          formData.append("problem", data.problem || "");
        }
        if (dirtyFields.myContribution) {
          formData.append("myContribution", data.myContribution || "");
        }
        if (dirtyFields.architecture) {
          formData.append("architecture", data.architecture || "");
        }
        if (dirtyFields.keyDecisions) {
          formData.append("keyDecisions", data.keyDecisions || "");
        }
        if (dirtyFields.resultsEvidence) {
          formData.append("resultsEvidence", data.resultsEvidence || "");
        }
        if (dirtyFields.limitationsNextSteps) {
          formData.append(
            "limitationsNextSteps",
            data.limitationsNextSteps || ""
          );
        }
        if (dirtyFields.techStack) {
          const techStackArray = data.techStack
            .split(",")
            .map((tech) => tech.trim().replace(/\.$/, ""))
            .filter((tech) => tech !== "");
          formData.append("techStack", JSON.stringify(techStackArray));
        }
        if (dirtyFields.problemSolution) {
          formData.append("problemSolution", data.problemSolution || "");
        }
        if (dirtyFields.responsibilities) {
          formData.append("responsibilities", data.responsibilities || "");
        }
        if (dirtyFields.features) {
          const featuresArray = (data.features || "")
            .split(",")
            .map((feature) => feature.trim().replace(/\.$/, ""))
            .filter((feature) => feature !== "");
          formData.append("features", JSON.stringify(featuresArray));
        }
        if (dirtyFields.dependencies) {
          formData.append("dependencies", data.dependencies || "");
        }
      } else {
        // For create, send all fields
        const techStackArray = data.techStack
          .split(",")
          .map((tech) => tech.trim().replace(/\.$/, ""))
          .filter((tech) => tech !== "");

        formData.append("projectName", data.projectName);
        formData.append("tagline", data.tagline);
        formData.append("role", data.role || "Full-Stack Developer · Solo Project");
        formData.append("status", data.status || "Completed");
        formData.append("shortDes", data.shortDes || data.overview || "");
        formData.append("techStack", JSON.stringify(techStackArray));
        formData.append("liveSite", data.liveSite || "");
        formData.append("frontendRepo", data.frontendRepo || "");
        formData.append("backendRepo", data.backendRepo || "");
        formData.append("backendLive", data.backendLive || "");
        formData.append("rerankerRepo", data.rerankerRepo || "");
        formData.append("demoCheckerRepo", data.demoCheckerRepo || "");
        formData.append("technicalHighlights", data.technicalHighlights || "");
        formData.append("projectType", data.projectType || "personal project");
        formData.append("overview", data.overview || "");
        formData.append("problem", data.problem || "");
        formData.append("myContribution", data.myContribution || "");
        formData.append("architecture", data.architecture || "");
        formData.append("keyDecisions", data.keyDecisions || "");
        formData.append("resultsEvidence", data.resultsEvidence || "");
        formData.append("limitationsNextSteps", data.limitationsNextSteps || "");
        formData.append("problemSolution", data.problemSolution || "");
        formData.append("responsibilities", data.responsibilities || "");
        formData.append("dependencies", data.dependencies || "");

        if (data.features) {
          const featuresArray = data.features
            .split(",")
            .map((f) => f.trim().replace(/\.$/, ""))
            .filter((f) => f !== "");
          formData.append("features", JSON.stringify(featuresArray));
        }
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
        setGalleryFiles([]);
        setExistingGalleryImages([]);
        reset();
        fetchProjects();
      } else {
        const result = await createProject(formData);
        if (result?.success) {
          toast.success("Project created successfully! 🚀");
          setShowForm(false);
          setFiles([]);
          setGalleryFiles([]);
          setExistingGalleryImages([]);
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
    setGalleryFiles([]);
    setExistingGalleryImages([]);
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Project Management
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-400">
            Create, edit, and manage your portfolio projects & 7-pillar case studies.
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

      {/* Project Form (Create / Edit) */}
      {showForm && (
        <div className="rounded-2xl border border-white/10 bg-[#141416]/90 p-5 md:p-8 backdrop-blur-md shadow-2xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-white/10">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                {isEditing ? "Project Editor" : "New Entry"}
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                {isEditing
                  ? `Edit: ${editingProject?.projectName}`
                  : "Create New Project"}
              </h2>
            </div>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-white/10 text-gray-300 hover:bg-white/5 w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* 1. Core Identification & Role */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white font-semibold text-sm uppercase tracking-wide border-b border-white/10 pb-2">
                <Layers className="h-4 w-4 text-emerald-400" />
                <span>1. Core Metadata & Status</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1">
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    placeholder="e.g. DocHook RAG"
                    {...register("projectName")}
                    className="mt-1.5"
                    required
                  />
                </div>

                <div className="lg:col-span-2">
                  <Label htmlFor="tagline">Tagline *</Label>
                  <Input
                    id="tagline"
                    placeholder="e.g. Document Intelligence & High-Speed Neural Retrieval Engine"
                    {...register("tagline")}
                    className="mt-1.5"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role / Authorship</Label>
                  <Input
                    id="role"
                    placeholder="e.g. Full-Stack & AI Systems · Solo Project"
                    {...register("role")}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="status">Development Status</Label>
                  <Input
                    id="status"
                    placeholder="e.g. Completed (Focusing on Limitations & Next Steps)"
                    {...register("status")}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="projectType">Project Classification</Label>
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
                    <SelectTrigger id="projectType" className="mt-1.5 w-full">
                      <SelectValue placeholder="Select classification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal project">
                        Personal / Engineering System
                      </SelectItem>
                      <SelectItem value="client project">
                        Client / Commercial Project
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* 2. Repository & Deployment Links */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white font-semibold text-sm uppercase tracking-wide border-b border-white/10 pb-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span>2. Repositories & Live Deployments</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="liveSite">Live App URL</Label>
                  <Input
                    id="liveSite"
                    type="url"
                    placeholder="https://..."
                    {...register("liveSite")}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="frontendRepo">Frontend GitHub Repo</Label>
                  <Input
                    id="frontendRepo"
                    type="url"
                    placeholder="https://github.com/..."
                    {...register("frontendRepo")}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="backendRepo">Backend GitHub Repo</Label>
                  <Input
                    id="backendRepo"
                    type="url"
                    placeholder="https://github.com/..."
                    {...register("backendRepo")}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="backendLive">Backend API Live URL</Label>
                  <Input
                    id="backendLive"
                    type="url"
                    placeholder="https://api..."
                    {...register("backendLive")}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="rerankerRepo">Reranker Service Repo</Label>
                  <Input
                    id="rerankerRepo"
                    type="url"
                    placeholder="https://github.com/...reranker"
                    {...register("rerankerRepo")}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="demoCheckerRepo">Simulation / Checker Repo</Label>
                  <Input
                    id="demoCheckerRepo"
                    type="url"
                    placeholder="https://github.com/...checker"
                    {...register("demoCheckerRepo")}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            {/* 3. Media & Multi-Image Gallery */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white font-semibold text-sm uppercase tracking-wide border-b border-white/10 pb-2">
                <ImageIcon className="h-4 w-4 text-emerald-400" />
                <span>3. Screenshots & Visual Assets</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 3A. Card Thumbnail */}
                <div className="rounded-xl border border-white/10 bg-black/20 p-4 space-y-3">
                  <div>
                    <Label className="text-sm font-semibold text-white">
                      Card Thumbnail (Preview Image)
                    </Label>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Main image displayed on the project card in portfolio grids.
                    </p>
                  </div>

                  {isEditing && editingProject?.image && (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                      <Image
                        src={editingProject.image}
                        alt="Current thumbnail"
                        fill
                        className="object-cover object-top"
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-[11px] text-zinc-300 font-mono">
                        Active Thumbnail
                      </span>
                    </div>
                  )}

                  <FileUpload onChange={setFiles} />
                </div>

                {/* 3B. Multi-Image Gallery for Details Modal */}
                <div className="rounded-xl border border-white/10 bg-black/20 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <Label className="text-sm font-semibold text-white">
                        Modal Gallery Screenshots
                      </Label>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Appears inside the project details carousel & lightbox.
                      </p>
                    </div>

                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold cursor-pointer transition-all active:scale-95">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Add Images</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleGalleryFilesChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Existing Saved Gallery */}
                  {existingGalleryImages.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs text-zinc-400 font-medium">
                        Saved Gallery ({existingGalleryImages.length}):
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {existingGalleryImages.map((imgUrl, idx) => (
                          <div
                            key={`existing-${idx}`}
                            className="group relative h-20 rounded-lg overflow-hidden border border-white/10 bg-black/50"
                          >
                            <img
                              src={imgUrl}
                              alt={`Gallery ${idx + 1}`}
                              className="w-full h-full object-cover object-top"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(idx)}
                              className="absolute top-1 right-1 p-1 rounded-md bg-red-600/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove image"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <span className="absolute bottom-1 left-1 px-1 rounded bg-black/70 text-[9px] text-zinc-300 font-mono">
                              #{idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Newly Selected Files */}
                  {galleryFiles.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Ready to Upload ({galleryFiles.length}):</span>
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {galleryFiles.map((file, idx) => (
                          <div
                            key={`new-${idx}`}
                            className="group relative h-20 rounded-lg overflow-hidden border border-emerald-500/40 bg-emerald-950/20"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover object-top"
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryFile(idx)}
                              className="absolute top-1 right-1 p-1 rounded-md bg-red-600/80 hover:bg-red-600 text-white"
                              title="Cancel upload"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <span className="absolute top-1 left-1 px-1 rounded bg-emerald-500 text-black font-bold text-[8px]">
                              NEW
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {existingGalleryImages.length === 0 &&
                    galleryFiles.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-6 border border-dashed border-white/10 rounded-xl text-center">
                        <ImageIcon className="w-6 h-6 text-zinc-500 mb-1" />
                        <p className="text-xs text-zinc-400">
                          No extra screenshots added
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* 4. Tech Stack & Summary */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white font-semibold text-sm uppercase tracking-wide border-b border-white/10 pb-2">
                <FileCode className="h-4 w-4 text-emerald-400" />
                <span>4. Tech Stack & Card Summary</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="techStack">Tech Stack * (Comma separated)</Label>
                  <Textarea
                    id="techStack"
                    placeholder="NestJS, TypeScript, Python, FastAPI, MongoDB Atlas, Redis, BullMQ, Gemini AI"
                    {...register("techStack")}
                    className="mt-1.5 min-h-[90px]"
                    required
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Enter technologies separated by commas.
                  </p>
                </div>

                <div>
                  <Label htmlFor="shortDes">
                    Minimum Card Description (Overview Excerpt)
                  </Label>
                  <Textarea
                    id="shortDes"
                    placeholder="Leave blank to automatically sync from Section 1 Overview..."
                    {...register("shortDes")}
                    className="mt-1.5 min-h-[90px]"
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Displayed on the portfolio project card (clamped to 2 lines).
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="technicalHighlights">Technical Highlights</Label>
                <Textarea
                  id="technicalHighlights"
                  placeholder="Key technical highlights, e.g. Two-Stage Neural Search (Vector + Cross-Encoder), Local ONNX MiniLM Embedding Service (Zero API Bill)..."
                  {...register("technicalHighlights")}
                  className="mt-1.5 min-h-[80px]"
                />
              </div>
            </div>

            {/* 5. Case Study Framework (The 7 Pillars strictly following output.md) */}
            <div className="space-y-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/5 p-5 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-base tracking-wide">
                  <Sparkles className="h-5 w-5" />
                  <span>Case Study Framework (7 Sections - Strictly Following output.md)</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Standardized Case Study
                </span>
              </div>

              {/* 1. Overview */}
              <div>
                <Label htmlFor="overview" className="text-sm font-semibold text-zinc-200">
                  Section 1. Overview
                </Label>
                <Textarea
                  id="overview"
                  placeholder="Clear, conversational description of what the platform is, who uses it, and the end-to-end user experience..."
                  {...register("overview")}
                  className="mt-1.5 min-h-[100px] leading-relaxed"
                />
              </div>

              {/* 2. Problem */}
              <div>
                <Label htmlFor="problem" className="text-sm font-semibold text-zinc-200">
                  Section 2. Problem (What was broken & failure risks)
                </Label>
                <Textarea
                  id="problem"
                  placeholder="- What was the original problem?\n- What would happen if the system failed?"
                  {...register("problem")}
                  className="mt-1.5 min-h-[100px] leading-relaxed"
                />
              </div>

              {/* 3. My Contribution */}
              <div>
                <Label htmlFor="myContribution" className="text-sm font-semibold text-zinc-200">
                  Section 3. My Contribution (Personal ownership & implemented components)
                </Label>
                <Textarea
                  id="myContribution"
                  placeholder="- What did you personally own?\n- Which components did you implement?\n- What decisions did you make independently?"
                  {...register("myContribution")}
                  className="mt-1.5 min-h-[130px] leading-relaxed"
                />
              </div>

              {/* 4. Architecture */}
              <div>
                <Label htmlFor="architecture" className="text-sm font-semibold text-zinc-200">
                  Section 4. Architecture (ASCII Diagram & Numbered Data Flows)
                </Label>
                <Textarea
                  id="architecture"
                  placeholder="┌─────────────┐\n│   Client    │\n└──────┬──────┘\n       ▼\nData flows..."
                  {...register("architecture")}
                  className="mt-1.5 min-h-[180px] font-mono text-xs leading-relaxed bg-black/40"
                />
              </div>

              {/* 5. Three Key Decisions */}
              <div>
                <Label htmlFor="keyDecisions" className="text-sm font-semibold text-zinc-200">
                  Section 5. Three Key Engineering Decisions (Tradeoffs & Rationale)
                </Label>
                <Textarea
                  id="keyDecisions"
                  placeholder="Decision 1: ...\n- Why this choice?\n- Tradeoff accepted:\n- Alternatives discarded:\n\nDecision 2: ..."
                  {...register("keyDecisions")}
                  className="mt-1.5 min-h-[140px] leading-relaxed"
                />
              </div>

              {/* 6. Results and Evidence */}
              <div>
                <Label htmlFor="resultsEvidence" className="text-sm font-semibold text-zinc-200">
                  Section 6. Results and Evidence (Concrete metrics, speedups, reliability)
                </Label>
                <Textarea
                  id="resultsEvidence"
                  placeholder="Concrete metrics, latency numbers, token savings, benchmarks, and verifiable outcomes..."
                  {...register("resultsEvidence")}
                  className="mt-1.5 min-h-[110px] leading-relaxed"
                />
              </div>

              {/* 7. Limitations and Next Steps */}
              <div>
                <Label htmlFor="limitationsNextSteps" className="text-sm font-semibold text-zinc-200">
                  Section 7. Limitations and Next Steps
                </Label>
                <Textarea
                  id="limitationsNextSteps"
                  placeholder="Known constraints, cold starts, high-load edge cases, and future engineering milestones..."
                  {...register("limitationsNextSteps")}
                  className="mt-1.5 min-h-[110px] leading-relaxed"
                />
              </div>
            </div>

            {/* 6. Legacy / Extra Fields (Collapsible) */}
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <button
                type="button"
                onClick={() => setShowLegacyFields(!showLegacyFields)}
                className="flex items-center justify-between w-full text-left text-sm font-medium text-zinc-400 hover:text-white"
              >
                <span>Additional Legacy Fields (Problem & Solution, Features, Dependencies)</span>
                {showLegacyFields ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {showLegacyFields && (
                <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                  <div>
                    <Label htmlFor="problemSolution">Legacy Problem & Solution</Label>
                    <Textarea
                      id="problemSolution"
                      placeholder="What problem does this project solve and how?"
                      {...register("problemSolution")}
                      className="mt-1.5 min-h-[90px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="features">Key Features (Comma separated)</Label>
                      <Textarea
                        id="features"
                        placeholder="Feature 1, Feature 2, Feature 3"
                        {...register("features")}
                        className="mt-1.5 min-h-[80px]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="dependencies">Key Dependencies</Label>
                      <Textarea
                        id="dependencies"
                        placeholder="axios, framer-motion, tailwindcss"
                        {...register("dependencies")}
                        className="mt-1.5 min-h-[80px]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="responsibilities">Responsibilities</Label>
                    <Textarea
                      id="responsibilities"
                      placeholder="What was your role and responsibilities in this project?"
                      {...register("responsibilities")}
                      className="mt-1.5 min-h-[80px]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t border-white/10">
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

      {/* Projects List View */}
      {!showForm && (
        <div className="rounded-2xl border border-white/10 bg-[#141416]/90 p-5 md:p-8 backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              All Projects ({projects.length})
            </h2>
            <span className="text-xs text-zinc-400 font-mono">
              Live & Case Study Status
            </span>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No projects found in database.</p>
              <Button
                onClick={handleCreate}
                className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Project
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              {projects.map((project) => {
                const hasFullCaseStudy = Boolean(
                  project.overview &&
                    project.architecture &&
                    project.keyDecisions &&
                    project.limitationsNextSteps
                );

                return (
                  <div
                    key={project._id}
                    className="border border-white/10 rounded-2xl p-5 md:p-6 bg-[#161618] hover:border-emerald-500/30 transition-all duration-300 shadow-lg"
                  >
                    <div className="flex flex-col md:flex-row items-start gap-5">
                      {/* Thumbnail Preview */}
                      {project.image ? (
                        <div className="flex-shrink-0 w-full md:w-44 h-32 relative rounded-xl overflow-hidden border border-white/10 bg-black/40">
                          <Image
                            src={project.image}
                            alt={project.projectName}
                            fill
                            className="object-cover object-top"
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-full md:w-44 h-32 rounded-xl border border-white/10 bg-black/40 flex items-center justify-center">
                          <span className="text-lg font-bold text-emerald-400">
                            {project.projectName.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0 w-full space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg md:text-xl font-bold text-white">
                                {project.projectName}
                              </h3>

                              {/* Case Study Badge */}
                              {hasFullCaseStudy ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                                  <Sparkles className="w-3 h-3" />
                                  7-Section Case Study
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800 text-zinc-400 border border-white/5">
                                  Standard Info
                                </span>
                              )}

                              {project.isActive === false && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                  Hidden (Inactive)
                                </span>
                              )}
                            </div>

                            <p className="text-xs sm:text-sm text-emerald-400/90 font-medium mt-1">
                              {project.tagline}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(project)}
                              className="border-white/10 text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-300 transition-all duration-200"
                              title="Edit Project & Case Study"
                            >
                              <Edit className="w-4 h-4 mr-1.5" />
                              <span>Edit</span>
                            </Button>
                            <Button
                              size="sm"
                              variant={
                                project.isActive !== false ? "default" : "outline"
                              }
                              onClick={() => handleToggleActive(project)}
                              className={
                                project.isActive !== false
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                                  : "border-white/10 text-gray-400 hover:bg-white/5"
                              }
                              title={
                                project.isActive !== false
                                  ? "Active (Visible in portfolio)"
                                  : "Inactive (Hidden)"
                              }
                            >
                              {project.isActive !== false ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleDelete(project._id, project.projectName)
                              }
                              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                              title="Delete Project"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Meta Tags: Role & Status */}
                        {(project.role || project.status) && (
                          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                            {project.role && (
                              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                                <strong>Role:</strong> {project.role}
                              </span>
                            )}
                            {project.status && (
                              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                                <strong>Status:</strong> {project.status}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Description (Overview / shortDes) */}
                        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed line-clamp-2">
                          {project.overview || project.shortDes}
                        </p>

                        {/* Tech Stack Pills */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {project.techStack?.slice(0, 6).map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-white/5 text-zinc-300 text-xs border border-white/10 font-mono"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.techStack?.length > 6 && (
                            <span className="px-2 py-0.5 rounded-md bg-white/5 text-zinc-500 text-xs border border-white/10 font-mono">
                              +{project.techStack.length - 6} more
                            </span>
                          )}
                        </div>

                        {/* Available Links Row */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                          {project.liveSite && (
                            <a
                              href={project.liveSite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Live Site</span>
                            </a>
                          )}
                          {project.frontendRepo && (
                            <a
                              href={project.frontendRepo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-all"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Frontend Repo</span>
                            </a>
                          )}
                          {project.backendRepo && (
                            <a
                              href={project.backendRepo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-all"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Backend Repo</span>
                            </a>
                          )}
                          {project.backendLive && (
                            <a
                              href={project.backendLive}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Backend API</span>
                            </a>
                          )}
                          {project.rerankerRepo && (
                            <a
                              href={project.rerankerRepo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Reranker Repo</span>
                            </a>
                          )}
                          {project.demoCheckerRepo && (
                            <a
                              href={project.demoCheckerRepo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Demo Checker</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
