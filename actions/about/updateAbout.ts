"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
  Contact,
  UniversityInfo,
  AboutInfo,
  Journey,
} from "@/interfaces/interface";

interface AboutData {
  contacts?: Contact[];
  universityInfo?: Partial<UniversityInfo>;
  aboutInfo?: Partial<AboutInfo>;
  journey?: Journey[];
}

export const updateAbout = async (data: AboutData, id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/about/about-content/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await res.json();

    if (result?.id) {
      revalidateTag("about");
      revalidatePath("/");
      redirect("/");
    }
    return result;
  } catch (error) {
    console.error("Failed to submit:", error);
    return { error: "Failed to submit" };
  }
};
