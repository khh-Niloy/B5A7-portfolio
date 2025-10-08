import { redirect } from "next/navigation";

const login = async (data: any) => {
  try {
    console.log(data);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include", // This is important for cookies!
    });
    const result = await res.json();
    console.log(result);
    
    if (!res.ok) {
      return {
        error: result.message || "Login failed",
      };
    }
    
    // Only redirect on successful login
    if (result.success || result.data) {
      redirect("/dashboard");
    }
    
    return result;
  } catch (error) {
    // Check if it's a redirect error (which is expected)
    if (error && typeof error === 'object' && 'digest' in error) {
      // This is a Next.js redirect, let it through
      throw error;
    }
    
    console.error("Failed to login:", error);
    return { error: "Failed to login" };
  }
};

export default login;
