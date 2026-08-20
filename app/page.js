"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import WaveCanvas from "./components/WaveCanvas";
import useReducedMotion from "./lib/useReducedMotion";
import { PROJECTS } from "./data/projects";

const MODES = [
  { label: "profile", type: "text", content: "divyesh khatri", sub: "stanford design / class of 2026" },
  { label: "status", type: "text", content: "under construction", sub: "site currently in development" },
  { label: "work", type: "projects" },
  { label: "connect", type: "text", content: "linkedin", sub: "linkedin.com/in/divyeshkhatri", link: "https://linkedin.com/in/divyeshkhatri", external: true },
];

const TOTAL_ITEMS = 80;
const SWAP_MS = 150;
const OVERLAY_MS = 200;

export default function Landing() {
  const [activeIndex, setActiveIndex] = useState(Math.floor(TOTAL_ITEMS / 2));
  const [displayIndex, setDisplayIndex] = useState(Math.floor(TOTAL_ITEMS / 2));
  const [contentVisible, setContentVisible] = useState(true);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [openProject, setOpenProject] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const stripRef = useRef(null);
  const itemRefs = useRef([]);
  const activeRef = useRef(Math.floor(TOTAL_ITEMS / 2));
  const scrollRef = useRef(null);
  const swapTimer = useRef(null);
  const closeTimer = useRef(null);
  const reducedMotion = useReducedMotion();

  const mode = MODES[displayIndex % MODES.length];

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
        if (!strip) return;
        strip.style.transition = reducedMotion
          ? "none"
          : "transform var(--duration-strip) var(--ease-drawer)";
      });
    });
  }, [scrollTo, reducedMotion]);

  useEffect(() => () => {
    clearTimeout(swapTimer.current);
    clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    const onResize = () => scrollTo(activeRef.current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [scrollTo]);

  const closeProjectView = useCallback(() => {
    setOverlayVisible(false);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenProject(null), OVERLAY_MS);
  }, []);

  const selectItem = (i) => {
    if (i === activeRef.current) return;
    // close any open project when switching modes
    if (openProject !== null) closeProjectView();
    activeRef.current = i;
    setActiveIndex(i);
    setContentVisible(false);
    requestAnimationFrame(() => scrollTo(i));
    clearTimeout(swapTimer.current);
    swapTimer.current = setTimeout(() => {
      setDisplayIndex(i);
      setContentVisible(true);
    }, SWAP_MS);
  };

  const openProjectView = (project) => {
    clearTimeout(closeTimer.current);
    setOpenProject(project);
    requestAnimationFrame(() => {
      setOverlayVisible(true);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    });
  };

  useEffect(() => {
    if (!openProject) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeProjectView();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openProject, closeProjectView]);

  const strip = [];
  for (let i = 0; i < TOTAL_ITEMS; i++) strip.push({ ...MODES[i % MODES.length], realIndex: i });

  const headingStyle = {
    fontSize: "clamp(32px, 6vw, 68px)",
    fontWeight: 700, color: "#fff",
    textTransform: "uppercase", lineHeight: 1,
    letterSpacing: "0.04em",
    textShadow: "2px 2px 0px rgba(0,0,0,0.6)",
  };

  return (
    <div style={{
      width: "100vw", height: "100vh", overflow: "hidden",
      cursor: "crosshair", position: "relative", touchAction: "none",
    }}>
      <WaveCanvas />

      {/* Project detail overlay */}
      {openProject && (
        <div
          ref={scrollRef}
          style={{
            position: "absolute", inset: 0, zIndex: 20,
            overflowY: "auto", overflowX: "hidden",
            background: "rgba(0,0,0,0.6)",
            opacity: overlayVisible ? 1 : 0,
            transform: reducedMotion || overlayVisible ? "none" : "translateY(8px)",
            transition: "opacity var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out)",
          }}
        >
          <div style={{
            maxWidth: "740px", margin: "0 auto",
            padding: "80px 32px 120px",
          }}>
            {/* Back */}
            <button
              className="link-quiet"
              onClick={closeProjectView}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "11px", fontWeight: 500,
                fontFamily: "'Rajdhani', Arial, sans-serif",
                textTransform: "uppercase", letterSpacing: "0.12em",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                paddingBottom: "2px", marginBottom: "40px",
                display: "block",
              }}
            >← back</button>

            {/* Tags */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
              {openProject.tags.map((tag) => (
                <span key={tag} style={{
                  fontSize: "10px", fontWeight: 500,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.25)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: "3px 8px",
                }}>{tag}</span>
              ))}
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: "clamp(26px, 4vw, 44px)",
              fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.03em", lineHeight: 1.1,
              marginBottom: "24px",
              textShadow: "2px 2px 0px rgba(0,0,0,0.5)",
            }}>{openProject.title}</h1>

            {openProject.idea && (
              <p style={{
                fontSize: "15px", fontWeight: 400, lineHeight: 1.7,
                color: "rgba(255,255,255,0.5)", maxWidth: "580px",
                marginBottom: "12px",
              }}>{openProject.idea}</p>
            )}

            {openProject.process && (
              <p style={{
                fontSize: "14px", fontWeight: 300, lineHeight: 1.7,
                color: "rgba(255,255,255,0.35)", maxWidth: "580px",
                marginBottom: "28px",
              }}>{openProject.process}</p>
            )}

            {openProject.result && (
              <div style={{
                padding: "14px 18px",
                background: "rgba(255,255,255,0.04)",
                borderLeft: "2px solid rgba(255,255,255,0.15)",
                marginBottom: "28px",
                fontSize: "13px", fontWeight: 500,
                color: "rgba(255,255,255,0.6)",
                textTransform: "uppercase", letterSpacing: "0.06em",
              }}>↗ {openProject.result}</div>
            )}

            {openProject.links && (
              <div style={{ display: "flex", gap: "12px", marginBottom: "36px", flexWrap: "wrap" }}>
                {openProject.links.map((link) => (
                  <a key={link.url} className="link-chip" href={link.url} target="_blank" rel="noopener noreferrer"
                    style={{
                      fontSize: "12px", fontWeight: 500,
                      padding: "7px 14px",
                      textTransform: "uppercase", letterSpacing: "0.06em",
                    }}
                  >{link.label} ↗</a>
                ))}
              </div>
            )}

            {/* Sections */}
            <div style={{ display: "flex", flexDirection: "column", gap: "28px", marginTop: "32px" }}>
              {openProject.sections.map((section, i) => {
                if (section.type === "heading") {
                  return (
                    <h3 key={i} style={{
                      fontSize: "16px", fontWeight: 600,
                      textTransform: "uppercase", letterSpacing: "0.06em",
                      color: "rgba(255,255,255,0.45)",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      paddingTop: "20px", marginTop: "4px",
                    }}>{section.text}</h3>
                  );
                }
                if (section.type === "hero" || section.type === "image") {
                  return (
                    <div key={i}>
                      <img src={section.src} alt=""
                        style={{ width: "100%", height: "auto", display: "block", border: "1px solid rgba(255,255,255,0.06)" }}
                      />
                      {section.caption && (
                        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "8px", letterSpacing: "0.04em" }}>{section.caption}</p>
                      )}
                    </div>
                  );
                }
                if (section.type === "grid") {
                  return (
                    <div key={i} style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                      gap: "6px",
                    }}>
                      {section.images.map((src, j) => (
                        <img key={j} src={src} alt=""
                          style={{ width: "100%", height: "auto", display: "block", border: "1px solid rgba(255,255,255,0.06)" }}
                        />
                      ))}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      )}

      {/* Center content */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        zIndex: 10, pointerEvents: "none", paddingBottom: "72px",
      }}>
        <div style={{
          textAlign: "center", pointerEvents: "auto",
          opacity: contentVisible ? 1 : 0,
          transform: reducedMotion || contentVisible ? "none" : "translateY(4px)",
          transition: "opacity var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out)",
        }}>
          {mode.type === "text" && (
            <>
              {mode.link ? (
                <a href={mode.link} target={mode.external ? "_blank" : undefined} rel={mode.external ? "noopener noreferrer" : undefined}>
                  <div style={headingStyle}>{mode.content}</div>
                </a>
              ) : (
                <div style={headingStyle}>{mode.content}</div>
              )}
              <div style={{
                fontSize: "12px", fontWeight: 400,
                color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase", letterSpacing: "0.18em",
                marginTop: "14px",
              }}>{mode.sub}</div>
            </>
          )}

          {mode.type === "projects" && (
            <div style={{
              display: "flex", flexDirection: "column", gap: "2px",
              minWidth: "min(500px, 80vw)",
            }}>
              {PROJECTS.map((project, i) => (
                <button
                  key={project.slug}
                  className="row row-enter"
                  onClick={() => openProjectView(project)}
                  onMouseEnter={() => setHoveredProject(i)}
                  onMouseLeave={() => setHoveredProject(null)}
                  style={{
                    padding: "14px 20px",
                    background: hoveredProject === i ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.2)",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    font: "inherit",
                    width: "100%",
                    animationDelay: `${i * 40}ms`,
                  }}
                >
                  <div className="row-title" style={{
                    fontSize: "clamp(16px, 2vw, 22px)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                    color: hoveredProject === i ? "#fff" : "rgba(255,255,255,0.45)",
                    textAlign: "left",
                  }}>{project.title}</div>
                  <div style={{
                    display: "flex", gap: "6px", flexShrink: 0, marginLeft: "16px",
                  }}>
                    {project.tags.slice(0, 2).map((tag) => (
                      <span key={tag} style={{
                        fontSize: "9px", fontWeight: 500,
                        textTransform: "uppercase", letterSpacing: "0.06em",
                        color: "rgba(255,255,255,0.2)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        padding: "2px 6px", whiteSpace: "nowrap",
                      }}>{tag}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Strip */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 25,
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
                  transition: "color var(--duration-fast) ease",
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
