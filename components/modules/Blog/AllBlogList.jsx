import React from "react";
import BlogCard from "./BlogCard";
import getBlogs from "@/helper/getBlogs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AllBlogList() {
  const blogs = await getBlogs();

  return (
    <div className="text-white pt-32 pb-20">
      <div className="mb-16 flex items-center justify-center flex-col">
        <h1 id="blog" className="text-4xl text-center mb-2 font-semibold">
          Insights from my dev journey.
        </h1>
        <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"></div>
      </div>

      <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mt-16">
        {blogs && blogs.length > 0 ? (
          blogs.slice(0, 2).map((blog) => (
            <BlogCard
              key={blog._id}
              id={blog._id}
              title={blog.title}
              content={blog.content}
              coverImage={blog.coverImage}
              category={blog.category}
              createdAt={blog.createdAt}
            />
          ))
        ) : (
          <div className="col-span-2 text-center py-12">
            <p className="text-gray-400 text-lg">
              No blog posts available yet.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Link href="/blogs">
          <Button
            size="sm"
            className="cursor-pointer mt-16 text-lg px-5 py-5"
            variant="outline"
          >
            All Blogs
          </Button>
        </Link>
      </div>
    </div>
  );
}
