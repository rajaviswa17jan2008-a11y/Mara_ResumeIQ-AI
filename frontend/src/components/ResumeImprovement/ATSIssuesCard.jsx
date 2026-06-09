// frontend/components/ResumeImprovement/ATSIssuesCard
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const severityConfig = {
  high: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", dot: "bg-red-400", label: "High" },
  medium: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", dot: "bg-amber-400", label: "Medium" },
  low: { color: "text-[#00f0ff]", bg: "bg-[#00f0ff]/10", border: "border-[#00f0ff]/20", dot: "bg-[#00f0ff]", label: "Low" },
};

export default function ATSIssuesCard({ issues = [] }) {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const filtered = filter === "all" ? issues : issues.filter((i) => i.severity === filter);
  const counts = { high: issues.filter((i) => i.severity === "high").length, medium: issues.filter((i) => i.severity === "medium").length, low: issues.filter((i) => i.severity === "low").length };

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
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">ATS Issues</div>
          <p className="text-white font-semibold">{issues.length} issues found</p>
        </div>
        {/* Severity pills */}
        <div className="flex gap-2">
          {[["all", "#ffffff40", "All"], ["high", "#ef4444", `${counts.high} High`], ["medium", "#f59e0b", `${counts.medium} Med`], ["low", "#00f0ff", `${counts.low} Low`]].map(([val, color, lbl]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`text-xs px-3 py-1 rounded-full border transition-all duration-200 ${filter === val ? "text-black font-bold" : "text-gray-400 bg-transparent"}`}
              style={filter === val ? { background: color, borderColor: color } : { borderColor: `${color}40` }}
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 text-gray-600">
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              No issues in this category
            </motion.div>
          ) : (
            filtered.map((issue, i) => {
              console.log("ATS ISSUE =", issue);
              const cfg = severityConfig[issue.severity] || severityConfig.low;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-xl border ${cfg.border} ${cfg.bg} p-3 cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={() => setExpanded(expanded === i ? null : i)}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                       <p className={`text-sm font-medium ${cfg.color}`}>
  {issue.title || issue.section || issue.issue || "ATS Issue"}
</p>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.bg} ${cfg.color} border ${cfg.border}`}>{cfg.label}</span>
                      </div>
                      <AnimatePresence>
                        {expanded === i && (
                          <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="text-gray-400 text-xs mt-2 overflow-hidden">
                           {
  issue.description ||
  issue.problem ||
  issue.recommendation ||
  issue.fix
}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <svg className={`w-4 h-4 flex-shrink-0 text-gray-600 transition-transform ${expanded === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}