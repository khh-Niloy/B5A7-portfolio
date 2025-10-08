import React from "react";
import CopyMail from "./CopyEmail";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";


export default function SocialLinks({ content }: { content: Record<string, unknown> }) {
  const { socialLinks, email } = content;

  const icons = {
    github: <FaGithub className="text-2xl" />,
    linkedin: <FaLinkedin className="text-2xl" />,
    facebook: <FaFacebook className="text-2xl" />,
    whatsapp: <FaWhatsapp className="text-2xl" />,
  };

  return (
    <div className="flex gap-2">
      <div className="w-[50%] my-auto">
        <h1 className="text-2xl font-semibold text-white">
          Let&apos;s Connect <span className="text-3xl">🤝</span>
        </h1>
        <div className="flex gap-3 mt-3">
          {(socialLinks as Record<string, unknown>[]).map((e, index) => (
            <div key={index}>
              <a
                href={e.link as string}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-emerald-400 transition-colors duration-200"
              >
                {icons[e.name as keyof typeof icons]}
              </a>
            </div>
          ))}
        </div>
      </div>

      <div
        className="w-[50%] my-auto relative bg-[url(/bg.png)]
      relative text-white overflow-hidden rounded-2xl border border-[#3637499d] lg:h-full
      h-36"
      >
        <CopyMail email={email as string} />
      </div>

      {/* <img
        src={"/network.png"}
        className="absolute bottom-0 w-full rounded-2xl opacity-50"
        alt=""
      /> */}
    </div>
  );
}