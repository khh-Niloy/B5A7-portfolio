"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { Plus, Edit, Trash2, AlertCircle } from "lucide-react";
import { createBlog } from "@/actions/blog/createBlog";
import { updateBlog } from "@/actions/blog/updateBlog";
import { deleteBlog } from "@/actions/blog/deleteBlog";
import getBlogs from "@/helper/getBlogs";
import { blogSchema, type BlogFormValues } from "@/lib/validation";
import { withErrorHandling } from "@/lib/error-handler";
import Image from "next/image";

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}


export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      content: "",
      category: "",
    },
  });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getBlogs();
      setPosts(data || []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreate = () => {
    setIsEditing(false);
    setEditingPost(null);
    setShowForm(true);
    setFiles([]);
    reset();
  };

  const handleEdit = (post: BlogPost) => {
    setIsEditing(true);
    setEditingPost(post);
    setShowForm(true);
    setFiles([]);
    setValue("title", post.title);
    setValue("content", post.content);
    setValue("category", post.category);
  };

  const handleDelete = async (postId: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      await withErrorHandling(
        async () => {
          const result = await deleteBlog(postId);
          if (!result?.success) {
            throw new Error(result?.message || "Failed to delete blog post");
          }
          setPosts(posts.filter((post) => post._id !== postId));
          return result;
        },
        {
          successMessage: "Blog post deleted successfully! 🗑️",
          errorMessage: "Failed to delete blog post. Please try again.",
        }
      );
    }
  };

  const onSubmit = async (data: BlogFormValues) => {
    if (files.length === 0 && !isEditing) {
      return;
    }

    setIsSubmitting(true);

    await withErrorHandling(
      async () => {
        const formData = new FormData();

        if (files.length > 0) {
          formData.append("files", files[0]);
        }

        formData.append("title", data.title);
        formData.append("content", data.content);
        formData.append("category", data.category);

        let result;
        if (isEditing && editingPost) {
          result = await updateBlog(editingPost._id, formData);
        } else {
          result = await createBlog(formData);
        }

        if (!result?.success) {
          throw new Error(result?.message || "Failed to save blog post");
        }

        return result;
      },
      {
        successMessage: isEditing 
          ? "Blog post updated successfully! 🎉" 
          : "Blog post created successfully! 🎉",
        errorMessage: "Failed to save blog post. Please try again.",
        onSuccess: () => {
          setShowForm(false);
          setFiles([]);
          reset();
          fetchPosts();
        },
      }
    );

    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditingPost(null);
    reset();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-10 px-4 md:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Blog Management</h1>
          <p className="mt-2 text-sm md:text-base text-gray-400">
            Create, edit, and manage your blog posts.
          </p>
        </div>

        {!showForm && (
          <Button
            onClick={handleCreate}
            className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-200 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        )}
      </div>

      {showForm && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:p-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-white">
              {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
            </h2>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-white/10 text-gray-300 hover:bg-white/5 w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label>Cover Image</Label>
              {isEditing && editingPost?.coverImage && (
                <div className="mt-2 mb-4">
                  <Image
                    width={80}
                    height={80}
                    src={editingPost.coverImage}
                    alt="Current cover"
                    className="w-full max-w-md h-48 object-cover rounded-lg border border-white/10"
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    Current cover image
                  </p>
                </div>
              )}
              <div className="mt-2">
                <FileUpload onChange={setFiles} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter blog post title"
                  {...register("title")}
                  className={`mt-2 ${errors.title ? "border-red-500 focus:border-red-500" : ""}`}
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  {...register("category")}
                  className={`mt-2 w-full rounded-lg border border-white/10 bg-transparent px-4 py-2 text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none hover:border-white/20 transition-all duration-200 ${errors.category ? "border-red-500 focus:border-red-500" : ""}`}
                  disabled={isSubmitting}
                >
                  <option value="" className="bg-[#0a0f1e] text-gray-400">
                    Select a category
                  </option>
                  <option
                    value="technology"
                    className="bg-[#0a0f1e] text-white"
                  >
                    Technology
                  </option>
                  <option
                    value="programming"
                    className="bg-[#0a0f1e] text-white"
                  >
                    Programming
                  </option>
                  <option
                    value="web-development"
                    className="bg-[#0a0f1e] text-white"
                  >
                    Web Development
                  </option>
                  <option value="tutorials" className="bg-[#0a0f1e] text-white">
                    Tutorials
                  </option>
                  <option value="personal" className="bg-[#0a0f1e] text-white">
                    Personal
                  </option>
                  <option value="career" className="bg-[#0a0f1e] text-white">
                    Career
                  </option>
                </select>
                {errors.category && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your blog post content here..."
                {...register("content")}
                className={`mt-2 min-h-[300px] ${errors.content ? "border-red-500 focus:border-red-500" : ""}`}
                disabled={isSubmitting}
              />
              {errors.content && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.content.message}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="border-white/10 text-gray-300 hover:bg-white/5 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || (files.length === 0 && !isEditing)}
                className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {isSubmitting 
                  ? (isEditing ? "Updating..." : "Creating...") 
                  : (isEditing ? "Update Post" : "Create Post")
                }
              </Button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:p-6 backdrop-blur-sm">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-6">
            All Blog Posts ({posts.length})
          </h2>

          {posts.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <p className="text-gray-400 mb-4">No blog posts yet.</p>
              <Button
                onClick={handleCreate}
                className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-200 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Post
              </Button>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="border border-white/10 rounded-lg p-4 bg-white/5 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {post.coverImage && (
                      <div className="flex-shrink-0 w-full sm:w-20 h-20">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover rounded-lg border border-white/10"
                        />
                      </div>
                    )}

                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                            {post.title}
                          </h3>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-400 mb-2">
                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs w-fit">
                              {post.category}
                            </span>
                            <span className="text-xs sm:text-sm">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-gray-400 text-sm line-clamp-2">
                            {post.content.substring(0, 150)}...
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(post)}
                            className="border-white/10 text-gray-300 hover:bg-white/5"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(post._id)}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
