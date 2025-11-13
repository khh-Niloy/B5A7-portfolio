import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import getBlogs from "@/helper/getBlogs";
import getEachBlog from "@/helper/getEachBlog";

export async function generateStaticParams() {
  try {
    const {fullData} = await getBlogs();
    return fullData.map((blog: { _id: string }) => ({
      id: blog._id,
    }));
  } catch (error) {
    console.error("Failed to generate static params for blogs:", error);
    return [];
  }
}

export default async function SingleBlog({
  params,
}: {
  params: { id: string };
}) {
  const blog = await getEachBlog(params.id);

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
            className="font-semibold underline decoration-indigo-400 underline-offset-4 transition hover:text-indigo-200 hover:decoration-indigo-200"
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
        const isCalloutWorthy =
          containsLink && trimmed.length <= 140 && !trimmed.includes("\n");

        if (isCalloutWorthy) {
          return (
            <div
              key={`callout-${index}`}
              className=""
            >
              <div className="rounded-[calc(theme(borderRadius.3xl)-4px)] px-6 py-5 text-base leading-relaxed text-white/85 sm:text-lg">
                {renderLinkedText(trimmed)}
              </div>
            </div>
          );
        }

        return (
          <p
            key={`paragraph-${index}`}
            className="text-base leading-relaxed text-white/80 sm:text-lg"
          >
            {containsLink ? renderLinkedText(trimmed) : trimmed}
          </p>
        );
      });
  };

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute -top-32 right-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute bottom-0 left-[-5%] h-96 w-96 rounded-full bg-blue-600/10 blur-[140px]" />
      </div>

      <article className="relative mx-auto w-[90%] max-w-4xl pt-28 pb-24 text-white">
        <div className="mb-10 flex items-center gap-3 text-sm text-white/70">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-medium transition hover:border-white/30 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to insights
          </Link>
          <span className="hidden text-white/40 sm:block">/</span>
          <span className="hidden text-white/60 sm:block">Featured Article</span>
        </div>

        <header className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-white/60">
              {blog?.category && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-semibold text-white">
                  <Tag className="h-3 w-3" />
                  {blog.category}
                </span>
              )}
              <span className="inline-flex items-center gap-2 text-white/70">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(blog?.createdAt)}
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
              {blog?.title}
            </h1>
            <p className="max-w-2xl text-base text-white/70 sm:text-lg">
              Thoughtfully curated insight from our studio. Dive into the full
              narrative, contextual frameworks, and the strategies that guide
              our creative momentum.
            </p>
          </div>

          {blog?.coverImage && (
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="h-64 w-full object-cover sm:h-80 md:h-[420px]"
              />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#030616] via-[#030616]/60 to-transparent" />
            </div>
          )}
        </header>

        <section className="mt-12 space-y-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-black/30 sm:p-8">
            <div className="prose prose-invert max-w-none">
              <div className="space-y-6">{renderContent(blog?.content)}</div>
            </div>
          </div>

          <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/10 p-6 text-sm text-indigo-100/90 sm:text-base">
            <h2 className="text-lg font-semibold text-white sm:text-xl">
              Continue the exploration
            </h2>
            <p className="mt-3 leading-relaxed text-white/75">
              We publish deep dives, process notes, and actionable frameworks
              across design, engineering, and storytelling. Return to the blog
              hub to discover more perspectives tailored for founders and
              product teams.
            </p>
            <Link
              href="/blogs"
              className="mt-5 inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
            >
              Browse all posts
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
