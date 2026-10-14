"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import {
  User,
  Sparkles,
  Briefcase,
  Code,
  FileText,
  Mail,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import getAbout from "@/helper/getAbout";
import getProjects from "@/helper/getProjects";
import getSkills from "@/helper/getSkills";
import getBlogs from "@/helper/getBlogs";
import { updateAbout } from "@/actions/about/updateAbout";
import type { PortfolioData, AiTool, CoreStack } from "@/interfaces/interface";

interface HeroProfileFormValues {
  name: string;
  title: string;
  tagline: string;
  statusText: string;
  seekingRole: string;
  location: string;
  timezone: string;
  resumeUrl: string;
  avatar: string;
  aiTools: AiTool[];
  coreStack: CoreStack[];
}

export default function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutData, setAboutData] = useState<PortfolioData | null>(null);
  const [avatarFiles, setAvatarFiles] = useState<File[]>([]);
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    blogs: 0,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isDirty },
  } = useForm<HeroProfileFormValues>({
    defaultValues: {
      name: "",
      title: "",
      tagline: "",
      statusText: "",
      seekingRole: "",
      location: "",
      timezone: "",
      resumeUrl: "",
      avatar: "",
      aiTools: [],
      coreStack: [],
    },
  });

  const {
    fields: aiToolFields,
    append: appendAiTool,
    remove: removeAiTool,
  } = useFieldArray({
    control,
    name: "aiTools",
  });

  const {
    fields: coreStackFields,
    append: appendCoreStack,
    remove: removeCoreStack,
  } = useFieldArray({
    control,
    name: "coreStack",
  });

  const avatarUrl = watch("avatar");

  const loadData = async () => {
    setLoading(true);
    try {
      const [aboutRes, projectsRes, skillsRes, blogsRes] = await Promise.allSettled([
        getAbout(),
        getProjects(),
        getSkills(),
        getBlogs(),
      ]);

      const about = aboutRes.status === "fulfilled" ? aboutRes.value : null;
      const projects = projectsRes.status === "fulfilled" ? projectsRes.value : [];
      const skills = skillsRes.status === "fulfilled" ? skillsRes.value?.data || [] : [];
      const blogs = blogsRes.status === "fulfilled" ? blogsRes.value?.fullData || [] : [];

      setStats({
        projects: projects?.length || 0,
        skills: skills?.length || 0,
        blogs: blogs?.length || 0,
      });

      if (about) {
        setAboutData(about);
        reset({
          name: about.name || "Hasib Hossain Niloy",
          title: about.title || "Software Engineer & Full-Stack Builder",
          tagline: about.tagline || "",
          statusText: about.statusText || "Available for hire",
          seekingRole: about.seekingRole || "",
          location: about.location || "Dhaka, Bangladesh",
          timezone: about.timezone || "GMT+6",
          resumeUrl: about.resumeUrl || "",
          avatar: about.avatar || "https://avatars.githubusercontent.com/u/174131986?v=4",
          aiTools: about.aiTools?.length
            ? about.aiTools
            : [
                { name: "Claude 3.5 Sonnet", desc: "Architecture & complex logic" },
                { name: "Cursor / Copilot", desc: "Fast inline scaffolding" },
                { name: "Gemini 2.0 Flash", desc: "Deep context analysis" },
              ],
          coreStack: about.coreStack?.length
            ? about.coreStack
            : [
                { label: "Next.js 15", category: "Frontend" },
                { label: "TypeScript", category: "Languages" },
                { label: "Tailwind CSS", category: "Styling" },
                { label: "Node.js", category: "Backend" },
                { label: "NestJS", category: "Backend" },
                { label: "MongoDB", category: "Database" },
                { label: "PostgreSQL", category: "Database" },
              ],
        });
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onSubmit = async (values: HeroProfileFormValues) => {
    setSaving(true);
    try {
      let payload: Partial<PortfolioData> | FormData;

      if (avatarFiles.length > 0) {
        // Use multipart FormData if a new avatar file was chosen
        const formData = new FormData();
        formData.append("files", avatarFiles[0]);
        formData.append("name", values.name);
        formData.append("title", values.title);
        formData.append("tagline", values.tagline);
        formData.append("statusText", values.statusText);
        formData.append("seekingRole", values.seekingRole);
        formData.append("location", values.location);
        formData.append("timezone", values.timezone);
        formData.append("resumeUrl", values.resumeUrl);
        formData.append("aiTools", JSON.stringify(values.aiTools));
        formData.append("coreStack", JSON.stringify(values.coreStack));
        payload = formData;
      } else {
        // Send JSON payload
        payload = {
          name: values.name,
          title: values.title,
          tagline: values.tagline,
          statusText: values.statusText,
          seekingRole: values.seekingRole,
          location: values.location,
          timezone: values.timezone,
          resumeUrl: values.resumeUrl,
          avatar: values.avatar,
          aiTools: values.aiTools,
          coreStack: values.coreStack,
        };
      }

      const res = await updateAbout(payload as any, aboutData?._id);

      if (res?.success || res?.data) {
        toast.success("Hero & Profile updated successfully! 🚀");
        setAvatarFiles([]);
        loadData();
      } else {
        toast.error(res?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto" />
          <p className="mt-4 text-gray-400">Loading portfolio settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <User className="w-8 h-8 text-emerald-400" />
            Hero & Identity Management
          </h1>
          <p className="mt-2 text-gray-400">
            Control the core identity, hero banner, availability badge, and highlights displayed across your public portfolio.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm"
          >
            <ExternalLink className="w-4 h-4 text-emerald-400" />
            View Live Site
          </a>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={saving || (!isDirty && avatarFiles.length === 0)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-lg shadow-emerald-500/20"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Quick Portfolio Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Projects</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stats.projects}</h3>
            <p className="text-xs text-emerald-400/80 mt-1">Live in portfolio</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Code className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Skill Categories</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stats.skills}</h3>
            <p className="text-xs text-blue-400/80 mt-1">Grouped stacks</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Blog Articles</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stats.blogs}</h3>
            <p className="text-xs text-purple-400/80 mt-1">Published posts</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Profile & Avatar Details */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <User className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-semibold text-white">Basic Profile & Avatar</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Avatar Preview & Upload */}
            <div className="space-y-4">
              <Label className="text-gray-300 font-medium">Profile Avatar</Label>
              <div className="flex flex-col items-center p-4 border border-white/10 rounded-xl bg-white/[0.02]">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-emerald-500/40 shadow-xl mb-4 bg-zinc-900">
                  {avatarFiles.length > 0 ? (
                    <img
                      src={URL.createObjectURL(avatarFiles[0])}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt="Avatar"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      No Avatar
                    </div>
                  )}
                </div>
                <div className="w-full space-y-2">
                  <FileUpload onChange={setAvatarFiles} />
                  <p className="text-xs text-center text-gray-400">
                    Upload new file (Cloudinary) or specify URL below
                  </p>
                </div>
              </div>
            </div>

            {/* Core Info Inputs */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-gray-300">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="e.g. Hasib Hossain Niloy"
                    className="mt-1.5 bg-black/40 border-white/10 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="title" className="text-gray-300">
                    Headline / Title
                  </Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="e.g. Software Engineer & Full-Stack Builder"
                    className="mt-1.5 bg-black/40 border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="avatar" className="text-gray-300">
                  Direct Avatar Image URL
                </Label>
                <Input
                  id="avatar"
                  {...register("avatar")}
                  placeholder="https://..."
                  className="mt-1.5 bg-black/40 border-white/10 text-white font-mono text-xs"
                />
              </div>

              <div>
                <Label htmlFor="tagline" className="text-gray-300">
                  Hero Tagline / Bio Statement
                </Label>
                <Textarea
                  id="tagline"
                  {...register("tagline")}
                  rows={2}
                  placeholder="e.g. Code with a long-term mindset, generate unique and creative ideas..."
                  className="mt-1.5 bg-black/40 border-white/10 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location" className="text-gray-300">
                    Location
                  </Label>
                  <Input
                    id="location"
                    {...register("location")}
                    placeholder="e.g. Dhaka, Bangladesh"
                    className="mt-1.5 bg-black/40 border-white/10 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="timezone" className="text-gray-300">
                    Timezone & Availability
                  </Label>
                  <Input
                    id="timezone"
                    {...register("timezone")}
                    placeholder="e.g. GMT+6 (Flexible with US/EU timezones)"
                    className="mt-1.5 bg-black/40 border-white/10 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status, Seeking Role & Resume */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-semibold text-white">Career Status & Resume</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="statusText" className="text-gray-300">
                Pill Badge Status
              </Label>
              <Input
                id="statusText"
                {...register("statusText")}
                placeholder="e.g. Available for hire"
                className="mt-1.5 bg-black/40 border-white/10 text-white"
              />
              <p className="text-xs text-gray-400 mt-1">Appears in the header status indicator</p>
            </div>

            <div>
              <Label htmlFor="seekingRole" className="text-gray-300">
                Seeking Role
              </Label>
              <Input
                id="seekingRole"
                {...register("seekingRole")}
                placeholder="e.g. Full Stack Engineer / Senior Frontend"
                className="mt-1.5 bg-black/40 border-white/10 text-white"
              />
              <p className="text-xs text-gray-400 mt-1">Target positions for recruiters</p>
            </div>

            <div>
              <Label htmlFor="resumeUrl" className="text-gray-300">
                Resume / CV Link
              </Label>
              <Input
                id="resumeUrl"
                {...register("resumeUrl")}
                placeholder="https://drive.google.com/..."
                className="mt-1.5 bg-black/40 border-white/10 text-white"
              />
              <p className="text-xs text-gray-400 mt-1">Direct link to resume document</p>
            </div>
          </div>
        </div>

        {/* AI Tools Section */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-semibold text-white">AI Tools & Engineering Workflow</h2>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendAiTool({ name: "", desc: "" })}
              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add AI Tool
            </Button>
          </div>

          <div className="space-y-3">
            {aiToolFields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-black/20"
              >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    {...register(`aiTools.${index}.name` as const)}
                    placeholder="Tool name (e.g. Claude 3.5 Sonnet)"
                    className="bg-black/40 border-white/10 text-white text-sm"
                  />
                  <Input
                    {...register(`aiTools.${index}.desc` as const)}
                    placeholder="Workflow usage (e.g. Architecture & complex logic)"
                    className="bg-black/40 border-white/10 text-white text-sm"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAiTool(index)}
                  className="text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Core Tech Stack Section */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-semibold text-white">Hero Core Tech Stack</h2>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendCoreStack({ label: "", category: "Frontend" })}
              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Tech Chip
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {coreStackFields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-white/10 bg-black/20"
              >
                <div className="flex-1 space-y-1.5">
                  <Input
                    {...register(`coreStack.${index}.label` as const)}
                    placeholder="Tech (e.g. Next.js 15)"
                    className="bg-black/40 border-white/10 text-white text-xs h-8"
                  />
                  <Input
                    {...register(`coreStack.${index}.category` as const)}
                    placeholder="Category (e.g. Frontend)"
                    className="bg-black/40 border-white/10 text-gray-400 text-xs h-8"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCoreStack(index)}
                  className="text-red-400 hover:bg-red-500/10 shrink-0 h-8 w-8"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end pt-4 border-t border-white/10">
          <Button
            type="submit"
            disabled={saving || (!isDirty && avatarFiles.length === 0)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2.5 font-medium shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Hero & Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
