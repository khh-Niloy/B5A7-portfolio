"use server";
import { revalidateTag } from "next/cache";

export async function createBlog(formData: FormData) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blog`, {
      method: "POST",
      body: formData,
      next: { tags: ["blogs"] },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      };
    }

    const result = await response.json();
    revalidateTag("blogs", "max");

    return {
      success: true,
      data: result.data,
      message: "Blog post created successfully",
    };
  } catch (error) {
    console.error("Create blog error:", error);
    
    // Network errors
    if (error instanceof Error && error.message.includes("fetch")) {
      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
      };
    }
    
    return {
      success: false,
      message: "Failed to create blog post. Please try again later.",
    };
  }
}
