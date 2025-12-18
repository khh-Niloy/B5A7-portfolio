"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export const createProject = async (formData: FormData) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/projects`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || `HTTP ${res.status}: ${res.statusText}`,
        status: res.status,
      };
    }

    const result = await res.json();

    if (result?.success) {
      revalidateTag("projects", "max");
      revalidatePath("/");
    }

    return {
      success: true,
      data: result.data,
      message: "Project created successfully",
    };
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    
    console.error("Failed to create project - Error details:", error);
    
    // Network errors
    if (error instanceof Error && error.message.includes("fetch")) {
      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
      };
    }
    
    return {
      success: false,
      message: "Failed to create project. Please try again later.",
    };
  }
};
