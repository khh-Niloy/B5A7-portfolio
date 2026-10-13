"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { User, Wrench, FolderGit2, Briefcase, Mail, BookOpen } from "lucide-react";
import { playUiClick } from "@/lib/sound";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Profile", id: "profile", href: "/#profile", icon: User },
    { label: "Skills", id: "skills", href: "/#skills", icon: Wrench },
    { label: "Projects", id: "projects", href: "/#projects", icon: FolderGit2 },
    { label: "Experience", id: "experience", href: "/#experience", icon: Briefcase },
    { label: "Contact", id: "contact", href: "/#contact", icon: Mail },
    { label: "Blogs", id: "blogs", href: "/blogs", icon: BookOpen },
  ];

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    playUiClick();
    if (pathname === "/" && id !== "blogs") {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        const topOffset = 130;
        const y = el.getBoundingClientRect().top + window.pageYOffset - topOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
      }
    }
  };

  const isLinkActive = (item: { id: string; href: string }) => {
    if (pathname === "/" && item.id === "profile") return true;
    if (pathname === "/" && item.id !== "blogs") return false;
    if (pathname?.startsWith(item.href)) return true;
    return false;
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-white/10 bg-[#0e0e0e]/95 px-2 backdrop-blur-lg"
      aria-label="Mobile bottom navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isLinkActive(item);
        return (
          <a
            key={item.label}
            href={item.href}
            onClick={(e) => handleNavClick(e, item.id)}
            className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 transition-all cursor-pointer ${
              active ? "text-emerald-400 font-semibold" : "text-zinc-400 hover:text-white"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] leading-none">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
