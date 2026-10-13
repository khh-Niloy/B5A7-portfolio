"use client";

import React, { useEffect, useRef } from "react";

export function EqualizerBanner() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 720);
    let height = (canvas.height = 215);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 215;
    };

    window.addEventListener("resize", handleResize);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Grid configuration
    const cols = 48;
    const rows = 12;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Dark background with subtle central radial glow
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height * 0.4,
        20,
        width / 2,
        height * 0.5,
        width * 0.6
      );
      bgGrad.addColorStop(0, "rgba(16, 185, 129, 0.18)");
      bgGrad.addColorStop(0.5, "rgba(5, 150, 105, 0.08)");
      bgGrad.addColorStop(1, "rgba(13, 13, 13, 0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const colWidth = width / cols;
      const rowHeight = height / rows;
      const barW = Math.max(3, colWidth * 0.55);
      const barH = Math.max(5, rowHeight * 0.65);

      for (let c = 0; c < cols; c++) {
        // Distance from center factor (0 at center, 1 at edges)
        const centerDist = Math.abs(c - cols / 2) / (cols / 2);
        const centerFalloff = Math.max(0, 1 - Math.pow(centerDist, 1.4));

        for (let r = 0; r < rows; r++) {
          const vertDist = r / rows;
          // Wave equation
          const wave = Math.sin(c * 0.25 + time * 0.04) * Math.cos(r * 0.35 + time * 0.03);
          const secondaryWave = Math.sin((c + r) * 0.18 + time * 0.02);

          let intensity = (wave * 0.4 + secondaryWave * 0.3 + 0.3) * centerFalloff;
          intensity = Math.max(0.04, Math.min(0.95, intensity));

          // Color calculation
          const alpha = intensity * (1 - vertDist * 0.4);
          const x = c * colWidth + (colWidth - barW) / 2;
          const y = r * rowHeight + (rowHeight - barH) / 2;

          ctx.fillStyle = `rgba(16, 185, 129, ${alpha * 0.85})`;
          ctx.beginPath();
          ctx.roundRect(x, y, barW, barH, 2);
          ctx.fill();

          // Subtle extra glow for bright center bars
          if (intensity > 0.6 && centerDist < 0.3) {
            ctx.shadowColor = "rgba(52, 211, 153, 0.6)";
            ctx.shadowBlur = 8;
            ctx.fillStyle = `rgba(52, 211, 153, ${alpha})`;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      if (!prefersReducedMotion) {
        time += 0.8;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-[215px] overflow-hidden rounded-none border-b border-white/5 bg-[#0e0e0e]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
      {/* Top subtle vignette overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#0d0d0d]/80" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#0d0d0d]/40 via-transparent to-[#0d0d0d]/40" />
    </div>
  );
}
