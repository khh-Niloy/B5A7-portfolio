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

export default function BlogCard({
  title,
  content,
  coverImage,
  category,
  createdAt,
}) {
  const truncatedContent = content.length > 150 
    ? content.substring(0, 150) + "..." 
    : content;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Dialog>
      <div className="group relative bg-[#090D22] border border-white/10 rounded-2xl p-4 sm:p-5 md:p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
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

        <div className="flex items-center justify-between">
          <DialogTrigger asChild>
            <button className="text-gray-300 text-sm sm:text-base font-medium hover:text-white transition-colors duration-200 cursor-pointer">
              Read More →
            </button>
          </DialogTrigger>
        </div>
      </div>

      <DialogContent className="w-[94%] sm:w-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl max-h-[70vh] overflow-y-auto p-3 sm:p-6">
        <DialogHeader className="pb-3 sm:pb-4 border-b border-white/10">
          <DialogTitle className="text-lg sm:text-2xl leading-tight break-words hyphens-auto font-bold text-white mb-2 sm:mb-3">
            {title}
          </DialogTitle>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <span className="px-3 py-1.5 bg-white/10 text-white border border-white/10 rounded-full text-xs font-medium capitalize">
              <Tag className="w-3 h-3 inline mr-1" />
              {category}
            </span>
            <span className="text-gray-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(createdAt)}
            </span>
          </div>
        </DialogHeader>

        <div className="pt-4 sm:pt-6">
          {coverImage && (
            <div className="mb-6 overflow-hidden rounded-xl">
              <img
                src={coverImage}
                alt={title}
                className="w-full h-40 sm:h-56 md:h-64 object-cover"
              />
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <div className="text-gray-300 leading-relaxed w-[80%] whitespace-pre-wrap text-sm sm:text-base">
              {content}
            </div>
          </div>
        </div>
        {/* Close button at the end */}
        <div className="mt-6">
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
