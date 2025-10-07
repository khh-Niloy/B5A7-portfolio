"use server";

export async function updateBlog(blogId: string, formData: FormData) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blog/${blogId}`, {
      method: "PATCH",
      body: formData, // Send FormData directly for file upload
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to update blog post",
      };
    }

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
