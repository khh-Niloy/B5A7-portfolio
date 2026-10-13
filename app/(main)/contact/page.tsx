"use client";

import React from "react";
import { AppShell } from "@/components/shell/AppShell";
import { ContactView } from "@/components/contact/ContactView";
import { ProfileFooter } from "@/components/profile/ProfileFooter";

export default function ContactPage() {
  return (
    <AppShell pageTitle="Contact">
      <div className="flex flex-col">
        <ContactView />
        <ProfileFooter />
      </div>
    </AppShell>
  );
}
