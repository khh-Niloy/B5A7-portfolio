"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Plus, Trash2, Edit, Lightbulb, Sparkles, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { createSkills } from "@/actions/skills/createSkills";
import { updateSkills } from "@/actions/skills/updateSkills";
import { deleteSkill } from "@/actions/skills/deleteSkill";
import getSkills from "@/helper/getSkills";

interface ExistingSkill {
  _id: string;
  category: string;
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

const CATEGORY_PRESETS = [
  "Frontend",
  "Backend",
  "Database",
  "Tools & DevOps",
  "AI & Data Science",
  "Languages",
  "Mobile",
  "Cloud & Architecture",
];

export default function SkillsPage() {
  const [skillsList, setSkillsList] = useState<ExistingSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm<{
    category: string;
    skills: string;
  }>({
    defaultValues: {
      category: "",
      skills: "",
    },
  });

  const selectedCategory = watch("category");

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const data = await getSkills();
      setSkillsList(data?.data || []);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
      setSkillsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    reset({ category: "", skills: "" });
    setShowModal(true);
  };

  const handleEdit = (skill: ExistingSkill) => {
    setIsEditing(true);
    setEditingId(skill._id);
    reset({
      category: skill.category,
      skills: skill.skills.join(", "),
    });
    setShowModal(true);
  };

  const handleDelete = async (skillId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete the "${categoryName}" category and all its skills?`)) {
      return;
    }

    try {
      const result = await deleteSkill(skillId);
      if (result?.success) {
        toast.success(`Category "${categoryName}" deleted successfully! 🗑️`);
        setSkillsList((prev) => prev.filter((s) => s._id !== skillId));
      } else {
        toast.error(result?.message || "Failed to delete skill category");
      }
    } catch (error) {
      console.error("Failed to delete skill:", error);
      toast.error("Failed to delete skill category");
    }
  };

  const onSubmit = async (data: { category: string; skills: string }) => {
    if (!data.category.trim()) {
      toast.error("Please provide a category name");
      return;
    }

    const skillsArray = data.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (skillsArray.length === 0) {
      toast.error("Please add at least one skill");
      return;
    }

    setSaving(true);
    try {
      const payload = [
        {
          category: data.category.trim(),
          skills: skillsArray,
        },
      ];

      let res;
      if (isEditing) {
        res = await updateSkills(payload);
      } else {
        res = await createSkills(payload);
      }

      if (res?.success) {
        toast.success(
          isEditing ? "Skills category updated! 🔥" : "New skills category created! 💪"
        );
        setShowModal(false);
        fetchSkills();
      } else {
        toast.error(res?.message || "Failed to save skills");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save skills");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto" />
          <p className="mt-4 text-gray-400">Loading skills...</p>
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
            <Sparkles className="w-8 h-8 text-emerald-400" />
            Skills & Technical Stack
          </h1>
          <p className="mt-2 text-gray-400">
            Organize, create, edit, and delete technical skills grouped by category.
          </p>
        </div>

        <Button
          onClick={handleCreate}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Category
        </Button>
      </div>

      {/* Skills Categories Grid */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm space-y-6">
        <h2 className="text-xl font-semibold text-white">
          Active Categories ({skillsList.length})
        </h2>

        {skillsList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No skills categories found.</p>
            <Button onClick={handleCreate} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Category
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillsList.map((cat) => (
              <div
                key={cat._id}
                className="p-5 rounded-xl border border-white/10 bg-black/30 hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-white capitalize">{cat.category}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {cat.skills.length} skills
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(cat)}
                        className="border-white/10 text-gray-300 hover:bg-white/5 text-xs h-8"
                      >
                        <Edit className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(cat._id, cat.category)}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs h-8"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {cat.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-lg text-xs bg-white/[0.05] text-gray-200 border border-white/10 hover:border-emerald-500/30 transition-all"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-gray-500 pt-2 border-t border-white/5">
                  Last updated {new Date(cat.updatedAt || cat.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[#000319] p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                {isEditing ? "Edit Skill Category" : "Add Skill Category"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <Label htmlFor="category" className="text-gray-300">
                  Category Name
                </Label>
                <Input
                  id="category"
                  {...register("category")}
                  placeholder="e.g. Frontend, DevOps, AI & Machine Learning"
                  className="mt-1.5 bg-black/40 border-white/10 text-white"
                  required
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <span className="text-xs text-gray-500 mr-1 self-center">Presets:</span>
                  {CATEGORY_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setValue("category", preset)}
                      className={`text-[11px] px-2 py-0.5 rounded border transition-all ${
                        selectedCategory === preset
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                          : "bg-white/[0.03] text-gray-400 border-white/10 hover:text-white hover:bg-white/[0.08]"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="skills" className="text-gray-300">
                  Skills (Comma-separated)
                </Label>
                <Textarea
                  id="skills"
                  {...register("skills")}
                  rows={4}
                  placeholder="React, Next.js, TypeScript, Tailwind CSS, Redux, Zustand"
                  className="mt-1.5 bg-black/40 border-white/10 text-white"
                  required
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  Separate each technology or tool with a comma.
                </p>
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
                  {saving ? "Saving..." : isEditing ? "Update Category" : "Create Category"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
