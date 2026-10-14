"use server";

import { revalidatePath } from "next/cache";
import { PortfolioData } from "@/interfaces/interface";

export const updateAbout = async (data: Partial<PortfolioData> | FormData, id?: string) => {
  try {
    const isFormData = data instanceof FormData;
    const url = id && id !== "undefined"
      ? `${process.env.NEXT_PUBLIC_BASE_API}/about/about-content/${id}`
      : `${process.env.NEXT_PUBLIC_BASE_API}/about/about-content`;

    const headers: HeadersInit = {};
    let body: any;

    if (isFormData) {
      body = data;
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(data);
    }

    const res = await fetch(url, {
      method: "PATCH",
      headers,
      body,
    });

    const result = await res.json();
    if (result?.success || result?.data) {
      revalidatePath("/");
      revalidatePath("/dashboard/about");
    }
    return result;
  } catch (error) {
    console.error("Failed to update about data:", error);
    return { success: false, message: "Failed to submit" };
  }
};
