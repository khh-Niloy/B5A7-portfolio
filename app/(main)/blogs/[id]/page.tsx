import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import getEachBlog from "@/helper/getEachBlog";
import { AppShell } from "@/components/shell/AppShell";
import { ProfileFooter } from "@/components/profile/ProfileFooter";

export default async function SingleBlog({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = await getEachBlog(id);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderLinkedText = (text: string) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.split(urlPattern).map((segment, index) => {
      const isLink = segment.startsWith("http");
      if (isLink) {
        return (
          <a
            key={`link-${segment}-${index}`}
            href={segment}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-emerald-400 underline decoration-emerald-500/50 underline-offset-4 transition hover:text-emerald-300"
          >
            {segment}
          </a>
        );
      }
      return <React.Fragment key={`text-${index}`}>{segment}</React.Fragment>;
    });
  };

  const renderContent = (content?: string) => {
    if (!content) return null;

    return content
      .split(/\n\s*\n/)
      .filter((block) => block.trim().length > 0)
      .map((block, index) => {
        const trimmed = block.trim();
        const containsLink = trimmed.includes("http");

        return (
          <p
            key={`paragraph-${index}`}
            className="text-sm sm:text-base leading-relaxed text-zinc-300"
          >
            {containsLink ? renderLinkedText(trimmed) : trimmed}
          </p>
        );
      });
  };

  return (
    <AppShell pageTitle="Article">
      <article className="text-left text-white">
        <div className="mb-6 flex items-center gap-2">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Library
          </Link>
        </div>

        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
            {blog?.category && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-medium text-emerald-300 capitalize">
                <Tag className="h-3 w-3" />
                {blog.category}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-zinc-400">
              <Calendar className="h-3 w-3" />
              {formatDate(blog?.createdAt)}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold leading-tight text-white">
            {blog?.title}
          </h1>

          {blog?.coverImage && (
            <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#161616]">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="h-60 sm:h-72 w-full object-cover"
              />
            </div>
          )}
        </header>

        <section className="mt-8 space-y-6">
          <div className="rounded-2xl border border-white/5 bg-[#141414] p-5 sm:p-7 space-y-4">
            {renderContent(blog?.content)}
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-[#121c15] p-5 text-xs sm:text-sm text-zinc-300">
            <h2 className="text-sm font-semibold text-emerald-300">
              Explore more engineering articles
            </h2>
            <p className="mt-1 text-zinc-400 leading-relaxed">
              Read additional notes on software architecture, frontend performance, and web development.
            </p>
            <Link
              href="/blogs"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:underline"
            >
              Browse all library posts →
            </Link>
          </div>
        </section>

        <ProfileFooter />
      </article>
    </AppShell>
  );
}
