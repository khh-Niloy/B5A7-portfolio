"use server";

import { cookies } from "next/headers";
import { VisitorLogsResponse } from "@/interfaces/interface";

export interface GetVisitorLogsParams {
  page?: number;
  limit?: number;
  country?: string;
  deviceType?: string;
  isBot?: string; // "true" | "false" | "all"
  searchTerm?: string;
}

export async function getVisitorLogs(
  params: GetVisitorLogsParams = {}
): Promise<VisitorLogsResponse | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const query = new URLSearchParams();
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.country && params.country !== "all") query.set("country", params.country);
    if (params.deviceType && params.deviceType !== "all") query.set("deviceType", params.deviceType);
    if (params.isBot && params.isBot !== "all") query.set("isBot", params.isBot);
    if (params.searchTerm) query.set("searchTerm", params.searchTerm);

    const queryString = query.toString();
    const baseApi = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:8000/api/v1";
    const url = `${baseApi}/visitors/logs${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await fetch(url, {
      headers: {
        Cookie: `accessToken=${token || ""}`,
        Authorization: token ? `Bearer ${token}` : "",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch visitor logs:", res.status, res.statusText);
      return null;
    }

    const json = await res.json();
    return {
      meta: json.meta || { page: 1, limit: 20, total: 0, totalPages: 1 },
      data: json.data || [],
    };
  } catch (error) {
    console.error("Error in getVisitorLogs action:", error);
    return null;
  }
}
