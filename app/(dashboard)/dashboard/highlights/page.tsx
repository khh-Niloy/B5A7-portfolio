"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  Layers,
  BookOpen,
  Hammer,
  Plus,
  Trash2,
  Save,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import getAbout from "@/helper/getAbout";
import { updateAbout } from "@/actions/about/updateAbout";
import type {
  PortfolioData,
  Service,
  CurrentlyBuilding,
  CurrentlyLearning,
} from "@/interfaces/interface";

type TabType = "services" | "building" | "learning";

export default function HighlightsManagement() {
  const [activeTab, setActiveTab] = useState<TabType>("services");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutData, setAboutData] = useState<PortfolioData | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm<{
    services: Service[];
    currentlyBuilding: CurrentlyBuilding[];
    currentlyLearning: CurrentlyLearning[];
  }>({
    defaultValues: {
      services: [],
      currentlyBuilding: [],
      currentlyLearning: [],
    },
  });

  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray({
    control,
    name: "services",
  });

  const {
    fields: buildingFields,
    append: appendBuilding,
    remove: removeBuilding,
  } = useFieldArray({
    control,
    name: "currentlyBuilding",
  });

  const {
    fields: learningFields,
    append: appendLearning,
    remove: removeLearning,
  } = useFieldArray({
    control,
    name: "currentlyLearning",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAbout();
      if (data) {
        setAboutData(data);
        reset({
          services: data.services || [],
          currentlyBuilding: (data.currentlyBuilding || []).map((b: any) => ({
            ...b,
            techStack: Array.isArray(b.techStack) ? b.techStack : [],
          })),
          currentlyLearning: data.currentlyLearning || [],
        });
      }
    } catch (err) {
      console.error("Failed to load highlights data:", err);
      toast.error("Failed to load highlights data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onSubmit = async (values: any) => {
    setSaving(true);
    try {
      const formattedBuilding = values.currentlyBuilding.map((item: any) => ({
        ...item,
        techStack: typeof item.techStack === "string"
          ? item.techStack.split(",").map((s: string) => s.trim()).filter(Boolean)
          : Array.isArray(item.techStack)
          ? item.techStack
          : [],
      }));

      const payload: Partial<PortfolioData> = {
        services: values.services,
        currentlyBuilding: formattedBuilding,
        currentlyLearning: values.currentlyLearning,
      };

      const res = await updateAbout(payload, aboutData?._id);

      if (res?.success || res?.data) {
        toast.success("Highlights & Services updated successfully! ✨");
        loadData();
      } else {
        toast.error(res?.message || "Failed to update highlights");
      }
    } catch (err) {
      console.error(err);
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
          <p className="mt-4 text-gray-400">Loading highlights & services...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "services", label: "Services & Offerings", icon: Layers },
    { id: "building", label: "Currently Building", icon: Hammer },
    { id: "learning", label: "Currently Learning", icon: BookOpen },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-emerald-400" />
            Highlights, Services & Sidebars
          </h1>
          <p className="mt-2 text-gray-400">
            Control the services displayed in contact views, and the live "Currently Building" & "Currently Learning" widgets in the right sidebar.
          </p>
        </div>

        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={saving || !isDirty}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-lg shadow-emerald-500/20"
        >
          {saving ? "Saving..." : (
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Highlights
            </div>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* TAB 1: Services */}
        {activeTab === "services" && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Services & Offerings</h3>
                <p className="text-xs text-gray-400">
                  Featured services cards shown on the contact section and client outreach.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendService({
                    title: "",
                    description: "",
                    icon: "Code",
                    badge: "Core Service",
                  })
                }
                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Service
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceFields.map((field, idx) => (
                <div
                  key={field.id}
                  className="p-5 rounded-xl border border-white/10 bg-black/30 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400 font-semibold">
                      Service #{idx + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeService(idx)}
                      className="text-red-400 hover:bg-red-500/10 h-7 w-7"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-300">Service Title</Label>
                      <Input
                        {...register(`services.${idx}.title` as const)}
                        placeholder="e.g. Full-Stack Web Development"
                        className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-300">Badge / Tag</Label>
                      <Input
                        {...register(`services.${idx}.badge` as const)}
                        placeholder="e.g. Core Offering"
                        className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-300">Description</Label>
                    <Textarea
                      {...register(`services.${idx}.description` as const)}
                      rows={2}
                      placeholder="What is delivered, tools used, and business outcome..."
                      className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                    />
                  </div>
                </div>
              ))}
              {serviceFields.length === 0 && (
                <div className="md:col-span-2 text-center py-8 text-gray-500">
                  No services added. Click "Add Service" to create one.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Currently Building */}
        {activeTab === "building" && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Currently Building (Right Sidebar)</h3>
                <p className="text-xs text-gray-400">
                  Active projects, research initiatives, or upcoming open-source packages.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendBuilding({
                    title: "",
                    description: "",
                    link: "",
                    techStack: [],
                    status: "In Progress",
                  })
                }
                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {buildingFields.map((field, idx) => (
                <div
                  key={field.id}
                  className="p-5 rounded-xl border border-white/10 bg-black/30 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400 font-semibold">
                      Building Item #{idx + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBuilding(idx)}
                      className="text-red-400 hover:bg-red-500/10 h-7 w-7"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <Label className="text-xs text-gray-300">Project / Feature Title</Label>
                      <Input
                        {...register(`currentlyBuilding.${idx}.title` as const)}
                        placeholder="e.g. AI-Powered Developer Knowledge Base"
                        className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-300">Status Tag</Label>
                      <Input
                        {...register(`currentlyBuilding.${idx}.status` as const)}
                        placeholder="e.g. In Progress, MVP, Beta"
                        className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-300">Live / Repo Link (Optional)</Label>
                      <Input
                        {...register(`currentlyBuilding.${idx}.link` as const)}
                        placeholder="https://github.com/..."
                        className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-300">Tech Stack (Comma-separated)</Label>
                      <Input
                        {...register(`currentlyBuilding.${idx}.techStack` as const)}
                        placeholder="Next.js, Python, Vector DB"
                        className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-300">Short Summary</Label>
                    <Textarea
                      {...register(`currentlyBuilding.${idx}.description` as const)}
                      rows={2}
                      placeholder="Brief overview of the problem being solved..."
                      className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                    />
                  </div>
                </div>
              ))}
              {buildingFields.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No items configured. Click "Add Item" to add one.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Currently Learning */}
        {activeTab === "learning" && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Currently Learning (Right Sidebar)</h3>
                <p className="text-xs text-gray-400">
                  Topics, tools, or frameworks you are actively studying or mastering.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendLearning({
                    topic: "",
                    level: "Exploring",
                    notes: "",
                  })
                }
                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Learning Topic
              </Button>
            </div>

            <div className="space-y-4">
              {learningFields.map((field, idx) => (
                <div
                  key={field.id}
                  className="p-5 rounded-xl border border-white/10 bg-black/30 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400 font-semibold">
                      Topic #{idx + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLearning(idx)}
                      className="text-red-400 hover:bg-red-500/10 h-7 w-7"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-300">Topic / Skill</Label>
                      <Input
                        {...register(`currentlyLearning.${idx}.topic` as const)}
                        placeholder="e.g. Rust / Distributed Consensus"
                        className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-300">Current Level</Label>
                      <Input
                        {...register(`currentlyLearning.${idx}.level` as const)}
                        placeholder="e.g. Exploring, Intermediate, Deep Dive"
                        className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-300">Notes / Focus (Optional)</Label>
                    <Input
                      {...register(`currentlyLearning.${idx}.notes` as const)}
                      placeholder="e.g. Memory safety, tokio async engine, and WebAssembly bindings"
                      className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                    />
                  </div>
                </div>
              ))}
              {learningFields.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No learning topics configured. Click "Add Learning Topic" to add one.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="flex justify-end pt-4 border-t border-white/10">
          <Button
            type="submit"
            disabled={saving || !isDirty}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2.5 font-medium shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Highlights"}
          </Button>
        </div>
      </form>
    </div>
  );
}
