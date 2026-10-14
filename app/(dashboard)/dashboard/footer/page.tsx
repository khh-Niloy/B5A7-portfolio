"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Share2,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Save,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import getAbout from "@/helper/getAbout";
import { updateAbout } from "@/actions/about/updateAbout";
import type { PortfolioData, SocialLink } from "@/interfaces/interface";

const PRESET_PLATFORMS = [
  { name: "GitHub", url: "https://github.com/khh-Niloy" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/hasibhossain-niloy01/" },
  { name: "Twitter / X", url: "https://twitter.com/" },
  { name: "Facebook", url: "https://www.facebook.com/khhniloy.niloy/" },
  { name: "YouTube", url: "https://youtube.com/" },
  { name: "Email", url: "mailto:niloy@example.com" },
];

export default function FooterManagement() {
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
    socialLinks: SocialLink[];
  }>({
    defaultValues: {
      socialLinks: [],
    },
  });

  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({
    control,
    name: "socialLinks",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAbout();
      if (data) {
        setAboutData(data);
        const links = data.socialLinks?.length
          ? data.socialLinks
          : [
              { name: "GitHub", link: "https://github.com/khh-Niloy" },
              {
                name: "LinkedIn",
                link: "https://www.linkedin.com/in/hasibhossain-niloy01/",
              },
              {
                name: "Facebook",
                link: "https://www.facebook.com/khhniloy.niloy/",
              },
            ];

        reset({ socialLinks: links });
      }
    } catch (err) {
      console.error("Failed to load footer data:", err);
      toast.error("Failed to load footer & social links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onSubmit = async (values: { socialLinks: SocialLink[] }) => {
    setSaving(true);
    try {
      const filtered = values.socialLinks.filter(
        (item) => item.name.trim() !== "" && item.link.trim() !== ""
      );

      const res = await updateAbout({ socialLinks: filtered }, aboutData?._id);

      if (res?.success || res?.data) {
        toast.success("Social links updated successfully! 🔗");
        loadData();
      } else {
        toast.error(res?.message || "Failed to update social links");
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
          <p className="mt-4 text-gray-400">Loading social links...</p>
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
            <Share2 className="w-8 h-8 text-emerald-400" />
            Footer & Social Links
          </h1>
          <p className="mt-2 text-gray-400">
            Manage your social networks, public developer profiles, and direct connection links.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => appendSocial({ name: "", link: "" })}
            className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Social Link
          </Button>

          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={saving || !isDirty}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-lg shadow-emerald-500/20"
          >
            {saving ? "Saving..." : (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Links
              </div>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-semibold text-white">Configured Social Links</h2>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs text-gray-500 mr-1 self-center">Quick Add:</span>
              {PRESET_PLATFORMS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => appendSocial({ name: preset.name, link: preset.url })}
                  className="text-[11px] px-2 py-0.5 rounded border border-white/10 bg-white/[0.03] text-gray-300 hover:bg-white/[0.08] hover:text-white transition-all"
                >
                  +{preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {socialFields.map((field, idx) => (
              <div
                key={field.id}
                className="flex flex-col sm:flex-row items-end sm:items-center gap-4 p-4 rounded-xl border border-white/10 bg-black/30"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                  {idx + 1}
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <div>
                    <Label className="text-xs text-gray-300">Platform Name</Label>
                    <Input
                      {...register(`socialLinks.${idx}.name` as const)}
                      placeholder="e.g. GitHub, LinkedIn, X"
                      className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-gray-300">Profile URL</Label>
                    <Input
                      {...register(`socialLinks.${idx}.link` as const)}
                      type="url"
                      placeholder="https://..."
                      className="mt-1 bg-black/40 border-white/10 text-white text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      const currentLink = (document.querySelector(
                        `input[name="socialLinks.${idx}.link"]`
                      ) as HTMLInputElement)?.value;
                      if (currentLink) window.open(currentLink, "_blank");
                    }}
                    className="p-2 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                    title="Open Link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSocial(idx)}
                    className="text-red-400 hover:bg-red-500/10"
                    title="Delete Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {socialFields.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No social links configured. Click "Add Social Link" above to add your profiles.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-white/10">
          <Button
            type="submit"
            disabled={saving || !isDirty}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2.5 font-medium shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Social Links"}
          </Button>
        </div>
      </form>
    </div>
  );
}
