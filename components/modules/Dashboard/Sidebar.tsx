"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconHome,
  IconUser,
  IconFileText,
  IconBriefcase,
  IconBulb,
  IconCode,
  IconArticle,
  IconSparkles,
  IconHelp,
  IconBrandFacebook,
  IconMail,
  IconWorld,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SidebarDemo({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Live Portfolio",
      href: "/",
      icon: (
        <IconHome
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            pathname === "/" ? "text-emerald-400" : "text-gray-400"
          )}
        />
      ),
    },
    {
      label: "Hero & Profile",
      href: "/dashboard",
      icon: (
        <IconUser
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            pathname === "/dashboard" ? "text-emerald-400" : "text-gray-400"
          )}
        />
      ),
    },
    {
      label: "About & Academics",
      href: "/dashboard/about",
      icon: (
        <IconFileText
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            pathname === "/dashboard/about" ? "text-emerald-400" : "text-gray-400"
          )}
        />
      ),
    },
    {
      label: "Experience",
      href: "/dashboard/experience",
      icon: (
        <IconBriefcase
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            pathname === "/dashboard/experience" ? "text-emerald-400" : "text-gray-400"
          )}
        />
      ),
    },
    {
      label: "Skills & Tech",
      href: "/dashboard/skills",
      icon: (
        <IconBulb
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            pathname === "/dashboard/skills" ? "text-emerald-400" : "text-gray-400"
          )}
        />
      ),
    },
    {
      label: "Projects",
      href: "/dashboard/projects",
      icon: (
        <IconCode
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            pathname === "/dashboard/projects" ? "text-emerald-400" : "text-gray-400"
          )}
        />
      ),
    },
    {
      label: "Blog Posts",
      href: "/dashboard/blog",
      icon: (
        <IconArticle
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            pathname === "/dashboard/blog" ? "text-emerald-400" : "text-gray-400"
          )}
        />
      ),
    },
    {
      label: "Highlights & Services",
      href: "/dashboard/highlights",
      icon: (
        <IconSparkles
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            pathname === "/dashboard/highlights" ? "text-emerald-400" : "text-gray-400"
          )}
        />
      ),
    },
    {
      label: "FAQs",
      href: "/dashboard/faqs",
      icon: (
        <IconHelp
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            pathname === "/dashboard/faqs" ? "text-emerald-400" : "text-gray-400"
          )}
        />
      ),
    },
    {
      label: "Footer & Socials",
      href: "/dashboard/footer",
      icon: (
        <IconBrandFacebook
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            pathname === "/dashboard/footer" ? "text-emerald-400" : "text-gray-400"
          )}
        />
      ),
    },
    {
      label: "Inquiries & Inbox",
      href: "/dashboard/contact",
      icon: (
        <IconMail
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            pathname === "/dashboard/contact" ? "text-emerald-400" : "text-gray-400"
          )}
        />
      ),
    },
    {
      label: "SEO Metadata",
      href: "/dashboard/seo",
      icon: (
        <IconWorld
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            pathname === "/dashboard/seo" ? "text-emerald-400" : "text-gray-400"
          )}
        />
      ),
    },
  ];
  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col overflow-hidden md:flex-row",
        "h-screen bg-[#000319]" // Match home page background
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink 
                  key={idx} 
                  link={link} 
                  className={cn(
                    "rounded-lg px-3 py-2 transition-all duration-200",
                      "hover:bg-white/5 border border-transparent hover:border-white/10 text-gray-300 hover:text-white"
                  )}
                />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex h-full w-full flex-1 flex-col bg-[#000319] p-6 md:p-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-white"
      >
        Acet Labs
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-white" />
    </a>
  );
};
