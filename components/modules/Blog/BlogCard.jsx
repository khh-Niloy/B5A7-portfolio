"use client";
import React from "react";
import { Calendar, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
      <div className="group relative bg-[#090D22] border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
        {coverImage && (
          <div className="mb-4 overflow-hidden rounded-xl">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-white/5 text-white border border-white/10 rounded-full text-xs font-medium capitalize transition-all duration-200">
            <Tag className="w-3 h-3 inline mr-1" />
            {category}
          </span>
          <span className="text-gray-500 text-xs flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(createdAt)}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-white mb-3">
          {title}
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          {truncatedContent}
        </p>

        <div className="flex items-center justify-between">
          <DialogTrigger asChild>
            <button className="text-gray-300 text-sm font-medium hover:text-white transition-colors duration-200 cursor-pointer">
              Read More →
            </button>
          </DialogTrigger>
        </div>
      </div>

      <DialogContent className="max-w-4xl max-h-[70vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-white/10">
          <DialogTitle className="text-2xl font-bold text-white mb-3">
            {title}
          </DialogTitle>
          
          <div className="flex items-center gap-4 text-sm">
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

        <div className="pt-6">
          {coverImage && (
            <div className="mb-6 overflow-hidden rounded-xl">
              <img
                src={coverImage}
                alt={title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
              {content}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
