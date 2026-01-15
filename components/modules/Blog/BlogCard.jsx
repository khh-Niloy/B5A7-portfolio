"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import Link from "next/link";

export default function BlogCard({
  title,
  content,
  coverImage,
  category,
  createdAt,
  id,
}) {
  const truncatedContent =
    content.length > 150 ? content.substring(0, 150) + "..." : content;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Dialog>
      <div className="group relative bg-[#090D22]/40 border border-white/10 rounded-2xl p-4 sm:p-5 md:p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
        {coverImage && (
          <div className="mb-4 overflow-hidden rounded-xl">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-40 sm:h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-white/5 text-white border border-white/10 rounded-full text-xs font-medium capitalize transition-all duration-200">
            <Tag className="w-3 h-3 inline mr-1" />
            {category}
          </span>
          <span className="text-gray-500 text-xs flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(createdAt)}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3">
          {title}
        </h3>

        <p className="text-gray-400 text-[13px] sm:text-sm leading-relaxed mb-4">
          {truncatedContent}
        </p>

        <div className="w-full">
          {/* <Link className="cursor-pointer hover:underline" href={`/blogs/${id}`}>Read More →</Link> */}
          <DialogTrigger asChild>
            <Button size="sm" className="cursor-pointer w-full" variant="outline">
              Quick Details
            </Button>
          </DialogTrigger>
        </div>
      </div>

      <DialogContent className="w-[94%] sm:w-auto sm:max-w-2xl lg:max-w-3xl max-h-[70vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#090D22]/95 p-0 backdrop-blur-xl">
        {coverImage && (
          <div className="relative h-48 sm:h-60 md:h-72 overflow-hidden">
            <img
              src={coverImage}
              alt={title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-100">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 font-medium capitalize">
                  <Tag className="h-3 w-3" />
                  {category}
                </span>
                <span className="inline-flex items-center gap-1 text-white/80">
                  <Calendar className="h-3 w-3" />
                  {formatDate(createdAt)}
                </span>
                <Link
                  href={`/blogs/${id}`}
                  className="ml-auto inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
                >
                  Read Full Article
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6 px-5 py-6 sm:px-7 sm:py-8">
          {!coverImage && (
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 font-medium capitalize text-white">
                <Tag className="h-3 w-3" />
                {category}
              </span>
              <span className="inline-flex items-center gap-1 text-gray-300">
                <Calendar className="h-3 w-3" />
                {formatDate(createdAt)}
              </span>
              <Link
                href={`/blogs/${id}`}
                className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white transition hover:bg-white/10"
              >
                Read Full Article
              </Link>
            </div>
          )}

          <DialogHeader className="space-y-4 border-b border-white/10 pb-5">
            <DialogTitle className="text-2xl sm:text-3xl font-semibold text-white leading-tight">
              {title}
            </DialogTitle>
            <p className="text-sm text-gray-400 sm:text-base">
              A curated highlight from our knowledge base. Explore the full
              narrative, actionable insights, and supplemental resources below.
            </p>
          </DialogHeader>

          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-200 sm:text-base">
              {content}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-gray-300 sm:text-sm">
            <span className="font-semibold text-white">Need more context?</span>
            <p className="leading-relaxed">
              Continue the journey on the full article page to access related
              stories, references, and downloadable assets curated by our team.
            </p>
            <Link
              href={`/blogs/${id}`}
              className="inline-flex w-full items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Visit Full Article
            </Link>
          </div>

          <DialogClose asChild>
            <Button variant="outline" className="w-full cursor-pointer">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
