// frontend/pages/PortfolioTemplatesPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
const templates = [
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    tag: "Most Popular",
    tagColor: "#00f0ff",
    description: "Dark neon aesthetics with glowing borders, matrix-style typography, and futuristic UI elements.",
    colors: ["#00f0ff", "#bf00ff", "#050510"],
    features: ["Neon glow effects", "Animated borders", "Matrix typography", "Dark glassmorphism"],
    preview: "bg-[#050510]",
    gradient: "from-[#00f0ff]/20 to-[#bf00ff]/20",
  },
  {
    id: "glassmorphism",
    name: "Glassmorphism",
    tag: "Trending",
    tagColor: "#bf00ff",
    description: "Frosted glass cards with blur effects, translucent layers, and elegant depth perception.",
    colors: ["#bf00ff", "#7c3aed", "#1e1b4b"],
    features: ["Frosted glass cards", "Blur backdrops", "Gradient overlays", "Smooth animations"],
    preview: "bg-[#1e1b4b]",
    gradient: "from-[#bf00ff]/20 to-[#7c3aed]/20",
  },
  {
    id: "minimal",
    name: "Minimal",
    tag: "Clean",
    tagColor: "#ffffff",
    description: "Crisp white space, bold typography, and refined simplicity that lets your work speak.",
    colors: ["#ffffff", "#111111", "#f5f5f5"],
    features: ["Clean typography", "White space focus", "Monochrome palette", "Editorial layout"],
    preview: "bg-white",
    gradient: "from-gray-200/20 to-gray-400/20",
  },
  {
    id: "futuristic",
    name: "Futuristic",
    tag: "New",
    tagColor: "#00ff9f",
    description: "Sci-fi inspired interface with holographic effects, animated grids, and space-age components.",
    colors: ["#00ff9f", "#00f0ff", "#020818"],
    features: ["Holographic overlays", "Grid animations", "Space-age UI", "Pulse effects"],
    preview: "bg-[#020818]",
    gradient: "from-[#00ff9f]/20 to-[#00f0ff]/20",
  },
];

export default function PortfolioTemplatesPage() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#00f0ff]/4 blur-[150px]" />
      </div>
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            Portfolio <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#bf00ff]">Templates</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">Choose a template that matches your personal brand. Switch anytime in the preview.</p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {templates.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onHoverStart={() => setHovered(t.id)}
              onHoverEnd={() => setHovered(null)}
              onClick={() => setSelected(t.id)}
              className={`relative rounded-2xl border cursor-pointer overflow-hidden transition-all duration-300 ${
                selected === t.id ? "border-[#00f0ff] shadow-[0_0_40px_#00f0ff25]" : "border-[#ffffff10] hover:border-[#ffffff25]"
              }`}
            >
              {/* Tag */}
              <div className="absolute top-4 right-4 z-10">
                <span className="text-[10px] font-mono uppercase px-2 py-1 rounded-full border" style={{ borderColor: `${t.tagColor}40`, color: t.tagColor, background: `${t.tagColor}10` }}>
                  {t.tag}
                </span>
              </div>

              {/* Visual Preview */}
              <div className={`relative h-48 ${t.preview} overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${t.gradient}`} />
                {/* Mock UI elements */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="w-full space-y-2">
                    <div className="h-3 rounded-full w-2/3 mx-auto" style={{ background: `${t.colors[0]}40` }} />
                    <div className="h-2 rounded-full w-1/2 mx-auto" style={{ background: `${t.colors[0]}20` }} />
                    <div className="flex gap-2 justify-center mt-4">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="w-16 h-10 rounded-lg" style={{ background: `${t.colors[0]}15`, border: `1px solid ${t.colors[0]}20` }} />
                      ))}
                    </div>
                  </div>
                </div>
                {/* Color dots */}
                <div className="absolute bottom-3 left-4 flex gap-1.5">
                  {t.colors.map((c) => (
                    <div key={c} className="w-4 h-4 rounded-full border border-white/10" style={{ background: c }} />
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="p-6 bg-[#ffffff03]">
                <h3 className="text-xl font-bold text-white mb-2">{t.name}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{t.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {t.features.map((f) => (
                    <span key={f} className="text-[11px] px-2 py-1 rounded-lg bg-[#ffffff05] border border-[#ffffff08] text-gray-400">{f}</span>
                  ))}
                </div>
                    <div className="flex gap-3">

  <button
    onClick={(e) => {
      e.stopPropagation();
      setSelected(t.id);
    }}
    className="flex-1 py-2.5 rounded-xl border border-[#ffffff15] text-gray-300 text-sm hover:border-[#ffffff30] hover:text-white transition-all"
  >
    Preview
  </button>

  <button
    onClick={(e) => {
      e.stopPropagation();

      console.log("BUTTON CLICKED");
      console.log("TEMPLATE =", t.id);

      navigate("/portfolio-generator", {
        state: {
          template: t.id
        }
      });
    }}
    className="flex-1 py-2.5 rounded-xl font-bold text-sm text-black transition-all hover:scale-[1.02]"
    style={{
      background: `linear-gradient(135deg, ${t.tagColor}, ${t.colors[0]})`
    }}
  >
    Use Template
  </button>

</div>
            </div>      

              {/* Selected overlay */}
              {selected === t.id && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 border-2 rounded-2xl pointer-events-none" style={{ borderColor: "#00f0ff", boxShadow: "inset 0 0 30px #00f0ff10" }} />
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        {selected && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 text-center">
            <button
              onClick={() =>
  navigate(
    "/portfolio-generator",
    {
      state: {
        template: selected
      }
    }
  )
}
              className="px-12 py-4 rounded-2xl bg-gradient-to-r from-[#00f0ff] to-[#bf00ff] text-black font-extrabold text-lg hover:shadow-[0_0_60px_#00f0ff40] hover:scale-[1.02] transition-all"
            >
              ⚡ Build With {templates.find((t) => t.id === selected)?.name} Template
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}