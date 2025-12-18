"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import {
  Contact,
  UniversityInfo,
  AboutInfo,
  Journey,
} from "@/interfaces/interface";

interface AboutData {
  contacts: Contact[];
  universityInfo: UniversityInfo;
  aboutInfo: AboutInfo;
  journey: Journey[];
}

export const createAbout = async (data: AboutData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/about/about-content`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || `HTTP ${res.status}: ${res.statusText}`,
        status: res.status,
      };
    }

    const result = await res.json();

    if (result?.id) {
      revalidateTag("about", "max");
      revalidatePath("/");
      return {
        success: true,
        id: result.id,
        message: "About information created successfully",
      };
    }
    
    return {
      success: false,
      message: "Failed to create about information",
    };
  } catch (error) {
    console.error("Failed to submit:", error);
    
    // Network errors
    if (error instanceof Error && error.message.includes("fetch")) {
      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
      };
    }
    
    return {
      success: false,
      message: "Failed to create about information. Please try again later.",
    };
  }
};
