import Image from "next/image";
import React from "react";

export default function Banner() {
  return (
    <>
      <div className="w-full text-center mx-auto relative">
        <picture>
          <source media="(min-width: 426px)" srcSet="/hero.svg" />
          <source media="(max-width: 425px)" srcSet="/mob.svg" />
          <Image
            src="/hero.svg"
            alt="Hero Banner"
            className="w-screen"
            width={1920}
            height={1080}
            loading="eager"
            fetchPriority="high"
          />
        </picture>
      </div>
    </>
  );
}
