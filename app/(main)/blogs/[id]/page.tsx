import React from "react";
import getBlogs from "@/helper/getBlogs";
import getEachBlog from "@/helper/getEachBlog";

export async function generateStaticParams() {
  const blogs = await getBlogs();
  return blogs.map((blog: { _id: string }) => ({
    id: blog._id,
  }));
}

export default async function SingleBlog({
  params,
}: {
  params: { id: string };
}) {
  const blog = await getEachBlog(params.id);

  return (
    <div className="text-white pt-32 pb-32 w-[85%] lg:w-[90%] mx-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{blog?.title}</h1>
        <div className="text-gray-400 mb-8">
          {new Date(blog?.createdAt).toLocaleDateString()}
        </div>
        {blog?.coverImage && (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
        )}
        <div className="prose prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
            {blog?.content}
          </div>
        </div>
      </div>
    </div>
  );
}
