import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Hasib Hossain Niloy — Software Engineer & Full-Stack Builder",
  description:
    "Portfolio of Hasib Hossain Niloy. Software Engineer at Lint Technologies building robust web applications, scalable backend systems, and AI-powered products.",
  keywords: [
    "Hasib Hossain Niloy",
    "Niloy",
    "Software Engineer",
    "Full Stack Developer",
    "Next.js",
    "TypeScript",
    "NestJS",
    "Gemini AI",
    "Bangladesh",
  ],
  authors: [{ name: "Hasib Hossain Niloy", url: "https://github.com/khh-Niloy" }],
  openGraph: {
    title: "Hasib Hossain Niloy — Software Engineer",
    description: "Code with a long-term mindset, generate unique and creative ideas.",
    url: "https://b5a7-portfolio.vercel.app",
    siteName: "Niloy Portfolio",
    images: [
      {
        url: "https://avatars.githubusercontent.com/u/174131986?v=4",
        width: 400,
        height: 400,
        alt: "Hasib Hossain Niloy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased selection:bg-emerald-500/20 selection:text-emerald-300`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#161616",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "14px",
                fontSize: "13px",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#000",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
