"use client";

import React from "react";
import { AppShell } from "@/components/shell/AppShell";
import { ProjectsView } from "@/components/projects/ProjectsView";
import { ProfileFooter } from "@/components/profile/ProfileFooter";

export default function ProjectsPage() {
  return (
    <AppShell pageTitle="Projects">
      <div className="flex flex-col">
        <ProjectsView />
        <ProfileFooter />
      </div>
    </AppShell>
  );
}
