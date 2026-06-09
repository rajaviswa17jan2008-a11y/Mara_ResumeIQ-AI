// frontend/pages/PortfolioPreviewPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import TemplateSelector from "../components/Portfolio/TemplateSelector";
import ExportPortfolioButton from "../components/Portfolio/ExportPortfolioButton";
import CyberpunkTemplate from "../templates/CyberpunkTemplate";
import GlassmorphismTemplate from "../templates/GlassmorphismTemplate";
import MinimalTemplate from "../templates/MinimalTemplate";
import FuturisticTemplate from "../templates/FuturisticTemplate";
import { ArrowLeft } from "lucide-react";
const templateMap = {
  cyberpunk: CyberpunkTemplate,
  glassmorphism: GlassmorphismTemplate,
  minimal: MinimalTemplate,
  futuristic: FuturisticTemplate,
};

export default function PortfolioPreviewPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const portfolioData =
  state?.portfolioData?.data?.portfolioData ||
  state?.portfolioData?.portfolioData ||
  state?.portfolioData ||
  {};
     
    console.log("FINAL DATA =", portfolioData);
    console.log("PERSONAL =", portfolioData.personal);
console.log("IMAGE =", portfolioData.personal?.image);
console.log(
  "SKILLS =",
  portfolioData.skills
);
  const [activeTemplate, setActiveTemplate] = useState(state?.template || "cyberpunk");
  const [previewMode, setPreviewMode] = useState("desktop");

  const TemplateComponent = templateMap[activeTemplate] || CyberpunkTemplate;

  return (
    <div className="min-h-[70vh] bg-[#050510] flex flex-col">
      <div className="relative z-20 p-4">
  <button
    onClick={() => navigate("/dashboard")}
    className="
    flex
    items-center
    gap-2

    px-4
    py-2

    rounded-xl

    bg-white/5
    border
    border-cyan-500/20

    text-white/70

    hover:text-cyan-400
    hover:border-cyan-400/40
    hover:bg-cyan-500/10

    transition-all
    duration-300
    "
  >
    <ArrowLeft size={18} />
    Exit
  </button>
</div>
      {/* Top Toolbar */}
      <div className="sticky top-0 z-[9999] bg-[#050510] border-b border-[#ffffff10] px-6 py-3">
        
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back
            </button>
            <div className="w-px h-5 bg-[#ffffff15]" />
            <span className="text-white font-semibold text-sm">Portfolio Preview</span>
           <div className="hidden lg:flex items-center gap-6 ml-8">
         <button
  onClick={() =>
    document
      .getElementById("about")
      ?.scrollIntoView({ behavior: "smooth" })
  }
>
  About
</button>

<button
  onClick={() =>
    document
      .getElementById("skills")
      ?.scrollIntoView({ behavior: "smooth" })
  }
>
  Skills
</button>

<button
  onClick={() =>
    document
      .getElementById("projects")
      ?.scrollIntoView({ behavior: "smooth" })
  }
>
  Projects
</button>

<button
  onClick={() =>


    document
      .getElementById("contact")
      ?.scrollIntoView({ behavior: "smooth" })
  }
>
  Contact
</button>
</div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#00ff9f]/10 border border-[#00ff9f]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9f] animate-pulse" />
              <span className="text-[#00ff9f] text-[10px] font-mono">LIVE</span>
            </div>
          </div>

          {/* Preview mode toggle */}
          <div className="flex gap-1 bg-[#ffffff05] p-1 rounded-xl border border-[#ffffff10]">
            {[["desktop", "🖥"], ["tablet", "📱"], ["mobile", "📲"]].map(([mode, icon]) => (
              <button
                key={mode}
                onClick={() => setPreviewMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all duration-200 ${previewMode === mode ? "bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/20" : "text-gray-500 hover:text-gray-300"}`}
              >
                {icon} {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/portfolio/templates")} className="text-xs px-4 py-2 rounded-xl border border-[#bf00ff]/30 text-[#bf00ff] hover:bg-[#bf00ff]/10 transition-all">
              Browse Templates
            </button>
            <ExportPortfolioButton portfolioData={portfolioData} template={activeTemplate} />
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Left: Template Selector */}
        <div className="hidden lg:block w-64 flex-shrink-0 border-r border-[#ffffff08] bg-[#050510] p-4 overflow-y-auto">
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">Templates</p>
          <TemplateSelector active={activeTemplate} onChange={setActiveTemplate} />
        </div>

        {/* Center: Preview */}
        <div className="flex-1 bg-[#030308] overflow-y-auto p-8 flex justify-center items-start">
          <motion.div
          id="portfolio-preview"
            key={activeTemplate + previewMode}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="transition-all duration-500"
            style={{
             width:
  previewMode === "desktop"
    ? "100%"
    : previewMode === "tablet"
    ? "768px"
    : "100%",
              maxWidth: previewMode === "desktop" ? "100%" : previewMode === "tablet" ? "768px" : "390px",
                 minWidth: undefined,
              boxShadow: "0 0 80px #00f0ff10",
              borderRadius: "12px",
            }}
          >
      <TemplateComponent
  data={{
    ...portfolioData,
    previewMode: true,
  }}
/>
          </motion.div>
        </div>
      </div>
    </div>
  );
}