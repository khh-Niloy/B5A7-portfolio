"use client";

import React, { Suspense } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { ProjectsView } from "@/components/projects/ProjectsView";
import { ProfileFooter } from "@/components/profile/ProfileFooter";

export default function ProjectsPage() {
  return (
    <AppShell pageTitle="Projects">
      <div className="flex flex-col">
        <Suspense fallback={null}>
          <ProjectsView />
        </Suspense>
        <ProfileFooter />
      </div>
    </AppShell>
  );
}
