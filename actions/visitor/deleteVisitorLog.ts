"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteVisitorLog(id: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const baseApi = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:8000/api/v1";
    const res = await fetch(`${baseApi}/visitors/logs/${id}`, {
      method: "DELETE",
      headers: {
        Cookie: `accessToken=${token || ""}`,
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const data = await res.json();
    if (data.success) {
      revalidatePath("/dashboard/visitors");
    }
    return data;
  } catch (error) {
    console.error("Failed to delete visitor log:", error);
    return { success: false, message: "Failed to delete visitor log" };
  }
}
