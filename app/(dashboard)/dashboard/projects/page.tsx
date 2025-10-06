"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { createProject } from "@/actions/projects/createProject";

interface ProjectFormValues {
  projectName: string;
  shortDes: string;
  techStacks: string;
  liveSite: string;
}

export default function Projects() {
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<ProjectFormValues>({
    defaultValues: {
      projectName: "",
      shortDes: "",
      techStacks: "",
      liveSite: "",
    },
  });

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
    console.log("Uploaded files:", uploadedFiles);
  };

  const onSubmit = async (data: ProjectFormValues) => {
    console.log("Project data:", data);
    console.log("Uploaded image:", files[0]);

    if (files.length === 0) {
      alert("Please upload a project image");
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();

    // Append the image file (backend expects "files" field)
    formData.append("files", files[0]);

    // Transform and append techStacks as array
    const techStacksArray = data.techStacks
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech !== "");

    // Append other fields
    formData.append("projectName", data.projectName);
    formData.append("shortDes", data.shortDes);
    formData.append("liveSite", data.liveSite);
    formData.append("techStacks", JSON.stringify(techStacksArray));

    try {
      const result = await createProject(formData);
      console.log("Result:", result);

      if (result?.success) {
        alert("Project created successfully!");
      } else {
        alert(result?.message || "Failed to create project");
      }
    } catch (error) {
      console.error("Failed to create project:", error);
      alert("Failed to create project");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Add Project
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Showcase your projects with images and details.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Image Upload Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Project Image
          </h2>
          <div className="w-full max-w-4xl mx-auto">
            <FileUpload onChange={handleFileUpload} />
          </div>
        </div>

        {/* Project Information Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Project Information
          </h2>

          <div className="space-y-6">
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
              <Label htmlFor="shortDes">Short Description</Label>
              <Textarea
                id="shortDes"
                placeholder="Describe your project in a few sentences..."
                {...register("shortDes")}
                className="mt-2 min-h-[100px]"
                required
              />
            </div>

            <div>
              <Label htmlFor="techStacks">Tech Stacks</Label>
              <Textarea
                id="techStacks"
                placeholder="React, Next.js, TypeScript, MongoDB"
                {...register("techStacks")}
                className="mt-2"
                required
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Separate technologies with commas
              </p>
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
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="submit"
            size="lg"
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Project
          </Button>
        </div>
      </form>
    </div>
  );
}
