"use client";

import React, { useState, useEffect } from "react";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function CopyMail({ email }: { email: string }) {
  const [clickCopy, setClickCopy] = useState(false);
  const [confettiAnimation, setConfettiAnimation] = useState(null);

  useEffect(() => {
    fetch("/confetti.json")
      .then((response) => response.json())
      .then((data) => setConfettiAnimation(data))
      .catch((error) => console.error("Error loading confetti animation:", error));
  }, []);

  function handleCopy() {
    setClickCopy(true);

    if (typeof navigator !== "undefined") {
      navigator.clipboard
        .writeText(email)
        .then(() =>
          setTimeout(() => {
            setClickCopy(false);
          }, 3000)
        )
        .catch((err) => {
          toast.error("Something went wrong");
          console.log(err);
        });
    }
  }

  return (
    <>
      <div className="absolute top-0 h-full w-full rounded-2xl bg-black/30 z-50"></div>
      <img src="/grid.svg" className="absolute -top-3 -right-26 z-50" alt="" />
      <div className="absolute z-50 inset-0 flex items-center -bottom-10 justify-center h-full text-white font-semibold px-4 text-center ">
        <div className="flex flex-col items-center justify-center">
          <h1 className="">
            Do you want to start <br /> a project together?
          </h1>
          {clickCopy && confettiAnimation && (
            <Lottie
              animationData={confettiAnimation}
              loop={false}
              autoplay={true}
              style={{ width: 300, height: 300 }}
              className="absolute"
            />
          )}
          <button
            onClick={handleCopy}
            className="mt-4 flex items-center gap-2 text-[10px] font-light bg-gradient-to-r from-[#161A31] to-[#06091fb8] px-3 py-2 rounded-md cursor-pointer duration-500 hover:bg-gradient-to-r
                   hover:from-[#22284a]
                   hover:to-[#06091F] hover:duration-300 hover:transition-all hover:scale-[1.02]"
          >
            <Copy strokeWidth={1} size={13} />{" "}
            <span>{clickCopy ? "Copied!" : "Copy my email address"}</span>
          </button>
        </div>
      </div>
    </>
  );
}
