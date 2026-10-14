"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  GraduationCap,
  Award,
  Milestone,
  HeartHandshake,
  Plus,
  Trash2,
  Save,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import getAbout from "@/helper/getAbout";
import { updateAbout } from "@/actions/about/updateAbout";
import type { PortfolioData, Education, Certification, Journey } from "@/interfaces/interface";

type TabType = "bio" | "values" | "education" | "journey" | "certifications";

export default function AboutManagement() {
  const [activeTab, setActiveTab] = useState<TabType>("bio");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutData, setAboutData] = useState<PortfolioData | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isDirty },
  } = useForm<{
    bioLead: string;
    bioExpanded: { text: string }[];
    sampleText: string;
    email: string;
    workValues: { value: string }[];
    remoteText: string;
    education: Education[];
    universityInfo: {
      varsity: string;
      department: string;
      startYear: string;
      endYear: string;
    };
    journey: Journey[];
    certifications: Certification[];
  }>({
    defaultValues: {
      bioLead: "",
      bioExpanded: [],
      sampleText: "",
      email: "",
      workValues: [],
      remoteText: "",
      education: [],
      universityInfo: {
        varsity: "",
        department: "",
        startYear: "",
        endYear: "",
      },
      journey: [],
      certifications: [],
    },
  });

  const {
    fields: bioExpandedFields,
    append: appendBioExpanded,
    remove: removeBioExpanded,
  } = useFieldArray({
    control,
    name: "bioExpanded",
  });

  const {
    fields: workValueFields,
    append: appendWorkValue,
    remove: removeWorkValue,
  } = useFieldArray({
    control,
    name: "workValues",
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
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
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification,
  } = useFieldArray({
    control,
    name: "certifications",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAbout();
      if (data) {
        setAboutData(data);
        reset({
          bioLead: data.bioLead || "",
          bioExpanded: (data.bioExpanded || []).map((text: string) => ({ text })),
          sampleText: Array.isArray(data.aboutInfo?.sampleText)
            ? data.aboutInfo.sampleText.join("\n\n")
            : (data.aboutInfo?.sampleText as unknown as string) || "",
          email: data.aboutInfo?.email || "",
          workValues: (data.workValues || []).map((val: string) => ({ value: val })),
          remoteText: data.remoteText || "",
          education: data.education || [],
          universityInfo: {
            varsity: data.universityInfo?.varsity || "",
            department: data.universityInfo?.department || "",
            startYear: String(data.universityInfo?.startYear || ""),
            endYear: String(data.universityInfo?.endYear || ""),
          },
          journey: (data.journey || []).map((j: any) => ({
            year: j.year || "",
            title: j.title || "",
            description: j.description || j.desc || "",
          })),
          certifications: data.certifications || [],
        });
      }
    } catch (err) {
      console.error("Failed to load about data:", err);
      toast.error("Failed to load about data");
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
      const sampleTextArray = values.sampleText
        ? values.sampleText
            .split("\n")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [];

      const payload: Partial<PortfolioData> = {
        bioLead: values.bioLead,
        bioExpanded: values.bioExpanded.map((item: { text: string }) => item.text).filter(Boolean),
        workValues: values.workValues.map((item: { value: string }) => item.value).filter(Boolean),
        remoteText: values.remoteText,
        education: values.education,
        universityInfo: {
          varsity: values.universityInfo.varsity,
          department: values.universityInfo.department,
          startYear: Number(values.universityInfo.startYear) || undefined,
          endYear: Number(values.universityInfo.endYear) || undefined,
        },
        journey: values.journey,
        certifications: values.certifications,
        aboutInfo: {
          email: values.email,
          sampleText: sampleTextArray,
        },
      };

      const res = await updateAbout(payload, aboutData?._id);

      if (res?.success || res?.data) {
        toast.success("About information saved successfully! 🎓");
        loadData();
      } else {
        toast.error(res?.message || "Failed to update about information");
      }
    } catch (err) {
      console.error("Error saving about data:", err);
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
          <p className="mt-4 text-gray-400">Loading about information...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "bio", label: "Bio & Philosophy", icon: FileText },
    { id: "values", label: "Work Values & Remote", icon: HeartHandshake },
    { id: "education", label: "Education & Academics", icon: GraduationCap },
    { id: "journey", label: "Career Milestones", icon: Milestone },
    { id: "certifications", label: "Certifications", icon: Award },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-emerald-400" />
            About, Academics & Milestones
          </h1>
          <p className="mt-2 text-gray-400">
            Manage your biography, career narrative, university background, certifications, and engineering philosophy.
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
              Save All Changes
            </div>
          )}
        </Button>
      </div>

      {/* Tabs Bar */}
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
        {/* TAB 1: Bio & Philosophy */}
        {activeTab === "bio" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm space-y-5">
              <div>
                <Label htmlFor="bioLead" className="text-gray-300 font-semibold text-base">
                  Lead Biography Paragraph
                </Label>
                <p className="text-xs text-gray-400 mb-2">
                  The primary highlight summary displayed right below your hero section.
                </p>
                <Textarea
                  id="bioLead"
                  {...register("bioLead")}
                  rows={3}
                  placeholder="e.g. I am a Software Engineer specializing in building full-stack web applications..."
                  className="bg-black/40 border-white/10 text-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Label className="text-gray-300 font-semibold text-base">
                      Expanded Story Paragraphs
                    </Label>
                    <p className="text-xs text-gray-400">
                      Paragraphs revealed when visitors click "Read More" in the About section.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendBioExpanded({ text: "" })}
                    className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Paragraph
                  </Button>
                </div>

                <div className="space-y-3">
                  {bioExpandedFields.map((field, idx) => (
                    <div
                      key={field.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-white/10 bg-black/20"
                    >
                      <div className="flex-1">
                        <Textarea
                          {...register(`bioExpanded.${idx}.text` as const)}
                          rows={3}
                          placeholder={`Paragraph ${idx + 1}...`}
                          className="bg-black/40 border-white/10 text-white text-sm"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeBioExpanded(idx)}
                        className="text-red-400 hover:bg-red-500/10 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {bioExpandedFields.length === 0 && (
                    <p className="text-sm text-gray-500 italic py-2">
                      No expanded paragraphs configured. Click "Add Paragraph" to add one.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <Label htmlFor="email" className="text-gray-300">
                    Primary Contact Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="niloy@example.com"
                    className="mt-1.5 bg-black/40 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="sampleText" className="text-gray-300">
                    Mindset & Principles (One per line)
                  </Label>
                  <Textarea
                    id="sampleText"
                    {...register("sampleText")}
                    rows={3}
                    placeholder="Code with long-term mindset&#10;Clean architecture&#10;Continuous learning"
                    className="mt-1.5 bg-black/40 border-white/10 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Work Values & Remote */}
        {activeTab === "values" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Work Values & Engineering Principles</h3>
                  <p className="text-xs text-gray-400">
                    The core values rendered inside the Work Values card on the homepage.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendWorkValue({ value: "" })}
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Value
                </Button>
              </div>

              <div className="space-y-3">
                {workValueFields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-black/20"
                  >
                    <span className="text-xs text-emerald-400 font-mono w-6">#{idx + 1}</span>
                    <Input
                      {...register(`workValues.${idx}.value` as const)}
                      placeholder="e.g. End-to-end ownership: taking features from idea through deployment"
                      className="flex-1 bg-black/40 border-white/10 text-white"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeWorkValue(idx)}
                      className="text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10">
                <Label htmlFor="remoteText" className="text-gray-300 font-semibold text-base">
                  Remote Work & Timezone Readiness
                </Label>
                <p className="text-xs text-gray-400 mb-2">
                  Describes your availability for remote collaboration and global teams.
                </p>
                <Textarea
                  id="remoteText"
                  {...register("remoteText")}
                  rows={3}
                  placeholder="e.g. Experienced in asynchronous workflows, agile sprints, and real-time pairing across US and European timezones."
                  className="bg-black/40 border-white/10 text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Education & Academics */}
        {activeTab === "education" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Academic Degrees & Institutions</h3>
                  <p className="text-xs text-gray-400">
                    Manage multiple university degrees, diplomas, or educational accomplishments.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendEducation({
                      university: "",
                      degree: "B.Sc.",
                      department: "Computer Science & Engineering",
                      startYear: "2020",
                      endYear: "2024",
                      gpa: "",
                      highlights: "",
                    })
                  }
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Education Entry
                </Button>
              </div>

              <div className="space-y-4">
                {educationFields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="p-4 rounded-xl border border-white/10 bg-black/20 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-emerald-400">Degree #{idx + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEducation(idx)}
                        className="text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs text-gray-300">University / College</Label>
                        <Input
                          {...register(`education.${idx}.university` as const)}
                          placeholder="e.g. Daffodil International University"
                          className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-gray-300">Degree</Label>
                        <Input
                          {...register(`education.${idx}.degree` as const)}
                          placeholder="e.g. Bachelor of Science"
                          className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-gray-300">Department / Major</Label>
                        <Input
                          {...register(`education.${idx}.department` as const)}
                          placeholder="e.g. Computer Science & Engineering"
                          className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-gray-300">Start Year</Label>
                        <Input
                          {...register(`education.${idx}.startYear` as const)}
                          placeholder="2020"
                          className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-gray-300">End Year (or Present)</Label>
                        <Input
                          {...register(`education.${idx}.endYear` as const)}
                          placeholder="2024"
                          className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-gray-300">GPA / Honors (Optional)</Label>
                        <Input
                          {...register(`education.${idx}.gpa` as const)}
                          placeholder="e.g. 3.85 / 4.00"
                          className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-300">Highlights / Focus Areas</Label>
                      <Input
                        {...register(`education.${idx}.highlights` as const)}
                        placeholder="e.g. Algorithms, Distributed Systems, Software Engineering Project Award"
                        className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Legacy University Info (for backward compatibility) */}
              <div className="pt-6 border-t border-white/10">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">
                  Primary University Info (Default / Fallback)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-xs text-gray-400">University</Label>
                    <Input
                      {...register("universityInfo.varsity")}
                      placeholder="University name"
                      className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-400">Department</Label>
                    <Input
                      {...register("universityInfo.department")}
                      placeholder="Department"
                      className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-400">Start Year</Label>
                    <Input
                      {...register("universityInfo.startYear")}
                      placeholder="2020"
                      className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-400">End Year</Label>
                    <Input
                      {...register("universityInfo.endYear")}
                      placeholder="2024"
                      className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Career Milestones & Journey */}
        {activeTab === "journey" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Career Milestones & Journey Timeline</h3>
                  <p className="text-xs text-gray-400">
                    Chronological journey displayed on your profile timeline.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendJourney({ year: "2024", title: "", description: "" })}
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Milestone
                </Button>
              </div>

              <div className="space-y-4">
                {journeyFields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="p-4 rounded-xl border border-white/10 bg-black/20 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-emerald-400">Milestone #{idx + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeJourney(idx)}
                        className="text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="sm:col-span-1">
                        <Label className="text-xs text-gray-300">Year / Date</Label>
                        <Input
                          {...register(`journey.${idx}.year` as const)}
                          placeholder="e.g. 2023"
                          className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <Label className="text-xs text-gray-300">Milestone Title</Label>
                        <Input
                          {...register(`journey.${idx}.title` as const)}
                          placeholder="e.g. Transitioned to Full-Stack Engineering"
                          className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-300">Description</Label>
                      <Textarea
                        {...register(`journey.${idx}.description` as const)}
                        rows={2}
                        placeholder="Key learnings, achievements, and responsibilities during this phase..."
                        className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Certifications */}
        {activeTab === "certifications" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Certifications & Honors</h3>
                  <p className="text-xs text-gray-400">
                    Professional credentials, licenses, or verified certificates.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendCertification({
                      title: "",
                      issuer: "",
                      issueDate: "",
                      url: "",
                      credentialId: "",
                    })
                  }
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Certification
                </Button>
              </div>

              <div className="space-y-4">
                {certificationFields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="p-4 rounded-xl border border-white/10 bg-black/20 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-emerald-400">Certificate #{idx + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCertification(idx)}
                        className="text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs text-gray-300">Certificate Name</Label>
                        <Input
                          {...register(`certifications.${idx}.title` as const)}
                          placeholder="e.g. AWS Certified Developer"
                          className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-300">Issuing Organization</Label>
                        <Input
                          {...register(`certifications.${idx}.issuer` as const)}
                          placeholder="e.g. Amazon Web Services"
                          className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-300">Issue Date</Label>
                        <Input
                          {...register(`certifications.${idx}.issueDate` as const)}
                          placeholder="e.g. Nov 2024"
                          className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-300">Verification URL</Label>
                        <Input
                          {...register(`certifications.${idx}.url` as const)}
                          placeholder="https://..."
                          className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-xs text-gray-300">Credential ID</Label>
                        <Input
                          {...register(`certifications.${idx}.credentialId` as const)}
                          placeholder="e.g. ABC-1234567"
                          className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
            {saving ? "Saving Changes..." : "Save About Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
