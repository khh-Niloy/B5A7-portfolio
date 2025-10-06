"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

interface ProjectData {
  projectName: string;
  shortDes: string;
  techStacks: string[];
  liveSite: string;
}

export const createProject = async (formData: FormData) => {
  try {
    console.log("Creating project with FormData");
    console.log("FormData", formData);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/projects`, {
      method: "POST",
      body: formData,
    });

    console.log("Response status:", res.status);
    console.log("Response ok:", res.ok);

    const responseText = await res.text();
    console.log("Response text:", responseText.substring(0, 500));

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
      revalidateTag("PROJECTS");
      revalidatePath("/");
    }

    return result;
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error("Failed to create project - Error details:", error);
    return { error: "Failed to create project", details: String(error) };
  }
};
