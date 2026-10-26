"use server";

import { cookies } from "next/headers";
import { VisitorStatsResponse } from "@/interfaces/interface";

export async function getVisitorStats(): Promise<VisitorStatsResponse | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const baseApi = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:8000/api/v1";
    const res = await fetch(`${baseApi}/visitors/stats`, {
      headers: {
        Cookie: `accessToken=${token || ""}`,
        Authorization: token ? `Bearer ${token}` : "",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch visitor stats:", res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("Error in getVisitorStats action:", error);
    return null;
  }
}
