// frontend/components/Portfolio/TemplateSelector.jsx
import React from "react";
import { motion } from "framer-motion";

const templates = [
  { id: "cyberpunk", label: "Cyberpunk", color: "#00f0ff", bg: "#050510" },
  { id: "glassmorphism", label: "Glassmorphism", color: "#bf00ff", bg: "#1e1b4b" },
  { id: "minimal", label: "Minimal", color: "#ffffff", bg: "#f5f5f5" },
  { id: "futuristic", label: "Futuristic", color: "#00ff9f", bg: "#020818" },
];

export default function TemplateSelector({ active, onChange }) {
  return (
    <div className="space-y-2">
      {templates.map((t) => (
        <motion.button
          key={t.id}
          onClick={() => onChange(t.id)}
          whileHover={{ x: 4 }}
          className={`w-full text-left rounded-xl border p-3 transition-all duration-200 ${
            active === t.id ? "border-current bg-current/10" : "border-[#ffffff08] bg-[#ffffff02] hover:border-[#ffffff15]"
          }`}
          style={{ color: active === t.id ? t.color : "#9ca3af" }}
        >
          <div className="flex items-center gap-3">
            {/* Color swatch */}
            <div className="w-8 h-8 rounded-lg flex-shrink-0 border border-white/10 overflow-hidden" style={{ background: t.bg }}>
              <div className="w-full h-full opacity-60" style={{ background: `linear-gradient(135deg, ${t.color}50, transparent)` }} />
            </div>
            <div>
              <p className="text-sm font-semibold">{t.label}</p>
              <div className="w-4 h-1 rounded-full mt-1" style={{ background: active === t.id ? t.color : "#374151" }} />
            </div>
            {active === t.id && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto w-4 h-4 rounded-full flex items-center justify-center" style={{ background: t.color }}>
                <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </motion.div>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
}