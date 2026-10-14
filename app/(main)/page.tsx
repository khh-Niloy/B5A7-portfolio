"use client";

import React, { useState, useEffect, useRef } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SectionTabs } from "@/components/profile/SectionTabs";
import { AboutSection } from "@/components/profile/AboutSection";
import { InfoCards } from "@/components/profile/InfoCards";
import { ExperienceTimeline } from "@/components/profile/ExperienceTimeline";
import { SkillsSection } from "@/components/profile/SkillsSection";
import { ProjectsView } from "@/components/projects/ProjectsView";
import { ContactView } from "@/components/contact/ContactView";
import { ProfileFooter } from "@/components/profile/ProfileFooter";
import { PortfolioProvider } from "@/components/portfolio/PortfolioContext";
import { FolderGit2, Mail } from "lucide-react";

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<string>("profile");
  const [localTime, setLocalTime] = useState<string>("");
  const isManualScrolling = useRef(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Dhaka",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(now);
      setLocalTime(formatted);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id: string) => {
    isManualScrolling.current = true;
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const topOffset = 130;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });
    }
    setTimeout(() => {
      isManualScrolling.current = false;
    }, 850);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isManualScrolling.current) return;

      const sectionIds = [
        "profile",
        "experience",
        "skills",
        "projects",
        "faq",
        "contact",
      ];
      const scrollY = window.pageYOffset;
      const topOffset = 180;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop - topOffset;
          if (scrollY >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <PortfolioProvider>
      <AppShell activeSection={activeSection} onSelectSection={scrollToSection}>
        <div className="flex flex-col">
          {/* Profile Header (Banner, Avatar, Identity, Tech Chips) */}
          <ProfileHeader dhakaTime={localTime} />

          {/* Tab-based navigation bar in the middle */}
          <SectionTabs
            activeSection={activeSection}
            onSelectSection={scrollToSection}
          />

          {/* 1. About / Profile Section */}
          <div id="profile" className="scroll-mt-32">
            <AboutSection />
            <InfoCards />
          </div>

          {/* 2. Experience Section */}
          <ExperienceTimeline />

          {/* 3. Skills Section */}
          <SkillsSection />

          {/* 4. Projects Section */}
          <div id="projects" className="mt-14 scroll-mt-32">
            <div className="flex items-center gap-2.5 mb-6">
              <FolderGit2 className="h-6 w-6 text-emerald-400" />
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Featured Projects
              </h2>
            </div>
            <ProjectsView />
          </div>

          {/* 5. Contact Section */}
          <div id="contact" className="mt-14 scroll-mt-32">
            <div className="flex items-center gap-2.5 mb-6">
              <Mail className="h-6 w-6 text-emerald-400" />
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Get In Touch
              </h2>
            </div>
            <ContactView />
          </div>

          {/* Footer */}
          <ProfileFooter />
        </div>
      </AppShell>
    </PortfolioProvider>
  );
}
