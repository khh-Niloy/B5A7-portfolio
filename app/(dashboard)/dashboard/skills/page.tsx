"use client";
import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { createSkills } from "@/actions/skills/createSkills";
import { updateSkills } from "@/actions/skills/updateSkills";
import getSkills from "@/helper/getSkills";

interface Category {
  category: string;
  skills: string;
}

interface SkillFormValues {
  categories: Category[];
}

interface ExistingSkill {
  _id: string;
  category: string;
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

const PREDEFINED_CATEGORIES = [
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Database", value: "database" },
  { label: "Tools & Services", value: "Tools & Services" },
];

export default function Skills() {
  const [existingSkills, setExistingSkills] = React.useState<ExistingSkill[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editingSkill, setEditingSkill] = React.useState<ExistingSkill | null>(null);

  const { control, handleSubmit, register, reset, setValue } = useForm<SkillFormValues>({
    defaultValues: {
      categories: [
        {
          category: "frontend",
          skills: "",
        },
      ],
    },
  });

  const {
    fields: categoryFields,
    append: appendCategory,
    remove: removeCategory,
  } = useFieldArray({
    control,
    name: "categories",
  });

  // Fetch existing skills
  const fetchSkills = async () => {
    setLoading(true);
    try {
      const data = await getSkills();
      console.log("Fetched skills:", data);
      setExistingSkills(data?.data || []);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
      setExistingSkills([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSkills();
  }, []);

  const handleCreate = () => {
    setIsEditing(false);
    setEditingSkill(null);
    setShowForm(true);
    reset();
  };

  const handleEdit = (skill: ExistingSkill) => {
    setIsEditing(true);
    setEditingSkill(skill);
    setShowForm(true);
    // Populate form with existing skill data
    reset({
      categories: [{
        category: skill.category,
        skills: skill.skills.join(", ")
      }]
    });
  };

  const handleDelete = async (skillId: string) => {
    if (confirm("Are you sure you want to delete this skill category?")) {
      try {
        // TODO: Implement delete skills API
        setExistingSkills(existingSkills.filter(skill => skill._id !== skillId));
        toast.success("Skill category deleted successfully!");
      } catch (error) {
        console.error("Failed to delete skill:", error);
        toast.error("Failed to delete skill category");
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditingSkill(null);
    reset();
  };

  const handleAdd = async (data: SkillFormValues) => {
    // Transform skills string to array
    const transformedData = data.categories.map((category) => ({
      category: category.category,
      skills: category.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== ""), // Remove empty strings
    }));

    console.log("Adding Skills:", transformedData);

    try {
      const result = await createSkills(transformedData);
      console.log("Add Result:", result);
      
      if (result?.success) {
        toast.success("Skills added successfully! 💪");
        setShowForm(false);
        reset();
        fetchSkills(); // Refresh skills list
      } else {
        toast.error(result?.message || "Failed to add skills");
      }
    } catch (error) {
      console.error("Failed to add skills:", error);
      toast.error("Failed to add skills");
    }
  };

  const handleUpdate = async (data: SkillFormValues) => {
    // Transform skills string to array
    const transformedData = data.categories.map((category) => ({
      category: category.category,
      skills: category.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== ""), // Remove empty strings
    }));

    console.log("Updating Skills:", transformedData);

    try {
      const result = await updateSkills(transformedData);
      console.log("Update Result:", result);
      
      if (result?.success) {
        toast.success("Skills updated successfully! 🔥");
        setShowForm(false);
        reset();
        fetchSkills(); // Refresh skills list
      } else {
        toast.error(result?.message || "Failed to update skills");
      }
    } catch (error) {
      console.error("Failed to update skills:", error);
      toast.error("Failed to update skills");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Skills & Technologies
          </h1>
          <p className="mt-2 text-gray-400">
            Manage your technical skills organized by categories.
          </p>
        </div>
        
        {!showForm && (
          <Button
            onClick={handleCreate}
            className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Category
          </Button>
        )}
      </div>

      {/* Skills Form */}
      {showForm && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {isEditing ? "Edit Skill Category" : "Create New Skill Category"}
            </h2>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-white/10 text-gray-300 hover:bg-white/5"
            >
              Cancel
            </Button>
          </div>

          <form className="space-y-6">
            {categoryFields.map((categoryField, categoryIndex) => (
              <CategorySection
                key={categoryField.id}
                categoryIndex={categoryIndex}
                control={control}
                register={register}
                onRemove={() => removeCategory(categoryIndex)}
                canRemove={categoryFields.length > 1}
              />
            ))}

            {!isEditing && (
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendCategory({
                      category: "frontend",
                      skills: "",
                    })
                  }
                  className="w-full border-white/10 text-gray-300 hover:bg-white/5"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Category
                </Button>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="border-white/10 text-gray-300 hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit(isEditing ? handleUpdate : handleAdd)}
                className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-200"
              >
                {isEditing ? "Update Skills" : "Add Skills"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Skills List */}
      {!showForm && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white mb-6">
            All Skill Categories ({existingSkills.length})
          </h2>

          {existingSkills.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No skill categories yet.</p>
              <Button
                onClick={handleCreate}
                className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Category
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {existingSkills.map((skillCategory) => (
                <div
                  key={skillCategory._id}
                  className="border border-white/10 rounded-lg p-6 bg-white/5 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-white capitalize">
                          {skillCategory.category}
                        </h3>
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs">
                          {skillCategory.skills.length} skills
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-400 mb-4">
                        Created {new Date(skillCategory.createdAt).toLocaleDateString()}
                      </div>

                      {/* Skills Pills */}
                      <div className="flex flex-wrap gap-2">
                        {skillCategory.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-white/10 text-gray-300 text-sm rounded-lg border border-white/10 hover:bg-white/20 transition-all duration-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(skillCategory)}
                        className="border-white/10 text-gray-300 hover:bg-white/5"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(skillCategory._id)}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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

function CategorySection({
  categoryIndex,
  control,
  register,
  onRemove,
  canRemove,
}: {
  categoryIndex: number;
  control: any;
  register: any;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 mr-4">
          <Label htmlFor={`category-${categoryIndex}`}>Category Name</Label>
          <div className="mt-2">
            <Controller
              control={control}
              name={`categories.${categoryIndex}.category`}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="text-lg font-semibold">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="mt-4">
        <Label htmlFor={`skills-${categoryIndex}`}>Skills</Label>
        <Textarea
          id={`skills-${categoryIndex}`}
          placeholder="React, Next.js, TypeScript, Tailwind CSS"
          {...register(`categories.${categoryIndex}.skills`)}
          className="mt-2 min-h-[100px]"
        />
        <p className="text-sm text-gray-400 mt-1">
          Separate skills with commas (e.g., React, Next.js, TypeScript)
        </p>
      </div>
    </div>
  );
}
