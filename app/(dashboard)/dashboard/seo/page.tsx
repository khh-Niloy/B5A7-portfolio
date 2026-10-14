"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Globe,
  Save,
  CheckCircle,
  ExternalLink,
  Image as ImageIcon,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import getAbout from "@/helper/getAbout";
import { updateAbout } from "@/actions/about/updateAbout";
import type { PortfolioData, Seo } from "@/interfaces/interface";

export default function SeoManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutData, setAboutData] = useState<PortfolioData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = useForm<{
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogImage: string;
  }>({
    defaultValues: {
      metaTitle: "",
      metaDescription: "",
      keywords: "",
      ogImage: "",
    },
  });

  const metaTitle = watch("metaTitle");
  const metaDescription = watch("metaDescription");
  const ogImage = watch("ogImage");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAbout();
      if (data) {
        setAboutData(data);
        reset({
          metaTitle:
            data.seo?.metaTitle ||
            `${data.name || "Hasib Hossain Niloy"} — ${
              data.title || "Software Engineer & Full-Stack Builder"
            }`,
          metaDescription:
            data.seo?.metaDescription ||
            data.tagline ||
            "Software Engineer specializing in full-stack web applications, scalable backend systems, and AI-powered products.",
          keywords: Array.isArray(data.seo?.keywords)
            ? data.seo.keywords.join(", ")
            : (data.seo?.keywords as unknown as string) ||
              "Hasib Hossain Niloy, Software Engineer, Full Stack Developer, Next.js, TypeScript, Node.js",
          ogImage:
            data.seo?.ogImage ||
            data.avatar ||
            "https://avatars.githubusercontent.com/u/174131986?v=4",
        });
      }
    } catch (err) {
      console.error("Failed to load SEO data:", err);
      toast.error("Failed to load SEO settings");
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
      const keywordsArray = values.keywords
        ? values.keywords
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [];

      const seoPayload: Seo = {
        metaTitle: values.metaTitle.trim(),
        metaDescription: values.metaDescription.trim(),
        keywords: keywordsArray,
        ogImage: values.ogImage.trim(),
      };

      const res = await updateAbout({ seo: seoPayload }, aboutData?._id);

      if (res?.success || res?.data) {
        toast.success("SEO Metadata updated successfully! 🌐");
        loadData();
      } else {
        toast.error(res?.message || "Failed to update SEO settings");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save SEO settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto" />
          <p className="mt-4 text-gray-400">Loading SEO settings...</p>
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
            <Globe className="w-8 h-8 text-emerald-400" />
            SEO & Social Metadata
          </h1>
          <p className="mt-2 text-gray-400">
            Configure how your portfolio looks on Google search, social networks (LinkedIn, Twitter/X), and rich link previews.
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
              Save SEO Settings
            </div>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm space-y-6">
            <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-4">
              Meta Tags Configuration
            </h2>

            <div>
              <Label htmlFor="metaTitle" className="text-gray-300">
                Page Title Tag
              </Label>
              <Input
                id="metaTitle"
                {...register("metaTitle")}
                placeholder="e.g. Hasib Hossain Niloy — Software Engineer & Full-Stack Builder"
                className="mt-1.5 bg-black/40 border-white/10 text-white"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Recommended length: 50-60 characters ({metaTitle?.length || 0} characters)
              </p>
            </div>

            <div>
              <Label htmlFor="metaDescription" className="text-gray-300">
                Meta Description
              </Label>
              <Textarea
                id="metaDescription"
                {...register("metaDescription")}
                rows={3}
                placeholder="Concise summary shown under your title on Google search results..."
                className="mt-1.5 bg-black/40 border-white/10 text-white"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Recommended length: 140-160 characters ({metaDescription?.length || 0} characters)
              </p>
            </div>

            <div>
              <Label htmlFor="keywords" className="text-gray-300">
                Keywords (Comma-separated)
              </Label>
              <Input
                id="keywords"
                {...register("keywords")}
                placeholder="Software Engineer, Full Stack Developer, Next.js, TypeScript, Node.js"
                className="mt-1.5 bg-black/40 border-white/10 text-white"
              />
            </div>

            <div>
              <Label htmlFor="ogImage" className="text-gray-300">
                Open Graph / Social Preview Image URL
              </Label>
              <Input
                id="ogImage"
                {...register("ogImage")}
                placeholder="https://..."
                className="mt-1.5 bg-black/40 border-white/10 text-white font-mono text-xs"
              />
              <p className="text-xs text-gray-400 mt-1">
                Image shown when sharing your link on Twitter/X, LinkedIn, Discord, or Slack.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={saving || !isDirty}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2.5 font-medium shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save SEO Settings"}
            </Button>
          </div>
        </form>

        {/* Live Search & Social Preview Mockup */}
        <div className="space-y-6">
          {/* Google Search Mockup */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <Search className="w-3.5 h-3.5 text-blue-400" />
              Google Search Preview
            </div>
            <div className="p-4 rounded-lg bg-[#202124] border border-white/10 space-y-1">
              <div className="text-xs text-gray-400">https://b5a7-portfolio.vercel.app</div>
              <h4 className="text-base font-medium text-[#8ab4f8] hover:underline cursor-pointer line-clamp-1">
                {metaTitle || "Hasib Hossain Niloy — Software Engineer"}
              </h4>
              <p className="text-xs text-[#bdc1c6] line-clamp-2 leading-relaxed">
                {metaDescription ||
                  "Software Engineer specializing in full-stack web applications, scalable backend systems, and AI-powered products."}
              </p>
            </div>
          </div>

          {/* Social Share Card Mockup */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              Social Card Preview (LinkedIn / X)
            </div>
            <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40">
              <div className="relative w-full h-40 bg-zinc-900">
                {ogImage ? (
                  <Image
                    src={ogImage}
                    alt="Social Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                    No Preview Image
                  </div>
                )}
              </div>
              <div className="p-3.5 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">
                  b5a7-portfolio.vercel.app
                </span>
                <h5 className="text-sm font-semibold text-white line-clamp-1">
                  {metaTitle || "Portfolio of Hasib Hossain Niloy"}
                </h5>
                <p className="text-xs text-gray-400 line-clamp-2">
                  {metaDescription || "Full-stack developer portfolio"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
