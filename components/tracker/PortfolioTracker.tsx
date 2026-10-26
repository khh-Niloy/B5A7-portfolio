"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Utility to generate a unique random ID (UUID-like)
const generateId = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch {
      // Fallback if randomUUID fails in insecure context
    }
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const BASE_API =
  process.env.NEXT_PUBLIC_BASE_API || "http://localhost:8000/api/v1";

export function PortfolioTracker() {
  const pathname = usePathname();
  const pageStartTimeRef = useRef<number>(Date.now());
  const currentPathnameRef = useRef<string>(pathname);
  const sessionIdRef = useRef<string>("");
  const visitorIdRef = useRef<string>("");

  useEffect(() => {
    // Skip tracking for admin routes, logged-in admin, or excluded client devices
    const isExcluded =
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/login") ||
      (typeof window !== "undefined" &&
        (localStorage.getItem("portfolio_excluded") === "true" ||
          localStorage.getItem("is_admin") === "true"));

    if (isExcluded) {
      if (typeof window !== "undefined" && pathname.startsWith("/dashboard")) {
        localStorage.setItem("portfolio_excluded", "true");
      }
      return;
    }

    // 1. Identify or create persistent Visitor ID
    let visitorId = localStorage.getItem("portfolio_visitor_id");
    let isNewVisitor = false;
    if (!visitorId) {
      visitorId = generateId();
      localStorage.setItem("portfolio_visitor_id", visitorId);
      isNewVisitor = true;
    }
    visitorIdRef.current = visitorId;

    // 2. Identify or create Session ID (resets per browser session)
    let sessionId = sessionStorage.getItem("portfolio_session_id");
    let visitCount = parseInt(
      localStorage.getItem("portfolio_visit_count") || "0",
      10
    );

    if (!sessionId) {
      sessionId = generateId();
      sessionStorage.setItem("portfolio_session_id", sessionId);
      visitCount += 1;
      localStorage.setItem("portfolio_visit_count", visitCount.toString());
    }
    sessionIdRef.current = sessionId;

    // Helper to send duration
    const sendDuration = (durationSec: number, path: string) => {
      if (
        durationSec < 1 ||
        !sessionIdRef.current ||
        (typeof window !== "undefined" &&
          localStorage.getItem("portfolio_excluded") === "true")
      ) {
        return;
      }

      const durationPayload = JSON.stringify({
        visitorId: visitorIdRef.current,
        sessionId: sessionIdRef.current,
        durationSeconds: durationSec,
        pathname: path,
      });

      const url = `${BASE_API}/visitors/duration`;

      // Priority 1: sendBeacon (guaranteed delivery even on tab close)
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        try {
          const blob = new Blob([durationPayload], {
            type: "application/json",
          });
          const sent = navigator.sendBeacon(url, blob);
          if (sent) return;
        } catch {
          // Fall through to fetch
        }
      }

      // Priority 2: fetch with keepalive: true
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: durationPayload,
        keepalive: true,
        credentials: "include",
      }).catch(() => {});
    };

    // 3. Collect comprehensive client device & environment metrics
    const collectAndTrack = async () => {
      try {
        const nav = typeof navigator !== "undefined" ? navigator : null;
        const scr = typeof window !== "undefined" ? window.screen : null;

        // Parse UTM parameters from query string
        const searchParams = new URLSearchParams(window.location.search);
        const utmSource = searchParams.get("utm_source") || undefined;
        const utmMedium = searchParams.get("utm_medium") || undefined;
        const utmCampaign = searchParams.get("utm_campaign") || undefined;
        const utmTerm = searchParams.get("utm_term") || undefined;
        const utmContent = searchParams.get("utm_content") || undefined;

        // Connection information if available
        const conn =
          (nav as any)?.connection ||
          (nav as any)?.mozConnection ||
          (nav as any)?.webkitConnection;
        const connectionType = conn?.effectiveType || conn?.type || undefined;

        // Preferred languages
        const languages = nav?.languages
          ? Array.from(nav.languages)
          : nav?.language
          ? [nav.language]
          : [];

        // Client timezone
        let clientTimezone = "UTC";
        try {
          clientTimezone =
            Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
        } catch {}

        const payload = {
          visitorId,
          sessionId,
          isNewVisitor,
          visitCount,

          url: window.location.href,
          pathname: window.location.pathname,
          pageTitle: document.title || "Portfolio",
          referrer: document.referrer || "Direct",

          screenWidth: scr?.width,
          screenHeight: scr?.height,
          screenResolution: scr ? `${scr.width}x${scr.height}` : undefined,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          viewportSize: `${window.innerWidth}x${window.innerHeight}`,
          devicePixelRatio: window.devicePixelRatio || 1,
          colorDepth: scr?.colorDepth,
          orientation:
            scr?.orientation?.type ||
            (window.innerHeight > window.innerWidth
              ? "portrait"
              : "landscape"),

          touchSupport:
            "ontouchstart" in window || (nav?.maxTouchPoints || 0) > 0,
          maxTouchPoints: nav?.maxTouchPoints || 0,
          hardwareConcurrency: nav?.hardwareConcurrency,
          deviceMemory: (nav as any)?.deviceMemory,

          language: nav?.language || "Unknown",
          languages,
          clientTimezone,
          clientTimezoneOffset: new Date().getTimezoneOffset(),
          clientLocalTime: new Date().toLocaleString(),
          connectionType,

          utmSource,
          utmMedium,
          utmCampaign,
          utmTerm,
          utmContent,
        };

        const res = await fetch(`${BASE_API}/visitors/track`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        });

        const resData = await res.json().catch(() => null);
        if (resData?.excluded) {
          localStorage.setItem("portfolio_excluded", "true");
        }
      } catch (err) {
        // Tracker runs silently without throwing
      }
    };

    // Execute tracking for current page view
    collectAndTrack();
    pageStartTimeRef.current = Date.now();
    currentPathnameRef.current = pathname;

    // Periodic heartbeat to track active time on page (every 25 seconds)
    const heartbeatInterval = setInterval(() => {
      const elapsedSec = Math.round(
        (Date.now() - pageStartTimeRef.current) / 1000
      );
      sendDuration(elapsedSec, currentPathnameRef.current);
    }, 25000);

    // Event listener for tab visibility change (e.g. user switches tabs or minimizes)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        const elapsedSec = Math.round(
          (Date.now() - pageStartTimeRef.current) / 1000
        );
        sendDuration(elapsedSec, currentPathnameRef.current);
      }
    };

    // Event listener for page unload / close
    const handleBeforeUnload = () => {
      const elapsedSec = Math.round(
        (Date.now() - pageStartTimeRef.current) / 1000
      );
      sendDuration(elapsedSec, currentPathnameRef.current);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handleBeforeUnload);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(heartbeatInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handleBeforeUnload);
      window.removeEventListener("beforeunload", handleBeforeUnload);

      // Send final duration for this route before navigating to next
      const elapsedSec = Math.round(
        (Date.now() - pageStartTimeRef.current) / 1000
      );
      sendDuration(elapsedSec, currentPathnameRef.current);
    };
  }, [pathname]);

  return null;
}
