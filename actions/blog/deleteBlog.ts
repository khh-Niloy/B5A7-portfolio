"use server";
import { revalidateTag } from "next/cache";

export async function deleteBlog(blogId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/blog/${blogId}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to delete blog post",
      };
    }
    revalidateTag("blogs", "max");

    return {
      success: true,
      message: "Blog post deleted successfully",
    };
  } catch (error) {
    console.error("Delete blog error:", error);
    return {
      success: false,
      message: "Failed to delete blog post",
    };
  }
}
