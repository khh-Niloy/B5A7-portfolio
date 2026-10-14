"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteContactMessage(id: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/contact/${id}`, {
      method: "DELETE",
      headers: {
        Cookie: `accessToken=${token || ""}`,
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const data = await res.json();
    if (data.success) {
      revalidatePath("/dashboard/contact");
    }
    return data;
  } catch (error) {
    console.error("Failed to delete contact message:", error);
    return { success: false, message: "Failed to delete message" };
  }
}
