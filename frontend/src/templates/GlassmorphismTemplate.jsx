// frontend/templates/GlassmorphismTemplate.jsx
import React from "react";
import HeroSection from "../components/Portfolio/HeroSection";
import AboutSection from "../components/Portfolio/AboutSection";
import SkillsSection from "../components/Portfolio/SkillsSection";
import ProjectsSection from "../components/Portfolio/ProjectsSection";
import ContactSection from "../components/Portfolio/ContactSection";

export default function GlassmorphismTemplate({ data = {} }) {
  const accent = "#bf00ff";

  return (
    <div className="text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" }}>
      {/* Floating blobs */}
      <div
  data-export-ignore="true"
  className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
>
        {[
          { top: "10%", left: "15%", size: 400, color: "#bf00ff" },
          { top: "50%", right: "10%", size: 350, color: "#7c3aed" },
          { bottom: "20%", left: "30%", size: 300, color: "#4f46e5" },
        ].map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-[120px] opacity-20"
            style={{
              width: b.size, height: b.size, background: b.color,
              top: b.top, bottom: b.bottom, left: b.left, right: b.right,
            }}
          />
        ))}
      </div>

      {/* Nav */}
      {!data?.previewMode && (
<nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl border-b border-white/10" style={{ background: "rgba(15,12,41,0.5)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-black text-xl text-white">{data.name || "Portfolio"}</span>
          <div className="hidden md:flex gap-6 text-sm">
            {["about", "skills", "projects", "contact"].map((s) => (
              <a key={s} href={`#${s}`} className="text-white/60 hover:text-white transition-colors capitalize">{s}</a>
            ))}
          </div>
        </div>
      </nav>
      )}
      {/* Sections wrapped in glass card feel */}
      <div className="relative z-10 pt-16">
        <HeroSection data={data} accentColor={accent} />
        <div className="mx-8">
          <div className="rounded-3xl border border-white/10 backdrop-blur-xl overflow-hidden mb-8" style={{ background: "rgba(255,255,255,0.03)" }}>
            <AboutSection data={data} accentColor={accent} />
          </div>
          <div className="rounded-3xl border border-white/10 backdrop-blur-xl overflow-hidden mb-8" style={{ background: "rgba(255,255,255,0.03)" }}>
            <SkillsSection data={data} accentColor={accent} />
          </div>
          <div className="rounded-3xl border border-white/10 backdrop-blur-xl overflow-hidden mb-8" style={{ background: "rgba(255,255,255,0.03)" }}>
            <ProjectsSection data={data} accentColor={accent} />
          </div>
          <div className="rounded-3xl border border-white/10 backdrop-blur-xl overflow-hidden mb-8" style={{ background: "rgba(255,255,255,0.03)" }}>
            <ContactSection data={data} accentColor={accent} />
          </div>
        </div>
      </div>

      <footer className="py-6 text-center">
        <p className="text-white/30 text-xs">{data.name || "Portfolio"} — AI Portfolio Generator</p>
      </footer>
    </div>
  );
}