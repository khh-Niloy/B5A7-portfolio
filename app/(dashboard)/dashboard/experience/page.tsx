"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Save,
  CheckCircle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import toast from "react-hot-toast";
import getAbout from "@/helper/getAbout";
import { updateAbout } from "@/actions/about/updateAbout";
import type { PortfolioData } from "@/interfaces/interface";

interface ExperienceItem {
  companyName: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  location: "remote" | "onsite" | "hybrid";
  jobType: "full-time" | "part-time" | "contract" | "internship";
  jobTechStack: string; // comma separated in form
  worked: string; // comma separated or newlines in form
}

export default function ExperienceManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [aboutId, setAboutId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<ExperienceItem>({
    defaultValues: {
      companyName: "",
      role: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      location: "remote",
      jobType: "full-time",
      jobTechStack: "",
      worked: "",
    },
  });

  const isCurrent = watch("isCurrent");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAbout();
      if (data) {
        setAboutId(data._id || null);
        setExperiences(data.experience || []);
      }
    } catch (err) {
      console.error("Failed to load experience data:", err);
      toast.error("Failed to load experience data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingIndex(null);
    reset({
      companyName: "",
      role: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      location: "remote",
      jobType: "full-time",
      jobTechStack: "",
      worked: "",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    const exp = experiences[index];
    const isPresent = exp.endDate === "present" || !exp.endDate;

    const formatDateForInput = (d: any) => {
      if (!d || d === "present") return "";
      try {
        return new Date(d).toISOString().slice(0, 10);
      } catch {
        return String(d);
      }
    };

    reset({
      companyName: exp.companyName || "",
      role: exp.role || "",
      startDate: formatDateForInput(exp.startDate),
      endDate: formatDateForInput(exp.endDate),
      isCurrent: isPresent,
      location: exp.location || "remote",
      jobType: exp.jobType || "full-time",
      jobTechStack: Array.isArray(exp.jobTechStack)
        ? exp.jobTechStack.join(", ")
        : exp.jobTechStack || "",
      worked: Array.isArray(exp.worked)
        ? exp.worked.join("\n")
        : exp.worked || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (index: number) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;

    const updated = experiences.filter((_, i) => i !== index);
    setSaving(true);
    try {
      const res = await updateAbout({ experience: updated }, aboutId || undefined);
      if (res?.success || res?.data) {
        toast.success("Experience deleted successfully! 🗑️");
        setExperiences(updated);
      } else {
        toast.error("Failed to delete experience");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete experience");
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;

    const copy = [...experiences];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    setSaving(true);
    try {
      const res = await updateAbout({ experience: copy }, aboutId || undefined);
      if (res?.success || res?.data) {
        setExperiences(copy);
        toast.success("Order updated!");
      }
    } catch {
      toast.error("Failed to reorder");
    } finally {
      setSaving(false);
    }
  };

  const onSubmit = async (values: ExperienceItem) => {
    setSaving(true);
    try {
      const splitCsv = (val: string) =>
        val
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

      const splitLines = (val: string) =>
        val
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);

      const formattedItem = {
        companyName: values.companyName,
        role: values.role,
        startDate: values.startDate ? new Date(values.startDate) : undefined,
        endDate: values.isCurrent ? "present" : values.endDate ? new Date(values.endDate) : "present",
        location: values.location,
        jobType: values.jobType,
        jobTechStack: splitCsv(values.jobTechStack),
        worked: splitLines(values.worked),
      };

      let updatedList: any[];
      if (editingIndex !== null) {
        updatedList = [...experiences];
        updatedList[editingIndex] = formattedItem;
      } else {
        updatedList = [formattedItem, ...experiences];
      }

      const res = await updateAbout({ experience: updatedList }, aboutId || undefined);

      if (res?.success || res?.data) {
        toast.success(
          editingIndex !== null
            ? "Experience updated successfully! 💼"
            : "New experience added! 💼"
        );
        setShowModal(false);
        loadData();
      } else {
        toast.error(res?.message || "Failed to save experience");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save experience");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto" />
          <p className="mt-4 text-gray-400">Loading work experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-emerald-400" />
            Work Experience Timeline
          </h1>
          <p className="mt-2 text-gray-400">
            Create, view, edit, reorder, and remove company positions displayed on your timeline.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Position
        </Button>
      </div>

      {/* Experience List */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm space-y-4">
        <h2 className="text-xl font-semibold text-white mb-4">
          Positions ({experiences.length})
        </h2>

        {experiences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No work experience entries configured yet.</p>
            <Button
              onClick={handleOpenAdd}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Job Experience
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp, idx) => {
              const startDateStr = exp.startDate
                ? new Date(exp.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                : "";
              const endDateStr =
                exp.endDate === "present" || !exp.endDate
                  ? "Present"
                  : new Date(exp.endDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    });

              return (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-white/10 bg-black/30 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                      <span className="text-gray-400">at</span>
                      <span className="text-emerald-400 font-semibold">{exp.companyName}</span>
                      <span className="px-2 py-0.5 rounded text-xs uppercase tracking-wider font-mono bg-white/10 text-gray-300">
                        {exp.jobType || "Full-time"}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs capitalize font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {exp.location || "Remote"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      <span>
                        {startDateStr} — {endDateStr}
                      </span>
                    </div>

                    {/* Tech Badges */}
                    {Array.isArray(exp.jobTechStack) && exp.jobTechStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {exp.jobTechStack.map((tech: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-xs bg-white/[0.04] text-gray-300 border border-white/10"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Bullets */}
                    {Array.isArray(exp.worked) && exp.worked.length > 0 && (
                      <ul className="list-disc list-inside text-xs text-gray-400 space-y-1 pt-2">
                        {exp.worked.map((bullet: string, i: number) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Actions & Reordering */}
                  <div className="flex items-center gap-2 self-end md:self-start">
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        disabled={idx === 0 || saving}
                        onClick={() => handleMove(idx, "up")}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === experiences.length - 1 || saving}
                        onClick={() => handleMove(idx, "down")}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenEdit(idx)}
                      className="border-white/10 text-gray-300 hover:bg-white/5 text-xs"
                    >
                      <Edit className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(idx)}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal / Form Sheet */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#000319] p-6 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                {editingIndex !== null ? "Edit Position" : "Add Work Position"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName" className="text-gray-300">
                    Company Name
                  </Label>
                  <Input
                    id="companyName"
                    {...register("companyName")}
                    placeholder="e.g. Lint Technologies"
                    className="mt-1 bg-black/40 border-white/10 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="role" className="text-gray-300">
                    Role / Job Title
                  </Label>
                  <Input
                    id="role"
                    {...register("role")}
                    placeholder="e.g. Software Engineer"
                    className="mt-1 bg-black/40 border-white/10 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="startDate" className="text-gray-300">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register("startDate")}
                    className="mt-1 bg-black/40 border-white/10 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endDate" className="text-gray-300">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    disabled={isCurrent}
                    {...register("endDate")}
                    className="mt-1 bg-black/40 border-white/10 text-white disabled:opacity-40"
                  />
                </div>

                <div className="flex flex-col justify-end pb-2">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("isCurrent")}
                      className="rounded border-white/20 bg-black/40 text-emerald-500 focus:ring-emerald-500"
                    />
                    Currently Working Here
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Work Mode</Label>
                  <select
                    {...register("location")}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                  >
                    <option value="remote" className="bg-[#000319]">Remote</option>
                    <option value="hybrid" className="bg-[#000319]">Hybrid</option>
                    <option value="onsite" className="bg-[#000319]">Onsite</option>
                  </select>
                </div>

                <div>
                  <Label className="text-gray-300">Job Type</Label>
                  <select
                    {...register("jobType")}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                  >
                    <option value="full-time" className="bg-[#000319]">Full-time</option>
                    <option value="part-time" className="bg-[#000319]">Part-time</option>
                    <option value="contract" className="bg-[#000319]">Contract</option>
                    <option value="internship" className="bg-[#000319]">Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="jobTechStack" className="text-gray-300">
                  Tech Stack (Comma-separated)
                </Label>
                <Input
                  id="jobTechStack"
                  {...register("jobTechStack")}
                  placeholder="e.g. Next.js, TypeScript, Tailwind CSS, NestJS, MongoDB"
                  className="mt-1 bg-black/40 border-white/10 text-white"
                />
              </div>

              <div>
                <Label htmlFor="worked" className="text-gray-300">
                  Key Accomplishments / Responsibilities (One per line)
                </Label>
                <Textarea
                  id="worked"
                  {...register("worked")}
                  rows={4}
                  placeholder="Built full-stack analytics dashboards&#10;Reduced API response latencies by 40%&#10;Integrated AI chatbot with streaming responses"
                  className="mt-1 bg-black/40 border-white/10 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="border-white/10 text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-lg shadow-emerald-500/20"
                >
                  {saving ? "Saving..." : editingIndex !== null ? "Update Position" : "Save Position"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
