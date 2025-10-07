import React from "react";
import Image from "next/image";

export default function Banner() {
  return (
    <>
      <div className="w-full text-center mx-auto">
        {/* Show hero.svg when screen is ABOVE 425px */}
        <Image
          src="/hero.svg"
          width={1920}
          height={1080}
          alt="Hero Banner"
          className="w-screen hidden min-[426px]:block"
        />
        {/* Show mob.svg when screen is 425px or LESS */}
        <Image
          src="/mob.svg"
          width={425}
          height={300}
          alt="Mobile Hero Banner"
          className="w-screen block min-[426px]:hidden"
        />
      </div>
    </>
  );
}
