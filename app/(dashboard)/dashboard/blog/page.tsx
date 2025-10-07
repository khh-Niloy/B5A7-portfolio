"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { createBlog } from "@/actions/blog/createBlog";
import { updateBlog } from "@/actions/blog/updateBlog";
import { deleteBlog } from "@/actions/blog/deleteBlog";
import getBlogs from "@/helper/getBlogs";
import getEachBlog from "@/helper/getEachBlog";

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogFormValues {
  title: string;
  content: string;
  category: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm<BlogFormValues>({
    defaultValues: {
      title: "",
      content: "",
      category: "",
    },
  });

  // Fetch blog posts
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
      try {
        const result = await deleteBlog(postId);
        if (result?.success) {
          setPosts(posts.filter(post => post._id !== postId));
          toast.success("Blog post deleted successfully!");
        } else {
          toast.error(result?.message || "Failed to delete blog post");
        }
      } catch (error) {
        console.error("Failed to delete post:", error);
        toast.error("Failed to delete blog post");
      }
    }
  };

  const onSubmit = async (data: BlogFormValues) => {
    try {
      if (files.length === 0 && !isEditing) {
        toast.error("Please upload a cover image");
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      
      // Append cover image if new file is uploaded
      if (files.length > 0) {
        formData.append("files", files[0]);
      }

      // Append other fields
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("category", data.category);

      if (isEditing && editingPost) {
        const result = await updateBlog(editingPost._id, formData);
        if (result?.success) {
          toast.success("Blog post updated successfully! 🎉");
          setShowForm(false);
          setFiles([]);
          reset();
          fetchPosts(); // Refresh posts list
        } else {
          toast.error(result?.message || "Failed to update blog post");
        }
      } else {
        const result = await createBlog(formData);
        if (result?.success) {
          toast.success("Blog post created successfully! 🎉");
          setShowForm(false);
          setFiles([]);
          reset();
          fetchPosts(); // Refresh posts list
        } else {
          toast.error(result?.message || "Failed to create blog post");
        }
      }
    } catch (error) {
      console.error("Failed to save post:", error);
      toast.error("Failed to save blog post");
    }
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
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Blog Management
          </h1>
          <p className="mt-2 text-gray-400">
            Create, edit, and manage your blog posts.
          </p>
        </div>
        
        {!showForm && (
          <Button
            onClick={handleCreate}
            className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        )}
      </div>

      {/* Blog Form */}
      {showForm && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
            </h2>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-white/10 text-gray-300 hover:bg-white/5"
            >
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Cover Image Upload */}
            <div>
              <Label>Cover Image</Label>
              {isEditing && editingPost?.coverImage && (
                <div className="mt-2 mb-4">
                  <img 
                    src={editingPost.coverImage} 
                    alt="Current cover"
                    className="w-full max-w-md h-48 object-cover rounded-lg border border-white/10"
                  />
                  <p className="text-sm text-gray-400 mt-2">Current cover image</p>
                </div>
              )}
              <div className="mt-2">
                <FileUpload onChange={setFiles} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter blog post title"
                  {...register("title")}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  {...register("category")}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-transparent px-4 py-2 text-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none hover:border-white/20 transition-all duration-200"
                  required
                >
                  <option value="" className="bg-[#0a0f1e] text-gray-400">Select a category</option>
                  <option value="technology" className="bg-[#0a0f1e] text-white">Technology</option>
                  <option value="programming" className="bg-[#0a0f1e] text-white">Programming</option>
                  <option value="web-development" className="bg-[#0a0f1e] text-white">Web Development</option>
                  <option value="tutorials" className="bg-[#0a0f1e] text-white">Tutorials</option>
                  <option value="personal" className="bg-[#0a0f1e] text-white">Personal</option>
                  <option value="career" className="bg-[#0a0f1e] text-white">Career</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your blog post content here..."
                {...register("content")}
                className="mt-2 min-h-[300px]"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="border-white/10 text-gray-300 hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-200"
              >
                {isEditing ? "Update Post" : "Create Post"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Blog Posts List */}
      {!showForm && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white mb-6">
            All Blog Posts ({posts.length})
          </h2>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No blog posts yet.</p>
              <Button
                onClick={handleCreate}
                className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Post
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="border border-white/10 rounded-lg p-4 bg-white/5 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    {/* Cover Image Thumbnail */}
                    {post.coverImage && (
                      <div className="flex-shrink-0">
                        <img 
                          src={post.coverImage} 
                          alt={post.title}
                          className="w-20 h-20 object-cover rounded-lg border border-white/10"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {post.title}
                          </h3>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs">
                              {post.category}
                            </span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          <p className="text-gray-400 text-sm line-clamp-2">
                            {post.content.substring(0, 150)}...
                          </p>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
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
