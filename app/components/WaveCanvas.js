"use client";
import { useEffect, useRef, useCallback } from "react";

const GRID = 10;
const BG_R = 28, BG_G = 38, BG_B = 52;
const FPS = 20;
const MAX_RIPPLES = 6;

export default function WaveCanvas() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const lastMouse = useRef({ x: -9999, y: -9999 });
  const ripples = useRef([]);
  const animRef = useRef(null);
  const dimsRef = useRef({ cols: 0, rows: 0 });

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = Math.ceil(window.innerWidth / GRID);
    const h = Math.ceil(window.innerHeight / GRID);
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    dimsRef.current = { cols: w, rows: h };
  }, []);

  useEffect(() => {
    init();
    window.addEventListener("resize", init);
    return () => window.removeEventListener("resize", init);
  }, [init]);

  useEffect(() => {
    const handlePointer = (e) => {
      const t = e.touches ? e.touches[0] : e;
      const nx = t.clientX;
      const ny = t.clientY;
      const dx = nx - lastMouse.current.x;
      const dy = ny - lastMouse.current.y;
      if (Math.sqrt(dx * dx + dy * dy) > 25) {
        ripples.current.push({
          x: nx / GRID, y: ny / GRID,
          birth: performance.now(),
          strength: Math.min(Math.sqrt(dx * dx + dy * dy) / 60, 1.2),
        });
        if (ripples.current.length > MAX_RIPPLES) ripples.current.shift();
        lastMouse.current = { x: nx, y: ny };
      }
      mouse.current = { x: nx, y: ny };
    };
    window.addEventListener("mousemove", handlePointer);
    window.addEventListener("touchmove", handlePointer);
    window.addEventListener("touchstart", handlePointer);
    return () => {
      window.removeEventListener("mousemove", handlePointer);
      window.removeEventListener("touchmove", handlePointer);
      window.removeEventListener("touchstart", handlePointer);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let t = 0;
    let lastFrame = 0;
    const frameInterval = 1000 / FPS;

    const render = (now) => {
      animRef.current = requestAnimationFrame(render);
      if (now - lastFrame < frameInterval) return;
      lastFrame = now;
      t++;

      const { cols, rows } = dimsRef.current;
      const mx = mouse.current.x / GRID;
      const my = mouse.current.y / GRID;
      ripples.current = ripples.current.filter((r) => now - r.birth < 3500);

      const imageData = ctx.createImageData(cols, rows);
      const data = imageData.data;

      for (let r = 0; r < rows; r++) {
        const distanceFade = 0.3 + (r / rows) * 0.7;
        for (let c = 0; c < cols; c++) {
          const d1 = c * 0.7 + r * 0.7;
          const d2 = c * 0.5 - r * 0.5;

          const swell = Math.sin(d1 * 0.35 - t * 0.03 + Math.sin(d2 * 0.02 + t * 0.006) * 1.2);
          const swell2 = Math.sin(d1 * 0.18 + d2 * 0.08 - t * 0.022) * 0.45;
          const swell3 = Math.sin(d2 * 0.28 + d1 * 0.05 - t * 0.035) * 0.2;
          const chop = Math.sin(d1 * 0.7 + d2 * 0.3 - t * 0.05) * 0.12;
          const detail = Math.sin(c * 0.6 + r * 0.4 + t * 0.04) * 0.06;

          const combined = swell + swell2 + swell3;
          const crest = combined > 0.6 ? (combined - 0.6) * 2.2 : 0;
          const trough = combined < -0.5 ? (combined + 0.5) * 0.3 : 0;
          const glint = (swell > 0.7 && Math.sin(d1 * 1.5 + t * 0.08) > 0.7) ? 0.35 : 0;

          let sea = (combined * 0.18) + chop + detail + crest + trough + glint;
          sea *= distanceFade;

          const cdx = mx - c;
          const cdy = my - r;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cdist < 8) sea += (1 - cdist / 8) * (1 - cdist / 8) * 0.2;

          for (let ri = 0; ri < ripples.current.length; ri++) {
            const rip = ripples.current[ri];
            const age = (now - rip.birth) / 1000;
            const rdx = c - rip.x;
            const rdy = r - rip.y;
            const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
            const ringRadius = age * 20;
            const ringWidth = 3 + age * 6;
            const distFromRing = Math.abs(rdist - ringRadius);
            if (distFromRing < ringWidth) {
              const ringNorm = 1 - distFromRing / ringWidth;
              const decay = Math.max(0, 1 - age * 0.4);
              sea += Math.sin(rdist * 1.2 - age * 14) * ringNorm * decay * rip.strength * 0.6;
            }
          }

          const lum = 0.5 + sea * 0.55;
          const idx = (r * cols + c) * 4;
          data[idx] = Math.max(0, Math.min(255, (BG_R * lum) | 0));
          data[idx + 1] = Math.max(0, Math.min(255, (BG_G * lum) | 0));
          data[idx + 2] = Math.max(0, Math.min(255, (BG_B * lum) | 0));
          data[idx + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };

    animRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0, zIndex: 0,
        pointerEvents: "none", imageRendering: "pixelated",
      }}
    />
  );
}
