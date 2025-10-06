"use client";
import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
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
import { createSkills } from "@/actions/skills/createSkills";
import { updateSkills } from "@/actions/skills/updateSkills";

interface Category {
  category: string;
  skills: string;
}

interface SkillFormValues {
  categories: Category[];
}

const PREDEFINED_CATEGORIES = [
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Database", value: "database" },
  { label: "Tools & Services", value: "Tools & Services" },
];

export default function Skills() {
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { control, handleSubmit, register } = useForm<SkillFormValues>({
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

  const handleAdd = async (data: SkillFormValues) => {
    setMessage(null); // Clear previous messages
    
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
        setMessage({ type: "success", text: "Skills added successfully!" });
      } else {
        setMessage({ type: "error", text: result?.message || "Failed to add skills" });
      }
    } catch (error) {
      console.error("Failed to add skills:", error);
      setMessage({ type: "error", text: "Failed to add skills" });
    }
  };

  const handleUpdate = async (data: SkillFormValues) => {
    setMessage(null); // Clear previous messages
    
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
        setMessage({ type: "success", text: "Skills updated successfully!" });
      } else {
        setMessage({ type: "error", text: result?.message || "Failed to update skills" });
      }
    } catch (error) {
      console.error("Failed to update skills:", error);
      setMessage({ type: "error", text: "Failed to update skills" });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Skills & Technologies
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your technical skills organized by categories.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
              : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

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
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleSubmit(handleAdd)}
          >
            Add Skills
          </Button>
          <Button
            type="button"
            size="lg"
            onClick={handleSubmit(handleUpdate)}
          >
            Update Skills
          </Button>
        </div>
      </form>
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
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
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
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Separate skills with commas (e.g., React, Next.js, TypeScript)
        </p>
      </div>
    </div>
  );
}
