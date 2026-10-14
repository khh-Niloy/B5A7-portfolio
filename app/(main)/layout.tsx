import React from "react";
import type { Metadata } from "next";
import { PortfolioProvider } from "@/components/portfolio/PortfolioContext";
import getAbout from "@/helper/getAbout";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getAbout();
    if (!data) return {};

    const title =
      data.seo?.metaTitle ||
      (data.name ? `${data.name} — ${data.title || "Software Engineer"}` : undefined);
    const description = data.seo?.metaDescription || data.tagline || undefined;
    const keywords = data.seo?.keywords || undefined;
    const ogImage = data.seo?.ogImage || data.avatar;

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        images: ogImage ? [{ url: ogImage }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ogImage ? [ogImage] : undefined,
      },
    };
  } catch (error) {
    console.error("Error generating dynamic metadata:", error);
    return {};
  }
}

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PortfolioProvider>{children}</PortfolioProvider>;
}
