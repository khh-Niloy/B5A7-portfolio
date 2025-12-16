import { redirect } from "next/navigation";

const login = async (data: { email: string; password: string }) => {
  try {
    // console.log(data);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    const result = await res.json();
    // console.log(result);
    
    if (!res.ok) {
      return {
        error: result.message || "Login failed",
      };
    }
    
    if (result.success || result.data) {
      redirect("/dashboard");
    }
    
    return result;
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error;
    }
    
    console.error("Failed to login:", error);
    return { error: "Failed to login" };
  }
};

export default login;
