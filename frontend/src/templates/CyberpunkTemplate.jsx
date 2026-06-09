// frontend/templates/CyberpunkTemplate.jsx
import React from "react";
import { motion } from "framer-motion";
import HeroSection from "../components/Portfolio/HeroSection";
import AboutSection from "../components/Portfolio/AboutSection";
import SkillsSection from "../components/Portfolio/SkillsSection";
import ProjectsSection from "../components/Portfolio/ProjectsSection";
import ContactSection from "../components/Portfolio/ContactSection";

export default function CyberpunkTemplate({ data = {} }) {
  const accent = "#00f0ff";

  return (
    <div className="bg-[#050510] text-white font-mono relative overflow-hidden">
      {/* Ambient background effects */}
      <div
  data-export-ignore="true"
  className="fixed inset-0 pointer-events-none z-0"
>
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.015]" style={{ backgroundImage: "linear-gradient(#00f0ff 1px, transparent 1px), linear-gradient(90deg, #00f0ff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
       
      </div>
      <div
  className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-[150px] opacity-10"
  style={{ background: "#00f0ff" }}
/>

<div
  //className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full blur-[120px] opacity-10"
  //style={{ background: "#00f0ff" }}
/>

      {/* Nav */}
      {!data?.previewMode && (
       <nav className="sticky top-0 left-0 right-0 z-[100] bg-[#050510]/90 backdrop-blur-xl border-b border-[#00f0ff]/10">
<div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-[#00f0ff] font-black text-xl tracking-wider">{(data.name || "PORTFOLIO").toUpperCase().slice(0, 2)}_DEV</span>
          <div className="hidden md:flex gap-6 text-xs tracking-widest uppercase">
            {[
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
].map((item) => (
  <a
    key={item.id}
    href={`#${item.id}`}
    className="text-sm font-medium text-gray-300 hover:text-[#00f0ff] transition-colors"
  >
    {item.label}
  </a>
))}
          </div>
        </div>
      </nav>
      )}
      {/* Sections */}
      <div className="relative z-10 pt-16">
        <HeroSection data={data} accentColor={accent} />
        {/* Divider */}
        <div className="h-px mx-8" style={{ background: "linear-gradient(90deg, transparent, #00f0ff30, transparent)" }} />
        <AboutSection data={data} accentColor={accent} />
        <div className="h-px mx-8" style={{ background: "linear-gradient(90deg, transparent, #bf00ff30, transparent)" }} />
        <SkillsSection data={data} accentColor={accent} />
        <div className="h-px mx-8" style={{ background: "linear-gradient(90deg, transparent, #00f0ff30, transparent)" }} />
        <ProjectsSection data={data} accentColor={accent} />
        <div className="h-px mx-8" style={{ background: "linear-gradient(90deg, transparent, #00ff9f30, transparent)" }} />
        <ContactSection data={data} accentColor={accent} />
      </div>

      {/* Footer */}
      <footer className="border-t border-[#00f0ff]/10 py-6 text-center">
        <p className="text-gray-600 text-xs font-mono">
          &gt; {data.name || "Portfolio"}.exe — Built with AI Portfolio Generator
        </p>
      </footer>
    </div>
  );
}