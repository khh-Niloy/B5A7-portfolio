"use client";

import React, { useEffect, useState } from "react";
import { Sun, Sunset, Moon, Sunrise } from "lucide-react";

export function LiveClock() {
  const [timeStr, setTimeStr] = useState<string>("");
  const [period, setPeriod] = useState<string>("Afternoon in Dhaka");
  const [IconComponent, setIconComponent] = useState<React.ElementType>(() => Sun);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format time in Dhaka (Asia/Dhaka)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Dhaka",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      const formatted = new Intl.DateTimeFormat("en-US", options).format(now);
      setTimeStr(formatted);

      // Determine hour in Dhaka for period and icon
      const dhakaHourStr = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Dhaka",
        hour: "numeric",
        hour12: false,
      }).format(now);
      const dhakaHour = parseInt(dhakaHourStr, 10);

      if (dhakaHour >= 5 && dhakaHour < 12) {
        setPeriod("Morning in Dhaka");
        setIconComponent(() => Sunrise);
      } else if (dhakaHour >= 12 && dhakaHour < 17) {
        setPeriod("Afternoon in Dhaka");
        setIconComponent(() => Sun);
      } else if (dhakaHour >= 17 && dhakaHour < 20) {
        setPeriod("Evening in Dhaka");
        setIconComponent(() => Sunset);
      } else {
        setPeriod("Night in Dhaka");
        setIconComponent(() => Moon);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-white">
          {timeStr || "3:07:00 PM"}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
          GMT+6
        </span>
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
        <IconComponent className="h-3.5 w-3.5 text-amber-400" />
        <span>{period}</span>
      </div>
    </div>
  );
}
