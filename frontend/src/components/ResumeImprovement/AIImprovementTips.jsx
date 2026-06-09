// frontend/components/ResumeImprovement/AIImprovementTips.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["All", "Impact", "Format", "Skills", "Language", "Structure"];

export default function AIImprovementTips({ tips = [] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [copiedIndex, setCopiedIndex] = useState(null);

  const filtered = activeCategory === "All" ? tips : tips.filter((t) => t.category === activeCategory);

  const handleCopy = (text, i) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(i);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  whileHover={{
    y: -8,
    scale: 1.02
  }}
  transition={{
    duration: 0.5,
    type: "spring",
    stiffness: 300
  }}
  className="relative rounded-2xl border border-[#ffffff10] bg-[#ffffff03] backdrop-blur-xl p-6 overflow-hidden"
  style={{ boxShadow: "0 0 40px rgba(0,240,255,0.15)" }}
>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">AI Improvement Tips</span>
          </div>
          <p className="text-white font-semibold">{tips.length} personalized suggestions from AI</p>
        </div>
        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                activeCategory === cat
                  ? "border-[#00f0ff] bg-[#00f0ff]/15 text-[#00f0ff]"
                  : "border-[#ffffff15] text-gray-500 hover:border-[#ffffff30] hover:text-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((tip, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className="relative rounded-xl border border-[#ffffff08] bg-[#ffffff03] p-4 group hover:border-[#00f0ff]/30 hover:bg-[#00f0ff]/3 transition-all duration-300"
            >
              {/* Number badge */}
              <div className="absolute -top-2.5 -left-2.5 w-6 h-6 rounded-full bg-[#050510] border border-[#00f0ff]/30 flex items-center justify-center text-[10px] font-mono text-[#00f0ff]">
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Category tag */}
              {tip.category && (
                <span className="inline-block text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md border border-[#bf00ff]/20 bg-[#bf00ff]/5 text-[#bf00ff] mb-3">
                  {tip.category}
                </span>
              )}

              <p className="text-gray-300 text-sm leading-relaxed">{tip.tip || tip}</p>

              {/* Impact */}
              {tip.impact && (
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-600">Impact:</span>
                  {["high", "medium", "low"].map((level) => (
                    <span
                      key={level}
                      className={`w-2 h-2 rounded-full ${
                        (tip.impact === "high" && ["high", "medium", "low"].indexOf(level) >= 0) ||
                        (tip.impact === "medium" && ["medium", "low"].indexOf(level) >= 0) ||
                        (tip.impact === "low" && level === "low")
                          ? tip.impact === "high" ? "bg-[#00ff9f]" : tip.impact === "medium" ? "bg-amber-400" : "bg-gray-600"
                          : "bg-gray-700"
                      }`}
                    />
                  ))}
                  <span className="text-[10px] capitalize" style={{ color: tip.impact === "high" ? "#00ff9f" : tip.impact === "medium" ? "#f59e0b" : "#6b7280" }}>
                    {tip.impact}
                  </span>
                </div>
              )}

              {/* Copy button */}
              <button
                onClick={() => handleCopy(tip.tip || tip, i)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg bg-[#ffffff08] hover:bg-[#00f0ff]/15 flex items-center justify-center transition-all duration-200"
              >
                {copiedIndex === i ? (
                  <svg className="w-3.5 h-3.5 text-[#00ff9f]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                )}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-gray-600">
          <p>No tips in this category.</p>
        </div>
      )}
    </motion.div>
  );
}