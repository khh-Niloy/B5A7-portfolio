"use client";

import React, { useState, useEffect } from "react";
import { X, Copy, Check, Share2 } from "lucide-react";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";
import { playUiClick } from "@/lib/sound";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.origin : "https://niloy.dev";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = () => {
    playUiClick();
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = "Check out Niloy's portfolio - Full Stack Developer & AI Engineer";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#161616] p-6 shadow-2xl text-white"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-emerald-400" />
            <h3 id="share-title" className="text-lg font-semibold text-white">
              Share Profile
            </h3>
          </div>
          <button
            onClick={() => {
              playUiClick();
              onClose();
            }}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Profile Card Preview */}
        <div className="my-5 flex items-center gap-4 rounded-xl border border-white/5 bg-[#1f1f1f] p-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-emerald-500/30">
            <Image
              src="https://avatars.githubusercontent.com/u/174131986?v=4"
              alt="Niloy"
              fill
              className="object-cover scale-[1.35] origin-[center_42%]"
              unoptimized
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-semibold text-white truncate">Hasib Hossain Niloy</h4>
              <span className="inline-block h-3.5 w-3.5 text-emerald-400">✓</span>
            </div>
            <p className="text-xs text-zinc-400 truncate">Software Engineer @ Lint Technologies</p>
            <p className="text-[11px] text-zinc-500 truncate mt-0.5">{shareUrl}</p>
          </div>
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0d0d0d] p-1.5 pl-3">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-full bg-transparent text-xs text-zinc-300 outline-none"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-emerald-400 transition-colors shrink-0"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copy
              </>
            )}
          </button>
        </div>

        {/* Social Share Icons */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playUiClick}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-white transition-all"
            aria-label="Share on X"
          >
            <FaXTwitter className="h-4 w-4" />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playUiClick}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-white transition-all"
            aria-label="Share on LinkedIn"
          >
            <FaLinkedin className="h-4 w-4" />
          </a>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playUiClick}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-white transition-all"
            aria-label="Share on WhatsApp"
          >
            <FaWhatsapp className="h-4 w-4" />
          </a>
          <a
            href="https://github.com/khh-Niloy"
            target="_blank"
            rel="noopener noreferrer"
            onClick={playUiClick}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-white transition-all"
            aria-label="Visit GitHub Profile"
          >
            <FaGithub className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
