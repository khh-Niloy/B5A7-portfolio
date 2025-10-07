"use server";

export async function createBlog(formData: FormData) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blog`, {
      method: "POST",
      body: formData, // Send FormData directly for file upload
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to create blog post",
      };
    }

    return {
      success: true,
      data: result.data,
      message: "Blog post created successfully",
    };
  } catch (error) {
    console.error("Create blog error:", error);
    return {
      success: false,
      message: "Failed to create blog post",
    };
  }
}
