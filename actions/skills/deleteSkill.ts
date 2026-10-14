"use server";

import { revalidatePath } from "next/cache";

export async function deleteSkill(skillId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/skills/${skillId}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to delete skill category",
      };
    }

    revalidatePath("/");
    revalidatePath("/dashboard/skills");

    return {
      success: true,
      message: "Skill category deleted successfully",
    };
  } catch (error) {
    console.error("Delete skill error:", error);
    return {
      success: false,
      message: "Failed to delete skill category",
    };
  }
}
