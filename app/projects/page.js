"use client";
import { useState } from "react";
import Link from "next/link";
import WaveCanvas from "../components/WaveCanvas";
import { PROJECTS } from "../data/projects";

export default function Projects() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <div style={{
      minHeight: "100vh", position: "relative",
      cursor: "crosshair", touchAction: "none",
    }}>
      <WaveCanvas />

      <div style={{
        position: "relative", zIndex: 10,
        maxWidth: "800px", margin: "0 auto",
        padding: "80px 32px 120px",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "56px",
        }}>
          <Link href="/" style={{
            fontSize: "11px", fontWeight: 500,
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase", letterSpacing: "0.12em",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            paddingBottom: "2px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => e.target.style.color = "#fff"}
          onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.3)"}
          >← back</Link>
          <span style={{
            fontSize: "11px", fontWeight: 500,
            color: "rgba(255,255,255,0.15)",
            textTransform: "uppercase", letterSpacing: "0.12em",
          }}>{PROJECTS.length} projects</span>
        </div>

        <h1 style={{
          fontSize: "clamp(36px, 5vw, 56px)",
          fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "0.03em", lineHeight: 1,
          marginBottom: "48px",
          textShadow: "2px 2px 0px rgba(0,0,0,0.5)",
        }}>
          Selected work
        </h1>

        {/* Project list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {PROJECTS.map((project, i) => (
            <Link key={project.slug} href={`/projects/${project.slug}`}>
              <div
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  padding: "20px 24px",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  background: hoveredIdx === i ? "rgba(255,255,255,0.06)" : "transparent",
                  transition: "background 0.2s linear",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{
                    fontSize: "clamp(20px, 2.5vw, 28px)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                    color: hoveredIdx === i ? "#fff" : "rgba(255,255,255,0.6)",
                    transition: "color 0.2s linear",
                  }}>
                    {project.title}
                  </div>
                  <div style={{
                    display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap",
                  }}>
                    {project.tags.map((tag) => (
                      <span key={tag} style={{
                        fontSize: "10px", fontWeight: 500,
                        textTransform: "uppercase", letterSpacing: "0.08em",
                        color: "rgba(255,255,255,0.25)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        padding: "3px 8px",
                      }}>{tag}</span>
                    ))}
                  </div>
                </div>
                <span style={{
                  fontSize: "18px",
                  color: "rgba(255,255,255,0.2)",
                  transition: "all 0.2s",
                  transform: hoveredIdx === i ? "translateX(4px)" : "translateX(0)",
                  opacity: hoveredIdx === i ? 1 : 0.3,
                }}>→</span>
              </div>
            </Link>
          ))}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
        </div>
      </div>
    </div>
  );
}
