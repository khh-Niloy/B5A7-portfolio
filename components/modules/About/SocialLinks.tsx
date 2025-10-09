import React from "react";
import CopyMail from "./CopyEmail";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

export default function SocialLinks({
  content,
}: {
  content: Record<string, unknown>;
}) {
  const { socialLinks, email } = content;
  console.log(socialLinks);

  const icons = {
    github: <FaGithub className="text-2xl" />,
    linkedin: <FaLinkedin className="text-2xl" />,
    facebook: <FaFacebook className="text-2xl" />,
    whatsapp: <FaWhatsapp className="text-2xl" />,
  };

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div className="md:w-[50%] my-auto border border-white/10 rounded-xl p-4">
        <div className="py-3 px-5">
          <h1 className="text-2xl font-semibold">Let's Link Up 🔗</h1>
          <span className="text-xs text-white/90 font-light">
            Drop a message — I'll get back soon.
          </span>
        </div>

        <div className="flex gap-5 mt-2 px-3">
          {(socialLinks as Record<string, unknown>[]).map((e, index) => (
            <div className="flex items-center justify-center flex-col gap-1.5">
              <a href={e.link as string} target="_blank" className="z-50">
                <div
                  className="p-3 bg-gradient-to-r from-[#06091f] to-[#06091F]
                      hover:border hover:border-white/20 hover:duration-300 cursor-pointer rounded-xl
                         hover:to-[#06091F] hover:scale-[1.1] duration-300"
                >
                  {
                    icons[
                      (e.name as string).toLowerCase() as keyof typeof icons
                    ]
                  }
                </div>
              </a>
              <h1 className="text-[10px] font-light text-white/85">
                {e.name as string}
              </h1>
            </div>
          ))}
        </div>
      </div>

      <div
        className="md:w-[50%] my-auto relative bg-[url(/bg.png)]
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
