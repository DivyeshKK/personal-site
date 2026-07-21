"use client";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import WaveCanvas from "../../components/WaveCanvas";
import { PROJECTS } from "../../data/projects";

export default function ProjectPage({ params }) {
  const { slug } = use(params);
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <WaveCanvas />
        <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
          <div style={{ fontSize: "48px", fontWeight: 700, textTransform: "uppercase" }}>404</div>
          <Link href="/projects" style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "16px", display: "block" }}>← back to projects</Link>
        </div>
      </div>
    );
  }

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
        {/* Nav */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "48px",
        }}>
          <Link href="/projects" style={{
            fontSize: "11px", fontWeight: 500,
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase", letterSpacing: "0.12em",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            paddingBottom: "2px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => e.target.style.color = "#fff"}
          onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.3)"}
          >← projects</Link>
          <div style={{ display: "flex", gap: "8px" }}>
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

        {/* Title */}
        <h1 style={{
          fontSize: "clamp(28px, 4.5vw, 48px)",
          fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "0.03em", lineHeight: 1.1,
          marginBottom: "24px",
          textShadow: "2px 2px 0px rgba(0,0,0,0.5)",
        }}>
          {project.title}
        </h1>

        {/* Idea */}
        {project.idea && (
          <p style={{
            fontSize: "15px", fontWeight: 400, lineHeight: 1.7,
            color: "rgba(255,255,255,0.5)", maxWidth: "600px",
            marginBottom: "16px",
          }}>{project.idea}</p>
        )}

        {/* Process */}
        {project.process && (
          <p style={{
            fontSize: "14px", fontWeight: 300, lineHeight: 1.7,
            color: "rgba(255,255,255,0.35)", maxWidth: "600px",
            marginBottom: "32px",
          }}>{project.process}</p>
        )}

        {/* Result */}
        {project.result && (
          <div style={{
            padding: "16px 20px",
            background: "rgba(255,255,255,0.04)",
            borderLeft: "2px solid rgba(255,255,255,0.15)",
            marginBottom: "32px",
            fontSize: "14px", fontWeight: 500,
            color: "rgba(255,255,255,0.6)",
            textTransform: "uppercase", letterSpacing: "0.06em",
          }}>
            ↗ {project.result}
          </div>
        )}

        {/* Links */}
        {project.links && (
          <div style={{
            display: "flex", gap: "16px", marginBottom: "40px", flexWrap: "wrap",
          }}>
            {project.links.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                style={{
                  fontSize: "13px", fontWeight: 500,
                  color: "rgba(255,255,255,0.4)",
                  padding: "8px 16px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  textTransform: "uppercase", letterSpacing: "0.06em",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.target.style.color = "#fff"; e.target.style.borderColor = "rgba(255,255,255,0.4)"; }}
                onMouseLeave={(e) => { e.target.style.color = "rgba(255,255,255,0.4)"; e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
              >{link.label} ↗</a>
            ))}
          </div>
        )}

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px", marginTop: "40px" }}>
          {project.sections.map((section, i) => {
            if (section.type === "heading") {
              return (
                <h3 key={i} style={{
                  fontSize: "18px", fontWeight: 600,
                  textTransform: "uppercase", letterSpacing: "0.06em",
                  color: "rgba(255,255,255,0.5)",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  paddingTop: "24px", marginTop: "8px",
                }}>
                  {section.text}
                </h3>
              );
            }

            if (section.type === "hero" || section.type === "image") {
              return (
                <div key={i}>
                  <img
                    src={section.src}
                    alt=""
                    style={{
                      width: "100%", height: "auto",
                      display: "block",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  />
                  {section.caption && (
                    <p style={{
                      fontSize: "12px", fontWeight: 400,
                      color: "rgba(255,255,255,0.3)",
                      marginTop: "8px", letterSpacing: "0.04em",
                    }}>{section.caption}</p>
                  )}
                </div>
              );
            }

            if (section.type === "grid") {
              return (
                <div key={i} style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "8px",
                }}>
                  {section.images.map((src, j) => (
                    <img key={j} src={src} alt=""
                      style={{
                        width: "100%", height: "auto", display: "block",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
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
  );
}
