"use client";

import React, { useState, useRef } from "react";
import {
  Clock,
  ArrowUpRight,
  Rocket,
  Send,
} from "lucide-react";
import { FaGithub, FaLinkedin, FaWhatsapp, FaFacebook, FaTwitter, FaGlobe } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import toast from "react-hot-toast";
import { playUiClick } from "@/lib/sound";
import { usePortfolio } from "@/components/portfolio/PortfolioContext";

const SOCIAL_ICONS: Record<string, { icon: any; color: string }> = {
  email: { icon: SiGmail, color: "#EA4335" },
  gmail: { icon: SiGmail, color: "#EA4335" },
  whatsapp: { icon: FaWhatsapp, color: "#25D366" },
  linkedin: { icon: FaLinkedin, color: "#0A66C2" },
  github: { icon: FaGithub, color: "#FFFFFF" },
  facebook: { icon: FaFacebook, color: "#1877F2" },
  twitter: { icon: FaTwitter, color: "#1DA1F2" },
};

export function ContactView() {
  const { data } = usePortfolio();
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    setSending(true);
    playUiClick();

    try {
      const baseApi =
        process.env.NEXT_PUBLIC_BASE_API || "http://localhost:8000/api/v1";
      const res = await fetch(`${baseApi}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.message || "Failed to send message");
      }

      toast.success("Your message has been sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Email send failed:", error);
      toast.error(
        (error as Error).message ||
          "Failed to send message. Please email directly."
      );
    } finally {
      setSending(false);
    }
  };

  const directContacts =
    data?.socialLinks && data.socialLinks.length > 0
      ? data.socialLinks.map((s) => {
          const key = s.name.toLowerCase().trim();
          const match = SOCIAL_ICONS[key] || { icon: FaGlobe, color: "#10b981" };
          return {
            title: s.name,
            handle: s.handle || s.link,
            href: s.link,
            icon: match.icon,
            iconColor: match.color,
          };
        })
      : [
          {
            title: "Email me",
            handle: "khhniloy0@gmail.com",
            href: "mailto:khhniloy0@gmail.com",
            icon: SiGmail,
            iconColor: "#EA4335",
          },
          {
            title: "WhatsApp",
            handle: "+880 1915-910291",
            href: "https://wa.me/8801915910291",
            icon: FaWhatsapp,
            iconColor: "#25D366",
          },
          {
            title: "LinkedIn Message",
            handle: "/in/hasibhossain-niloy01",
            href: "https://www.linkedin.com/in/hasibhossain-niloy01/",
            icon: FaLinkedin,
            iconColor: "#0A66C2",
          },
          {
            title: "GitHub Discussions",
            handle: "@khh-Niloy",
            href: "https://github.com/khh-Niloy",
            icon: FaGithub,
            iconColor: "#FFFFFF",
          },
        ];

  return (
    <div className="text-left space-y-12">
      {/* 1. Hero Card */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#121c16] via-[#141414] to-[#111111] p-6 sm:p-8 shadow-[0_0_35px_rgba(16,185,129,0.08)]">
        {/* Glow ambient background */}
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Let&apos;s build something together
        </h1>

        <p className="mt-2 text-sm text-zinc-400 max-w-xl leading-relaxed">
          Have an exciting project, an engineering role, or an architecture
          question? Pick whatever method is easiest for you and I&apos;ll get
          back promptly.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{data?.statusText || "Open to new conversations"}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#161616] px-3.5 py-1 text-xs text-zinc-400">
            <Clock className="h-3.5 w-3.5 text-zinc-500" />
            <span>{data?.location || "Dhaka, Bangladesh"}</span>
          </div>
        </div>
      </div>

      {/* 2. Work With Me Section */}
      <div>
        <h2 className="text-sm font-semibold tracking-wide uppercase text-zinc-400 mb-4">
          Work with me
        </h2>

        {/* Featured Wide Card */}
        <div className="rounded-2xl border border-white/5 bg-[#141414] p-5 sm:p-6 transition-all hover:border-emerald-500/30">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Rocket className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white">
                End-to-End Product Engineering
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Taking features from concept to production with clean
                architecture: database schemas, resilient APIs, real-time
                WebSockets, agentic AI reasoning, and high-fidelity frontends.
              </p>
              <a
                href="#message-form"
                onClick={playUiClick}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-black hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <span>Let&apos;s talk</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Reach Me Direct Links */}
      <div>
        <h2 className="text-sm font-semibold tracking-wide uppercase text-zinc-400 mb-4">
          Reach me
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {directContacts.map((c) => {
            const Icon = c.icon;
            return (
              <a
                key={c.title}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playUiClick}
                className="group flex items-center justify-between rounded-xl border border-white/5 bg-[#141414] p-3.5 hover:border-emerald-500/30 hover:bg-[#171717] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 group-hover:bg-emerald-500/10 transition-colors">
                    <Icon className="h-4 w-4" style={{ color: c.iconColor }} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      {c.title}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {c.handle}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-400" />
              </a>
            );
          })}
        </div>
      </div>

      {/* 4. Active Contact Form */}
      <div id="message-form" className="pt-6 border-t border-white/5">
        <h2 className="text-sm font-semibold tracking-wide uppercase text-zinc-400 mb-4">
          Send a direct message
        </h2>

        <form
          ref={formRef}
          onSubmit={handleSendEmail}
          className="rounded-2xl border border-white/10 bg-[#141414] p-5 sm:p-7 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Your Name
              </label>
              <input
                name="name"
                required
                type="text"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:bg-[#202020] focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Email Address
              </label>
              <input
                name="email"
                required
                type="email"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:bg-[#202020] focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Message
            </label>
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Tell me about your product, project, or opportunity..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] p-3.5 text-xs text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:bg-[#202020] focus:outline-none transition-all resize-none"
            />
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-2.5 text-xs font-semibold text-black hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
            >
              <span>{sending ? "Sending..." : "Send Message"}</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
