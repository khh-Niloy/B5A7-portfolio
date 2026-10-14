"use server";

import { cookies } from "next/headers";

export async function getContactMessages() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/contact`, {
      headers: {
        Cookie: `accessToken=${token || ""}`,
        Authorization: token ? `Bearer ${token}` : "",
      },
      cache: "no-store",
    });

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to load contact messages:", error);
    return [];
  }
}
