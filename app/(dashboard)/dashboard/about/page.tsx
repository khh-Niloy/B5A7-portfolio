"use client";
import React, { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { Plus, Trash2 } from "lucide-react";
import { createAbout } from "@/actions/about/createAbout";
import { updateAbout } from "@/actions/about/updateAbout";
import getAbout from "@/helper/getAbout";
import {
  Contact,
  UniversityInfo,
  AboutInfo,
  Journey,
} from "@/interfaces/interface";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function About() {
  const [loading, setLoading] = useState(true);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [aboutId, setAboutId] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isDirty, dirtyFields },
  } = useForm({
    defaultValues: {
      contacts: [{ name: "", link: "" }],
      journey: [{ year: "", description: "", title: "" }],
      universityInfo: {
        varsity: "",
        department: "",
        startYear: "",
        endYear: "",
      },
      aboutInfo: { email: "", sampleText: "" },
    },
  });

  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact,
  } = useFieldArray({
    control,
    name: "contacts",
  });

  const {
    fields: journeyFields,
    append: appendJourney,
    remove: removeJourney,
  } = useFieldArray({
    control,
    name: "journey",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAbout();
        console.log("data", data);
        if (data) {
          setHasExistingData(true);
          // Store the ID for updates
          setAboutId(data._id || null);

          reset(
            {
              contacts: data.contacts || [{ name: "", link: "" }],
              journey: data.journey || [{ year: "", description: "", title: "" }],
              universityInfo: data.universityInfo || {
                varsity: "",
                department: "",
                startYear: "",
                endYear: "",
              },
              aboutInfo: {
                email: data.aboutInfo?.email || "",
                sampleText: data.aboutInfo?.sampleText?.join(", ") || "",
              },
            },
            {
              keepDirtyValues: false,
              keepErrors: false,
            }
          );
        } else {
          setHasExistingData(false);
          setAboutId(null);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setHasExistingData(false);
        setAboutId(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reset]);

  // Helper function to extract only dirty fields
  const getDirtyValues = (dirtyFields: any, allValues: any): any => {
    const dirtyValues: any = {};

    Object.keys(dirtyFields).forEach((key) => {
      if (dirtyFields[key] === true) {
        // Simple field changed
        dirtyValues[key] = allValues[key];
      } else if (typeof dirtyFields[key] === "object" && !Array.isArray(dirtyFields[key])) {
        // Nested object (like universityInfo or aboutInfo)
        const nestedDirtyValues = getDirtyValues(dirtyFields[key], allValues[key]);
        // Only add if the nested object has actual changes
        if (Object.keys(nestedDirtyValues).length > 0) {
          dirtyValues[key] = nestedDirtyValues;
        }
      } else if (Array.isArray(dirtyFields[key])) {
        // Array field (like contacts or journey)
        // Check if any item in the array actually has changes
        const arrayDirtyFields = dirtyFields[key];
        const hasDirtyItems = arrayDirtyFields.some((item: any) => {
          // If item is an object, check if it has any keys (meaning some field changed)
          if (typeof item === "object" && item !== null) {
            const keys = Object.keys(item);
            // Check if any of those keys have a truthy value (meaning field is dirty)
            return keys.some(k => item[k] === true || (typeof item[k] === 'object' && Object.keys(item[k]).length > 0));
          }
          return item === true;
        });
        
        console.log(`Array ${key} - hasDirtyItems:`, hasDirtyItems, "dirtyFields:", arrayDirtyFields);
        
        // Only include array if it has actual dirty items
        if (hasDirtyItems) {
          dirtyValues[key] = allValues[key];
        }
      }
    });

    return dirtyValues;
  };

  const onSubmit = async (data: any) => {
    try {
      // console.log("Full form data:", data);

      let result;
      if (hasExistingData && aboutId) {
        // For PATCH: Send only changed fields
        console.log("dirtyFields:", dirtyFields);
        const changedData = getDirtyValues(dirtyFields, data);
        console.log("Sending only changed data:", changedData);
        console.log("aboutId", aboutId);
        result = await updateAbout(changedData, aboutId);
        toast.success("About updated successfully");
      } else {
        // For POST: Send all data
        console.log("Creating new entry with all data");
        result = await createAbout(data);
        toast.success("About created successfully");
      }

      console.log("Result:", result);

      if (!hasExistingData && result?.id) {
        setHasExistingData(true);
        setAboutId(result.id);
      }
    } catch (error) {
      console.error("Failed to submit:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          About
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your contact information and academic background.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Contacts Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Contacts
            </h2>
            <button
              type="button"
              onClick={() => appendContact({ name: "", link: "" })}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Contact
            </button>
          </div>

          <div className="space-y-4">
            {contactFields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg dark:border-gray-600"
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      {...register(`contacts.${index}.name` as const)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Contact name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Link
                    </label>
                    <input
                      {...register(`contacts.${index}.link` as const)}
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeContact(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* About Information Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            About Me
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                {...register("aboutInfo.email")}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                My Mindset
              </label>
              <textarea
                {...register("aboutInfo.sampleText")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Write about your mindset, philosophy, values, or what drives you..."
                rows={6}
              />
            </div>
          </div>
        </div>

        {/* Journey Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              My Journey
            </h2>
            <button
              type="button"
              onClick={() =>
                appendJourney({ year: "", description: "", title: "" })
              }
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Journey Entry
            </button>
          </div>

          <div className="space-y-4">
            {journeyFields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg dark:border-gray-600"
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Year
                    </label>
                    <input
                      {...register(`journey.${index}.year` as const)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="e.g., 2019, 2020, 2022"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      {...register(`journey.${index}.title` as const)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="e.g., Started Learning UI/UX Design"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      {...register(`journey.${index}.description` as const)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="e.g., I started designing, I learned React"
                      rows={3}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeJourney(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* University Information Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            University Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                University Name
              </label>
              <input
                type="text"
                {...register(`universityInfo.varsity` as const)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter university name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department
              </label>
              <input
                type="text"
                {...register(`universityInfo.department` as const)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter department name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Year
              </label>
              <input
                type="number"
                {...register(`universityInfo.startYear` as const)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="2020"
                min="1900"
                max="2100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Year
              </label>
              <input
                type="number"
                {...register(`universityInfo.endYear` as const)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="2024"
                min="1900"
                max="2100"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isDirty}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isDirty
              ? "No Changes"
              : hasExistingData
              ? "Update Information"
              : "Create Information"}
          </button>
        </div>
      </form>
    </div>
  );
}
