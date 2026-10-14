"use server";

import { revalidatePath } from "next/cache";

export async function deleteProject(projectId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/projects/${projectId}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to delete project",
      };
    }

    revalidatePath("/");
    revalidatePath("/dashboard/projects");

    return {
      success: true,
      message: "Project deleted successfully",
    };
  } catch (error) {
    console.error("Delete project error:", error);
    return {
      success: false,
      message: "Failed to delete project",
    };
  }
}
