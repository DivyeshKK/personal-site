"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import WaveCanvas from "./components/WaveCanvas";

const MODES = [
  { label: "profile", content: "divyesh khatri", sub: "stanford design / class of 2026" },
  { label: "status", content: "under construction", sub: "site currently in development" },
  { label: "work", content: "portfolio", sub: "view selected projects", link: "/projects" },
  { label: "connect", content: "linkedin", sub: "linkedin.com/in/divyeshkhatri", link: "https://linkedin.com/in/divyeshkhatri", external: true },
];

const TOTAL_ITEMS = 80;

export default function Landing() {
  const [activeIndex, setActiveIndex] = useState(Math.floor(TOTAL_ITEMS / 2));
  const [fade, setFade] = useState(true);
  const stripRef = useRef(null);
  const itemRefs = useRef([]);
  const activeRef = useRef(Math.floor(TOTAL_ITEMS / 2));

  const activeMode = activeIndex % MODES.length;

  const scrollTo = useCallback((idx) => {
    const strip = stripRef.current;
    const el = itemRefs.current[idx];
    if (!strip || !el) return;
    strip.style.transform = `translateX(${window.innerWidth / 2 - el.offsetLeft - el.offsetWidth / 2}px)`;
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      const strip = stripRef.current;
      if (strip) strip.style.transition = "none";
      scrollTo(activeRef.current);
      requestAnimationFrame(() => {
        if (strip) strip.style.transition = "transform 0.5s cubic-bezier(0.2, 0, 0.2, 1)";
      });
    });
  }, [scrollTo]);

  useEffect(() => {
    const onResize = () => scrollTo(activeRef.current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [scrollTo]);

  const selectItem = (i) => {
    if (i === activeRef.current) return;
    setFade(false);
    activeRef.current = i;
    setActiveIndex(i);
    requestAnimationFrame(() => {
      scrollTo(i);
      setTimeout(() => setFade(true), 150);
    });
  };

  const mode = MODES[activeMode];
  const strip = [];
  for (let i = 0; i < TOTAL_ITEMS; i++) strip.push({ ...MODES[i % MODES.length], realIndex: i });

  const headingStyle = {
    fontSize: "clamp(32px, 6vw, 68px)",
    fontWeight: 700, color: "#fff",
    textTransform: "uppercase", lineHeight: 1,
    letterSpacing: "0.04em",
    textShadow: "2px 2px 0px rgba(0,0,0,0.6)",
  };

  const ContentEl = mode.link ? (
    <a href={mode.link} target={mode.external ? "_blank" : undefined} rel={mode.external ? "noopener noreferrer" : undefined}>
      <div style={headingStyle}>{mode.content}</div>
    </a>
  ) : (
    <div style={headingStyle}>{mode.content}</div>
  );

  return (
    <div style={{
      width: "100vw", height: "100vh", overflow: "hidden",
      cursor: "crosshair", position: "relative", touchAction: "none",
    }}>
      <WaveCanvas />

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        zIndex: 10, pointerEvents: "none", paddingBottom: "72px",
      }}>
        <div style={{
          textAlign: "center", pointerEvents: "auto",
          opacity: fade ? 1 : 0, transition: "opacity 0.15s linear",
        }}>
          {ContentEl}
          <div style={{
            fontSize: "12px", fontWeight: 400,
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase", letterSpacing: "0.18em",
            marginTop: "14px",
          }}>{mode.sub}</div>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10,
        height: "64px", overflow: "hidden",
        borderTop: "2px solid rgba(255,255,255,0.06)",
        background: "rgba(0,0,0,0.35)",
        display: "flex", alignItems: "center",
      }}>
        <div ref={stripRef} style={{
          display: "flex", alignItems: "center",
          whiteSpace: "nowrap", willChange: "transform",
        }}>
          {strip.map((item, i) => (
            <div key={i} ref={(el) => (itemRefs.current[i] = el)}
              style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              <button
                onClick={() => selectItem(i)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "'Rajdhani', Arial, sans-serif",
                  fontSize: "clamp(24px, 3vw, 36px)",
                  fontWeight: i === activeIndex ? 700 : 400,
                  color: i === activeIndex ? "#fff" : "rgba(255,255,255,0.18)",
                  textTransform: "uppercase", padding: "0 8px",
                  letterSpacing: "0.06em",
                  transition: "color 0.2s linear",
                  lineHeight: "64px", flexShrink: 0,
                }}
              >{item.label}</button>
              <span style={{
                color: "rgba(255,255,255,0.06)",
                fontSize: "clamp(20px, 2.5vw, 30px)",
                padding: "0 12px", userSelect: "none", flexShrink: 0,
                fontWeight: 300,
              }}>|</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        position: "absolute", top: 16, left: 20, zIndex: 10,
        fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.12)",
        textTransform: "uppercase", letterSpacing: "0.12em",
      }}>dk/26</div>
      <div style={{
        position: "absolute", top: 16, right: 20, zIndex: 10,
        fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.12)",
        textTransform: "uppercase", letterSpacing: "0.12em",
      }}>v0.1</div>
    </div>
  );
}
