"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { AlertCircle } from "lucide-react";
import { createProject } from "@/actions/projects/createProject";
import { projectSchema, type ProjectFormValues } from "@/lib/validation";
import { withErrorHandling } from "@/lib/error-handler";


interface AddProjectsProps {
  files: File[];
  setFiles: (files: File[]) => void;
}

export default function AddProjects({ files, setFiles }: AddProjectsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    mode: "onBlur",
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

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
  };

  const onSubmit = async (data: ProjectFormValues) => {
    if (files.length === 0) {
      return;
    }

    setIsSubmitting(true);

    await withErrorHandling(
      async () => {
        const formData = new FormData();
        formData.append("files", files[0]);

        const techStackString = data.techStack ?? "";
        const featuresString = data.features ?? "";
        const dependenciesString = data.dependencies ?? "";

        formData.append("projectName", data.projectName);
        formData.append("shortDes", data.shortDes);
        formData.append("techStack", techStackString);
        formData.append("liveSite", data.liveSite || "");
        formData.append("tagline", data.tagline);
        formData.append("problemSolution", data.problemSolution);
        formData.append("features", featuresString);
        formData.append("dependencies", dependenciesString);
        formData.append("responsibilities", data.responsibilities);
        formData.append("githubRepo", data.githubRepo || "");

        const result = await createProject(formData);

        if (!result?.success) {
          throw new Error(result?.message || "Failed to create project");
        }

        return result;
      },
      {
        successMessage: "Project created successfully! 🚀",
        errorMessage: "Failed to create project. Please try again.",
        onSuccess: () => {
          reset();
          setFiles([]);
        },
      }
    );

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-white mb-6">
          Project Image
        </h2>
        <div className="w-full max-w-4xl mx-auto">
          <FileUpload onChange={handleFileUpload} />
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-white mb-6">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              placeholder="e.g., MadChef - Restaurant Management App"
              {...register("projectName")}
              className={`mt-2 ${errors.projectName ? "border-red-500 focus:border-red-500" : ""}`}
              disabled={isSubmitting}
            />
            {errors.projectName && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.projectName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              placeholder="A catchy tagline for your project"
              {...register("tagline")}
              className={`mt-2 ${errors.tagline ? "border-red-500 focus:border-red-500" : ""}`}
              disabled={isSubmitting}
            />
            {errors.tagline && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.tagline.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="shortDes">Short Description</Label>
            <Textarea
              id="shortDes"
              placeholder="Brief description of your project..."
              {...register("shortDes")}
              className={`mt-2 min-h-[80px] ${errors.shortDes ? "border-red-500 focus:border-red-500" : ""}`}
              disabled={isSubmitting}
            />
            {errors.shortDes && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.shortDes.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="liveSite">Live Site URL</Label>
            <Input
              id="liveSite"
              type="url"
              placeholder="https://example.com"
              {...register("liveSite")}
              className={`mt-2 ${errors.liveSite ? "border-red-500 focus:border-red-500" : ""}`}
              disabled={isSubmitting}
            />
            {errors.liveSite && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.liveSite.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="githubRepo">GitHub Repository</Label>
            <Input
              id="githubRepo"
              type="url"
              placeholder="https://github.com/username/repo"
              {...register("githubRepo")}
              className={`mt-2 ${errors.githubRepo ? "border-red-500 focus:border-red-500" : ""}`}
              disabled={isSubmitting}
            />
            {errors.githubRepo && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.githubRepo.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-white mb-6">
          Project Details
        </h2>

        <div className="space-y-6">
          <div>
            <Label htmlFor="problemSolution">Problem & Solution</Label>
            <Textarea
              id="problemSolution"
              placeholder="What problem does this project solve and how?"
              {...register("problemSolution")}
              className="mt-2 min-h-[120px]"
              
            />
          </div>

          <div>
            <Label htmlFor="features">Key Features</Label>
            <Textarea
              id="features"
              placeholder="Feature 1, Feature 2, Feature 3"
              {...register("features")}
              className="mt-2 min-h-[100px]"
              
            />
            <p className="text-sm text-gray-400 mt-1">
              Separate features with commas
            </p>
          </div>

          <div>
            <Label htmlFor="responsibilities">Your Responsibilities</Label>
            <Textarea
              id="responsibilities"
              placeholder="What was your role and responsibilities in this project?"
              {...register("responsibilities")}
              className="mt-2 min-h-[100px]"
              
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
            <Label htmlFor="techStack">Tech Stack</Label>
            <Textarea
              id="techStack"
              placeholder="React, Next.js, TypeScript, MongoDB"
              {...register("techStack")}
              className="mt-2 min-h-[100px]"
            />
            <p className="text-sm text-gray-400 mt-1">
              Separate technologies with commas
            </p>
          </div>

          <div>
            <Label htmlFor="dependencies">Key Dependencies</Label>
            <Textarea
              id="dependencies"
              placeholder="axios, framer-motion, tailwindcss"
              {...register("dependencies")}
              className="mt-2 min-h-[100px]"
              
            />
            <p className="text-sm text-gray-400 mt-1">
              Separate dependencies with commas
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || files.length === 0}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating Project..." : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
