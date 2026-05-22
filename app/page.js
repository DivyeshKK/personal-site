"use client";

import { useEffect, useRef, useCallback } from "react";

const CHARS = " .,:;-=+*#%@\u2588";
const CELL = 14;
const RADIUS = 120;

export default function Landing() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const animRef = useRef(null);
  const gridRef = useRef([]);
  const dimsRef = useRef({ cols: 0, rows: 0, w: 0, h: 0 });

  const initGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cols = Math.ceil(w / CELL);
    const rows = Math.ceil(h / CELL);
    dimsRef.current = { cols, rows, w, h };

    const grid = [];
    for (let i = 0; i < rows * cols; i++) {
      grid.push({
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.7,
      });
    }
    gridRef.current = grid;
  }, []);

  useEffect(() => {
    initGrid();
    window.addEventListener("resize", initGrid);
    return () => window.removeEventListener("resize", initGrid);
  }, [initGrid]);

  const handlePointer = useCallback((e) => {
    const t = e.touches ? e.touches[0] : e;
    mouse.current = { x: t.clientX, y: t.clientY };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let t = 0;
    const maxIdx = CHARS.length - 1;

    const render = () => {
      t++;
      const { cols, rows, w, h } = dimsRef.current;
      const grid = gridRef.current;
      const mx = mouse.current.x;
      const my = mouse.current.y;

      ctx.clearRect(0, 0, w, h);
      ctx.font = `${CELL - 2}px "Courier New", Courier, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let r = 0; r < rows; r++) {
        const cy = (r + 0.5) * CELL;
        for (let c = 0; c < cols; c++) {
          const cx = (c + 0.5) * CELL;
          const idx = r * cols + c;
          const cell = grid[idx];
          if (!cell) continue;

          const dx = mx - cx;
          const dy = my - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const wobble = Math.sin(t * 0.003 * cell.speed + cell.phase);

          let ch, alpha;

          if (dist < RADIUS) {
            const norm = 1 - dist / RADIUS;
            const intensity = norm * norm * norm;
            const wave = Math.sin(dist * 0.05 - t * 0.06) * 0.25;
            const ci = Math.min(maxIdx, Math.max(0, Math.floor((intensity + wave) * maxIdx)));
            ch = CHARS[ci];
            alpha = 0.2 + intensity * 0.8;
          } else {
            const ambient = wobble * 0.5 + 0.5;
            const ci = Math.min(2, Math.max(0, Math.floor(ambient * 2.5)));
            ch = CHARS[ci];
            alpha = 0.05 + ambient * 0.06;
          }

          if (alpha < 0.03) continue;
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.fillText(ch, cx, cy);
        }
      }

      animRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const linkStyle = {
    fontSize: "13px",
    fontWeight: 400,
    color: "#666",
    letterSpacing: "0.02em",
    padding: "8px 0",
    borderBottom: "1px solid #222",
    transition: "all 0.3s",
    textDecoration: "none",
  };

  return (
    <div
      onMouseMove={handlePointer}
      onTouchMove={handlePointer}
      onTouchStart={handlePointer}
      style={{
        background: "#000",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        cursor: "crosshair",
        position: "relative",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        touchAction: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "44px 48px",
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(6px)",
            pointerEvents: "auto",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(26px, 3.5vw, 40px)",
              fontWeight: 300,
              color: "#fff",
              letterSpacing: "-0.01em",
              marginBottom: "10px",
              lineHeight: 1.1,
            }}
          >
            divyesh khatri
          </h1>

          <p
            style={{
              fontSize: "12px",
              fontWeight: 300,
              color: "#555",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "32px",
            }}
          >
            site under construction
          </p>

          <div
            style={{
              display: "flex",
              gap: "28px",
              justifyContent: "center",
            }}
          >
            <a
              href="https://linkedin.com/in/divyeshkhatri"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
              onMouseEnter={(e) => {
                e.target.style.color = "#fff";
                e.target.style.borderColor = "#fff";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#666";
                e.target.style.borderColor = "#222";
              }}
            >
              linkedin ↗
            </a>
            <a
              href="https://www.notion.so/Design-Portfolio-2be35237df7880508c48c9f583dfa5a4"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
              onMouseEnter={(e) => {
                e.target.style.color = "#fff";
                e.target.style.borderColor = "#fff";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#666";
                e.target.style.borderColor = "#222";
              }}
            >
              portfolio ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
