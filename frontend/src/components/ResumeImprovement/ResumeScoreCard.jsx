// frontend/components/ResumeImprovement/ResumeScoreCard
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const scoreColor = (score) => {
  if (score >= 80) return { stroke: "#00ff9f", glow: "#00ff9f", label: "Excellent", textColor: "text-[#00ff9f]" };
  if (score >= 60) return { stroke: "#00f0ff", glow: "#00f0ff", label: "Good", textColor: "text-[#00f0ff]" };
  if (score >= 40) return { stroke: "#f59e0b", glow: "#f59e0b", label: "Average", textColor: "text-amber-400" };
  return { stroke: "#ef4444", glow: "#ef4444", label: "Poor", textColor: "text-red-400" };
};

export default function ResumeScoreCard({ score = 0, weakSections = [] }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const { stroke, glow, label, textColor } = scoreColor(score);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;

  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0;
      const step = Math.ceil(score / 60);
      const interval = setInterval(() => {
        start += step;
        if (start >= score) { setAnimatedScore(score); clearInterval(interval); }
        else setAnimatedScore(start);
      }, 20);
    }, 300);
    return () => clearTimeout(timeout);
  }, [score]);

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
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10" style={{ background: `radial-gradient(circle at top right, ${glow}, transparent 70%)` }} />

      <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-6">ATS Score</div>

      {/* Circle */}
      <div className="flex justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            {/* Track */}
            <circle cx="100" cy="100" r={radius} fill="none" stroke="#ffffff08" strokeWidth="10" />
            {/* Progress */}
            <motion.circle
              cx="100" cy="100" r={radius}
              fill="none"
              stroke={stroke}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              style={{ filter: `drop-shadow(0 0 8px ${glow})` }}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - progress }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-black ${textColor}`}>{animatedScore}</span>
            <span className="text-gray-500 text-sm">/100</span>
            <span className={`text-xs font-mono uppercase tracking-wider mt-1 ${textColor}`}>{label}</span>
          </div>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="space-y-2">
        {[
          { label: "Format & Structure", val: Math.min(100, score + 5) },
          { label: "Keyword Match", val: Math.max(0, score - 10) },
          { label: "Readability", val: Math.min(100, score + 12) },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">{item.label}</span>
              <span style={{ color: stroke }}>{item.val}%</span>
            </div>
            <div className="h-1 rounded-full bg-[#ffffff08]">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${stroke}80, ${stroke})`, boxShadow: `0 0 6px ${glow}` }}
                initial={{ width: 0 }}
                animate={{ width: `${item.val}%` }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </div>
          </div>
        ))}
      </div>

    
{/* Weak sections */}
{weakSections.length > 0 && (
  <div className="mt-5 pt-4 border-t border-[#ffffff08]">
    
    <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">
      Weak Sections
    </p>

    <div className="flex flex-col gap-2">

      {weakSections.map((s, index) => (

        <div
          key={index}
          className="rounded-lg bg-red-500/10 border border-red-500/20 p-3"
        >

          {/* Section Name */}
          <p className="text-red-400 text-xs font-semibold">
            {s.section}
          </p>

          {/* Problem */}
          <p className="text-gray-400 text-[11px] mt-1">
            {s.problem}
          </p>

          {/* Recommendation */}
          <p className="text-[#00f0ff] text-[11px] mt-2">
            {s.recommendation}
          </p>

        </div>

      ))}

    </div>
  </div>
)}


    </motion.div>
  );
}