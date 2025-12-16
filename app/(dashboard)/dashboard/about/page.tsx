"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { createAbout } from "@/actions/about/createAbout";
import { updateAbout } from "@/actions/about/updateAbout";
import type {
  Contact,
  UniversityInfo,
  AboutInfo,
  Journey,
} from "@/interfaces/interface";
import getAbout from "@/helper/getAbout";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { aboutSchema } from "@/lib/validation";
import { withErrorHandling } from "@/lib/error-handler";

interface AboutData {
  contacts: Contact[];
  universityInfo: UniversityInfo;
  aboutInfo: AboutInfo;
  journey: Journey[];
}

export default function About() {
  const [loading, setLoading] = useState(true);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [aboutId, setAboutId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, dirtyFields },
  } = useForm({
    resolver: zodResolver(aboutSchema),
    mode: "onBlur",
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
      experience: [
        {
          companyName: "",
          role: "",
          startDate: "",
          endDate: "",
          location: "remote",
          jobType: "full-time",
          jobTechStack: "",
          worked: "",
          isCurrent: false,
        },
      ],
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

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experience",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAbout();
        // console.log(data);
        if (data) {
          setHasExistingData(true);
          setAboutId(data._id || null);

          reset(
            {
              contacts: data.contacts || [{ name: "", link: "" }],
              journey: data.journey || [
                { year: "", description: "", title: "" },
              ],
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
              experience: (data.experience || []).map(
                (exp: Record<string, unknown>) => ({
                  companyName: exp.companyName || "",
                  role: exp.role || "",
                  startDate: exp.startDate
                    ? new Date(exp.startDate as string)
                        .toISOString()
                        .slice(0, 10)
                    : "",
                  endDate:
                    exp.endDate === "present"
                      ? ""
                      : exp.endDate
                      ? new Date(exp.endDate as string)
                          .toISOString()
                          .slice(0, 10)
                      : "",
                  location: exp.location || "remote",
                  jobType: exp.jobType || "full-time",
                  jobTechStack: Array.isArray(exp.jobTechStack)
                    ? exp.jobTechStack.join(", ")
                    : exp.jobTechStack || "",
                  worked: Array.isArray(exp.worked)
                    ? exp.worked.join(", ")
                    : exp.worked || "",
                  isCurrent: exp.endDate === "present",
                })
              ) || [
                {
                  companyName: "",
                  role: "",
                  startDate: "",
                  endDate: "",
                  location: "remote",
                  jobType: "full-time",
                  jobTechStack: "",
                  worked: "",
                  isCurrent: false,
                },
              ],
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

  const getDirtyValues = (
    dirtyFields: Record<string, unknown>,
    allValues: Record<string, unknown>
  ): Record<string, unknown> => {
    const dirtyValues: Record<string, unknown> = {};

    Object.keys(dirtyFields).forEach((key) => {
      if (dirtyFields[key] === true) {
        dirtyValues[key] = allValues[key];
      } else if (
        typeof dirtyFields[key] === "object" &&
        !Array.isArray(dirtyFields[key])
      ) {
        const nestedDirtyValues = getDirtyValues(
          dirtyFields[key] as Record<string, unknown>,
          allValues[key] as Record<string, unknown>
        );
        if (Object.keys(nestedDirtyValues).length > 0) {
          dirtyValues[key] = nestedDirtyValues;
        }
      } else if (Array.isArray(dirtyFields[key])) {
        const arrayDirtyFields = dirtyFields[key] as unknown[];
        const hasDirtyItems = arrayDirtyFields.some((item: unknown) => {
          if (typeof item === "object" && item !== null) {
            const keys = Object.keys(item as Record<string, unknown>);
            return keys.some(
              (k) =>
                (item as Record<string, unknown>)[k] === true ||
                (typeof (item as Record<string, unknown>)[k] === "object" &&
                  Object.keys(
                    (item as Record<string, unknown>)[k] as Record<
                      string,
                      unknown
                    >
                  ).length > 0)
            );
          }
          return item === true;
        });

        if (hasDirtyItems) {
          dirtyValues[key] = allValues[key];
        }
      }
    });

    return dirtyValues;
  };

  const normalizeAboutPayload = (
    values: Record<string, unknown>
  ): Record<string, unknown> => {
    const normalized: Record<string, unknown> = { ...values };

    const splitCsv = (str: unknown) =>
      typeof str === "string"
        ? str
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
        : Array.isArray(str)
        ? str
        : [];

    const toDate = (d: unknown) =>
      d instanceof Date
        ? d
        : typeof d === "string" && d
        ? new Date(d)
        : undefined;

    if (
      normalized.aboutInfo &&
      typeof (normalized.aboutInfo as Record<string, unknown>).sampleText !==
        "undefined"
    ) {
      normalized.aboutInfo = {
        ...(normalized.aboutInfo as Record<string, unknown>),
        sampleText: splitCsv(
          (normalized.aboutInfo as Record<string, unknown>).sampleText
        ),
      };
    }

    if (Array.isArray(normalized.experience)) {
      normalized.experience = (
        normalized.experience as Record<string, unknown>[]
      ).map((exp: Record<string, unknown>) => {
        const next: Record<string, unknown> = { ...exp };
        if (typeof next.jobTechStack !== "undefined") {
          next.jobTechStack = splitCsv(next.jobTechStack);
        }
        if (typeof next.worked !== "undefined") {
          next.worked = splitCsv(next.worked);
        }
        if (next.isCurrent === true) {
          next.endDate = "present";
        }
        delete next.isCurrent;
        if (typeof next.startDate !== "undefined") {
          const v = toDate(next.startDate);
          if (v) next.startDate = v;
        }
        if (typeof next.endDate !== "undefined" && next.endDate !== "present") {
          const v = toDate(next.endDate);
          if (v) next.endDate = v;
        }
        return next;
      });
    }

    return normalized;
  };

  const onSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true);

    await withErrorHandling(
      async () => {
        let result;
        if (hasExistingData && aboutId) {
          const changedData = getDirtyValues(dirtyFields, data);
          const normalizedChanged = normalizeAboutPayload(changedData);
          result = await updateAbout(
            normalizedChanged as unknown as AboutData,
            aboutId
          );
        } else {
          const normalizedData = normalizeAboutPayload(data);
          result = await createAbout(normalizedData as unknown as AboutData);
        }

        if (!result?.success) {
          throw new Error(
            result?.message || "Failed to save about information"
          );
        }

        if (!hasExistingData && result?.id) {
          setHasExistingData(true);
          setAboutId(result.id);
        }

        return result;
      },
      {
        successMessage: hasExistingData
          ? "About information updated successfully! ✅"
          : "About information created successfully! ✅",
        errorMessage: "Failed to save about information. Please try again.",
      }
    );

    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white">About</h1>
        <p className="mt-2 text-gray-400">
          Manage your contact information and academic background.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Contacts</h2>
            <button
              type="button"
              onClick={() => appendContact({ name: "", link: "" })}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Add Contact
            </button>
          </div>

          <div className="space-y-4">
            {contactFields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-4 p-4 border border-white/10 rounded-lg bg-white/5"
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      {...register(`contacts.${index}.name` as const)}
                      type="text"
                      className="w-full px-4 py-2 border border-white/10 rounded-lg bg-transparent text-white placeholder:text-gray-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none hover:border-white/20 transition-all duration-200"
                      placeholder="Contact name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Link
                    </label>
                    <input
                      {...register(`contacts.${index}.link` as const)}
                      type="url"
                      className="w-full px-4 py-2 border border-white/10 rounded-lg bg-transparent text-white placeholder:text-gray-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none hover:border-white/20 transition-all duration-200"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeContact(index)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white mb-6">About Me</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                {...register("aboutInfo.email")}
                type="email"
                className="w-full px-4 py-2 border border-white/10 rounded-lg bg-transparent text-white placeholder:text-gray-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none hover:border-white/20 transition-all duration-200"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                My Mindset
              </label>
              <textarea
                {...register("aboutInfo.sampleText")}
                className="w-full px-4 py-2 border border-white/10 rounded-lg bg-transparent text-white placeholder:text-gray-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none hover:border-white/20 transition-all duration-200"
                placeholder="Write about your mindset, philosophy, values, or what drives you..."
                rows={6}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">My Journey</h2>
            <button
              type="button"
              onClick={() =>
                appendJourney({ year: "", description: "", title: "" })
              }
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Add Journey Entry
            </button>
          </div>

          <div className="space-y-4">
            {journeyFields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-4 p-4 border border-white/10 rounded-lg bg-white/5"
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Year
                    </label>
                    <input
                      {...register(`journey.${index}.year` as const)}
                      type="text"
                      className="w-full px-4 py-2 border border-white/10 rounded-lg bg-transparent text-white placeholder:text-gray-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none hover:border-white/20 transition-all duration-200"
                      placeholder="e.g., 2019, 2020, 2022"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      {...register(`journey.${index}.title` as const)}
                      type="text"
                      className="w-full px-4 py-2 border border-white/10 rounded-lg bg-transparent text-white placeholder:text-gray-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none hover:border-white/20 transition-all duration-200"
                      placeholder="e.g., Started Learning UI/UX Design"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      {...register(`journey.${index}.description` as const)}
                      className="w-full px-4 py-2 border border-white/10 rounded-lg bg-transparent text-white placeholder:text-gray-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none hover:border-white/20 transition-all duration-200"
                      placeholder="e.g., I started designing, I learned React"
                      rows={3}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeJourney(index)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Experience</h2>
            <button
              type="button"
              onClick={() =>
                appendExperience({
                  companyName: "",
                  role: "",
                  startDate: "",
                  endDate: "",
                  location: "remote",
                  jobType: "full-time",
                  jobTechStack: "",
                  worked: "",
                  isCurrent: false,
                })
              }
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Add Experience
            </button>
          </div>

          <div className="space-y-4">
            {experienceFields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-start gap-4 p-4 border border-white/10 rounded-lg bg-white/5"
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Company Name
                    </label>
                    <input
                      {...register(`experience.${index}.companyName` as const)}
                      type="text"
                      className="w-full px-4 py-2 border border-white/10 rounded-lg bg-transparent text-white placeholder:text-gray-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none hover:border-white/20 transition-all duration-200"
                      placeholder="Acme Inc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Role
                    </label>
                    <input
                      {...register(`experience.${index}.role` as const)}
                      type="text"
                      className="w-full px-4 py-2 border border-white/10 rounded-lg bg-transparent text-white placeholder:text-gray-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none hover:border-white/20 transition-all duration-200"
                      placeholder="Frontend Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Start Date
                    </label>
                    <input
                      {...register(`experience.${index}.startDate` as const)}
                      type="date"
                      className="w-full px-4 py-2 border border-white/10 rounded-lg bg-transparent text-white placeholder:text-gray-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none hover:border-white/20 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      End Date
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        {...register(`experience.${index}.endDate` as const)}
                        type="date"
                        className="w-full px-4 py-2 border border-white/10 rounded-lg bg-transparent text-white placeholder:text-gray-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none hover:border-white/20 transition-all duration-200 disabled:opacity-50"
                        disabled={watch(
                          `experience.${index}.isCurrent` as const
                        )}
                      />
                      <label className="inline-flex items-center gap-2 text-sm text-gray-300">
                        <input
                          type="checkbox"
                          {...register(
                            `experience.${index}.isCurrent` as const
                          )}
                          className="rounded border-white/10 bg-transparent text-emerald-500 focus:ring-emerald-500/20"
                        />
                        Present
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Location
                    </label>
                    <select
                      {...register(`experience.${index}.location` as const)}
                      className="w-full px-4 py-2 border border-white/10 rounded-lg bg-transparent text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none hover:border-white/20 transition-all duration-200"
                    >
                      <option value="remote">Remote</option>
                      <option value="onsite">Onsite</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Job Type
                    </label>
                    <select
                      {...register(`experience.${index}.jobType` as const)}
                      className="w-full px-4 py-2 border border-white/10 rounded-lg bg-transparent text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none hover:border-white/20 transition-all duration-200"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Job Tech Stack (comma separated)
                    </label>
                    <input
                      {...register(`experience.${index}.jobTechStack` as const)}
                      type="text"
                      className="w-full px-4 py-2 border border-white/10 rounded-lg bg-transparent text-white placeholder:text-gray-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none hover:border-white/20 transition-all duration-200"
                      placeholder="React, TypeScript, Tailwind CSS"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Worked On (comma separated)
                    </label>
                    <input
                      {...register(`experience.${index}.worked` as const)}
                      type="text"
                      className="w-full px-4 py-2 border border-white/10 rounded-lg bg-transparent text-white placeholder:text-gray-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none hover:border-white/20 transition-all duration-200"
                      placeholder="Landing page redesign, Dashboard charts"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white mb-6">
            University Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                University Name
              </label>
              <input
                type="text"
                {...register(`universityInfo.varsity` as const)}
                className="w-full px-4 py-2 border border-white/10 rounded-lg bg-transparent text-white placeholder:text-gray-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none hover:border-white/20 transition-all duration-200"
                placeholder="Enter university name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Department
              </label>
              <input
                type="text"
                {...register(`universityInfo.department` as const)}
                className="w-full px-4 py-2 border border-white/10 rounded-lg bg-transparent text-white placeholder:text-gray-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none hover:border-white/20 transition-all duration-200"
                placeholder="Enter department name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Year
              </label>
              <input
                type="number"
                {...register(`universityInfo.startYear` as const)}
                className="w-full px-4 py-2 border border-white/10 rounded-lg bg-transparent text-white placeholder:text-gray-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none hover:border-white/20 transition-all duration-200"
                placeholder="2020"
                min="1900"
                max="2100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                End Year
              </label>
              <input
                type="number"
                {...register(`universityInfo.endYear` as const)}
                className="w-full px-4 py-2 border border-white/10 rounded-lg bg-transparent text-white placeholder:text-gray-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none hover:border-white/20 transition-all duration-200"
                placeholder="2024"
                min="1900"
                max="2100"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isDirty || isSubmitting}
            className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Saving..."
              : !isDirty
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
