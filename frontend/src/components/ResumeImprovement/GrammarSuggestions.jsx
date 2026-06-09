// frontend/components/ResumeImprovement/GrammarSuggestions.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GrammarSuggestions({ suggestions = [] }) {
  const [dismissed, setDismissed] = useState([]);

  const active = suggestions.filter((_, i) => !dismissed.includes(i));

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
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Grammar & Style</div>
          <p className="text-white font-semibold">{active.length} suggestions</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#bf00ff]/10 border border-[#bf00ff]/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-[#bf00ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </div>
      </div>

      <div className="space-y-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
        <AnimatePresence>
          {active.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 text-gray-600">
              <svg className="w-8 h-8 mx-auto mb-2 text-[#00ff9f]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-[#00ff9f] text-sm">Grammar looks great!</p>
            </motion.div>
          ) : (
            suggestions.map((sug, i) =>
              !dismissed.includes(i) ? (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-[#bf00ff]/20 bg-[#bf00ff]/5 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-[#bf00ff] uppercase tracking-wider mb-1">{sug.type || "Suggestion"}</p>
                      {/* Original */}
                      <div className="mb-2">
                        <span className="text-[10px] text-gray-600 uppercase tracking-wide">Original</span>
                        <p className="text-sm text-gray-400 line-through mt-0.5">{sug.original}</p>
                      </div>
                      {/* Improved */}
                      <div>
                        <span className="text-[10px] text-[#00ff9f] uppercase tracking-wide">Improved</span>
                        <p className="text-sm text-white mt-0.5">{sug.improved || sug.suggestion}</p>
                      </div>
                      {sug.reason && <p className="text-xs text-gray-600 mt-2 italic">{sug.reason}</p>}
                    </div>
                    <button
                      onClick={() => setDismissed([...dismissed, i])}
                      className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ffffff08] hover:bg-[#00ff9f]/20 hover:text-[#00ff9f] text-gray-600 flex items-center justify-center transition-all duration-200 text-sm"
                    >✓</button>
                  </div>
                </motion.div>
              ) : null
            )
          )}
        </AnimatePresence>
      </div>

      {dismissed.length > 0 && (
        <button onClick={() => setDismissed([])} className="mt-3 text-xs text-gray-600 hover:text-gray-400 transition-colors">
          Restore {dismissed.length} dismissed
        </button>
      )}
    </motion.div>
  );
}