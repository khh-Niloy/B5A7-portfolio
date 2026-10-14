"use client";

import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaGlobe,
} from "react-icons/fa";
import { Mail } from "lucide-react";
import { playUiClick } from "@/lib/sound";
import { usePortfolio } from "@/components/portfolio/PortfolioContext";

const SOCIAL_ICONS: Record<string, any> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  whatsapp: FaWhatsapp,
  facebook: FaFacebook,
  twitter: FaTwitter,
  email: Mail,
  gmail: Mail,
};

export function ProfileFooter() {
  const { data } = usePortfolio();

  const socials =
    data?.socialLinks && data.socialLinks.length > 0
      ? data.socialLinks.map((s) => {
          const key = s.name.toLowerCase().trim();
          const Icon = SOCIAL_ICONS[key] || FaGlobe;
          return {
            name: s.name,
            href: s.link,
            icon: Icon,
          };
        })
      : [
          { name: "GitHub", href: "https://github.com/khh-Niloy", icon: FaGithub },
          {
            name: "LinkedIn",
            href: "https://www.linkedin.com/in/hasibhossain-niloy01/",
            icon: FaLinkedin,
          },
          { name: "WhatsApp", href: "https://wa.me/8801915910291", icon: FaWhatsapp },
          {
            name: "Facebook",
            href: "https://www.facebook.com/khhniloy.niloy/",
            icon: FaFacebook,
          },
          { name: "Email", href: "mailto:khhniloy0@gmail.com", icon: Mail },
        ];

  const authorName = data?.name || "Hasib Hossain Niloy";

  return (
    <footer className="mt-14 pt-8 border-t border-white/10 text-center">
      <div className="flex items-center justify-center gap-5">
        {socials.map((s) => {
          const Icon = s.icon;
          return (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playUiClick}
              className="text-zinc-500 hover:text-white transition-all hover:scale-110"
              aria-label={s.name}
            >
              <Icon className="h-5 w-5" />
            </a>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-zinc-600">
        Designed &amp; built by {authorName} · {new Date().getFullYear()}
      </p>
    </footer>
  );
}
