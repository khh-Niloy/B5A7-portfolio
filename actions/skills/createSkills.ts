"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

interface SkillData {
  category: string;
  skills: string[];
}

export const createSkills = async (data: SkillData[]) => {
  try {
    console.log("Creating skills:", data);
    console.log(
      "API URL:",
      `${process.env.NEXT_PUBLIC_BASE_API}/skills/skills/add-skills-to-category`
    );

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

    console.log("Response status:", res.status);
    console.log("Response ok:", res.ok);
    console.log("Response content-type:", res.headers.get("content-type"));

    // Get the response as text first to check what we're getting
    const responseText = await res.text();
    console.log(
      "Response text (first 500 chars):",
      responseText.substring(0, 500)
    );

    // Try to parse as JSON
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse response as JSON");
      return {
        error: "Invalid response from server",
        status: res.status,
        responsePreview: responseText.substring(0, 200),
      };
    }

    console.log("Parsed result:", result);

    if (result?.success) {
      revalidateTag("SKILLS");
      revalidatePath("/");
    }

    return result;
  } catch (error) {
    // Check if it's a redirect (expected behavior)
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error; // Re-throw to allow redirect to happen
    }
    
    console.error("Failed to create skills - Error details:", error);
    return { error: "Failed to create skills", details: String(error) };
  }
};
