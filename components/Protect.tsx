"use client";

import React, { useEffect } from "react";
import getMe from "@/helper/getMe";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Protect({ children }: { children: React.ReactNode }) {
  const [me, setMe] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const me = await getMe();
        setMe(me);

        if (!me) {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!me) {
    return null;
  }

  return <div>{children}</div>;
}
