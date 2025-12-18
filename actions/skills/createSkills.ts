"use server";

import { revalidatePath, revalidateTag } from "next/cache";

interface SkillData {
  category: string;
  skills: string[];
}

export const createSkills = async (data: SkillData[]) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/skills/skills/add-skills-to-category`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const responseText = await res.text();

    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      console.error("Failed to parse response as JSON");
      return {
        error: "Invalid response from server",
        status: res.status,
        responsePreview: responseText.substring(0, 200),
      };
    }


    if (result?.success) {
      revalidateTag("skills", "max");
      revalidatePath("/");
    }

    return result;
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    
    console.error("Failed to create skills - Error details:", error);
    return { error: "Failed to create skills", details: String(error) };
  }
};
