// frontend/components/ResumeImprovement/MissingKeywords.jsx
import React from "react";
import { motion } from "framer-motion";

const importanceColor = {
  critical: "border-red-500/40 bg-red-500/10 text-red-400",
  important: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  nice: "border-[#00f0ff]/30 bg-[#00f0ff]/5 text-[#00f0ff]",
};

export default function MissingKeywords({ keywords = [] }) {
  const critical =
  keywords.filter(
    (k) => k?.importance === "critical"
  );
  const important = keywords.filter((k) => k.importance === "important");
  const nice = keywords.filter((k) => k.importance === "nice");

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Missing Keywords</div>
          <p className="text-white font-semibold">{keywords.length} keywords to add</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
        </div>
      </div>

      {[
        { label: "Critical", items: critical, importance: "critical" },
        { label: "Important", items: important, importance: "important" },
        { label: "Nice to Have", items: nice, importance: "nice" },
      ].map(({ label, items, importance }) =>
        items.length > 0 ? (
          <div key={label} className="mb-4">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">{label}</p>
            <div className="flex flex-wrap gap-2">
              {items.map((kw, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-mono cursor-default hover:scale-105 transition-transform ${importanceColor[importance]}`}
                  title={kw.context || ""}
                >
                  {kw.keyword || kw}
                </motion.span>
              ))}
            </div>
          </div>
        ) : null
      )}

      {keywords.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          <svg className="w-8 h-8 mx-auto mb-2 text-[#00ff9f]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-[#00ff9f] text-sm">All key terms are present!</p>
        </div>
      )}

      {/* Tip */}
      <div className="mt-4 pt-4 border-t border-[#ffffff08] flex gap-2 text-xs text-gray-500">
        <svg className="w-4 h-4 flex-shrink-0 text-[#00f0ff] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        Integrate these naturally into your experience descriptions to improve ATS ranking.
      </div>
    </motion.div>
  );
}