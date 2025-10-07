"use server";

export async function deleteBlog(blogId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blog/${blogId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to delete blog post",
      };
    }

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
