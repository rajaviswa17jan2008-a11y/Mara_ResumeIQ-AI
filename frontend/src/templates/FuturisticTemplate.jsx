// frontend/templates/FuturisticTemplate.jsx
import React from "react";
import { motion } from "framer-motion";
import HeroSection from "../components/Portfolio/HeroSection";
import AboutSection from "../components/Portfolio/AboutSection";
import SkillsSection from "../components/Portfolio/SkillsSection";
import ProjectsSection from "../components/Portfolio/ProjectsSection";
import ContactSection from "../components/Portfolio/ContactSection";

export default function FuturisticTemplate({ data = {} }) {
  const accent = "#00ff9f";

  return (
    <div className="text-white relative overflow-hidden" style={{ background: "#020818" }}>
      {/* Animated grid */}
      <div
  data-export-ignore="true"
  className="fixed inset-0 pointer-events-none z-0"
>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#00ff9f 1px, transparent 1px), linear-gradient(90deg, #00ff9f 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        {/* Scanning line */}
        <motion.div
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-px opacity-20"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full blur-[130px] opacity-10" style={{ background: accent }} />
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full blur-[100px] opacity-10" style={{ background: "#00f0ff" }} />
      </div>

      {/* Nav */}
     {!data?.previewMode && (
<nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#00ff9f]/15"  style={{ background: "rgba(2,8,24,0.8)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00ff9f] animate-pulse" />
            <span className="font-mono font-black text-lg text-[#00ff9f]">SYS_{(data.name || "PORT").toUpperCase().replace(/\s+/g, "_")}</span>
          </div>
          <div className="hidden md:flex gap-6 text-xs font-mono uppercase tracking-widest">
            {["about", "skills", "projects", "contact"].map((s, i) => (
              <a key={s} href={`#${s}`} className="text-gray-500 hover:text-[#00ff9f] transition-colors">
                <span className="text-[#00ff9f]/30 mr-1">{String(i + 1).padStart(2, "0")}.</span>{s}
              </a>
            ))}
          </div>
          <div className="text-[10px] font-mono text-gray-600">
            STATUS: <span className="text-[#00ff9f]">ONLINE</span>
          </div>
        </div>
      </nav>
     )}
      <div className="relative z-10 pt-16">
        <HeroSection data={data} accentColor={accent} />

        {/* Sections with futuristic dividers */}
        {[AboutSection, SkillsSection, ProjectsSection, ContactSection].map((Section, i) => (
          <React.Fragment key={i}>
            <div className="flex items-center gap-3 px-8 opacity-30">
              <span className="text-[10px] font-mono text-[#00ff9f]">// SECTION_{String(i + 1).padStart(2, "0")}</span>
              <div className="flex-1 h-px bg-[#00ff9f]" />
            </div>
            <Section data={data} accentColor={accent} />
          </React.Fragment>
        ))}
      </div>

      <footer className="border-t border-[#00ff9f]/10 py-6 text-center">
        <p className="text-gray-600 text-[11px] font-mono">
          &gt;&gt; SYSTEM: {data.name || "Portfolio"} v1.0.0 — AI PORTFOLIO GENERATOR
        </p>
      </footer>
    </div>
  );
}