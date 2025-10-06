import React from "react";
import Image from "next/image";

export default function Banner() {
  return (
    <>
      <div className="w-full text-center mx-auto">
        <Image
          src="/hero.svg"
          width={1920}
          height={1080}
          alt="Hero Banner"
          className="w-screen"
        />
      </div>
    </>
  );
}
