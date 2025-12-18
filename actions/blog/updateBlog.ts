"use server";
import { revalidateTag } from "next/cache";

export async function updateBlog(blogId: string, formData: FormData) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/blog/${blogId}`,
      {
        method: "PATCH",
        body: formData,
      }
    );
    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to update blog post",
      };
    }
    revalidateTag("blogs", "max");

    return {
      success: true,
      data: result.data,
      message: "Blog post updated successfully",
    };
  } catch (error) {
    console.error("Update blog error:", error);
    return {
      success: false,
      message: "Failed to update blog post",
    };
  }
}
