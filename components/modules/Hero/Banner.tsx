"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function Banner() {
  const [isDesktopLoaded, setIsDesktopLoaded] = useState(false);
  const [isMobileLoaded, setIsMobileLoaded] = useState(false);

  return (
    <>
      <div className="w-full text-center mx-auto relative">
        <div className="relative hidden min-[426px]:block">
          <Image
            src="/hero.svg"
            width={1920}
            height={1080}
            alt="Hero Banner"
            className={`w-screen transition-opacity duration-500 ${
              isDesktopLoaded ? "opacity-100" : "opacity-0"
            }`}
            priority
            quality={90}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4="
            onLoad={() => setIsDesktopLoaded(true)}
          />
          {!isDesktopLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />
          )}
        </div>

        <div className="relative block min-[426px]:hidden">
          <Image
            src="/mob.svg"
            width={425}
            height={300}
            alt="Mobile Hero Banner"
            className={`w-screen transition-opacity duration-500 ${
              isMobileLoaded ? "opacity-100" : "opacity-0"
            }`}
            priority
            quality={90}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDI1IiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQyNSAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQyNSIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4="
            onLoad={() => setIsMobileLoaded(true)}
          />
          {!isMobileLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />
          )}
        </div>
      </div>
    </>
  );
}
