import getBlogs from "@/helper/getBlogs";
import React from "react";
import BlogCard from "@/components/modules/Blog/BlogCard";
import { AppShell } from "@/components/shell/AppShell";
import { ProfileFooter } from "@/components/profile/ProfileFooter";
import { BookOpen } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
  category: string;
  createdAt: string;
}

export default async function BlogsPage() {
  let blogs: Blog[] = [];
  try {
    const { fullData, slicedData } = await getBlogs();
    blogs = fullData || slicedData || [];
  } catch (error) {
    console.error("Failed to load blogs:", error);
  }

  return (
    <AppShell pageTitle="Library & Blogs">
      <div className="text-left">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-5 w-5 text-emerald-400" />
          <h1 className="text-lg font-semibold text-white">Engineering Library & Insights</h1>
        </div>
        <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
          Technical thoughts, deep-dives into software development life cycles, and React performance.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {blogs && blogs.length > 0 ? (
            blogs.map((blog: Blog) => (
              <BlogCard
                key={blog._id}
                title={blog.title}
                content={blog.content}
                coverImage={blog.coverImage}
                category={blog.category}
                createdAt={blog.createdAt}
                id={blog._id}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-12 rounded-2xl border border-white/5 bg-[#141414] p-8">
              <p className="text-zinc-400 text-sm">
                No blog posts available at the moment.
              </p>
            </div>
          )}
        </div>

        <ProfileFooter />
      </div>
    </AppShell>
  );
}
