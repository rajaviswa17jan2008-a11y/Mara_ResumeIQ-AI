// frontend/components/ResumeImprovement/ImprovementLoader.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const steps = [
  { label: "Parsing resume structure...", icon: "📄", color: "#00f0ff" },
  { label: "Running ATS compatibility check...", icon: "🤖", color: "#bf00ff" },
  { label: "Extracting keyword patterns...", icon: "🔍", color: "#00ff9f" },
  { label: "Analyzing grammar & tone...", icon: "✍️", color: "#f59e0b" },
  { label: "Generating AI improvement tips...", icon: "⚡", color: "#00f0ff" },
  { label: "Finalizing recommendations...", icon: "✅", color: "#00ff9f" },
];

export default function ImprovementLoader() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCompletedSteps((prev) => [...prev, currentStep]);
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 900);
    return () => clearInterval(interval);
  }, [currentStep]);

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
      <div className="flex flex-col items-center mb-8">
        {/* Spinning ring */}
        <div className="relative w-20 h-20 mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{ borderTopColor: "#00f0ff", borderRightColor: "#bf00ff" }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border-2 border-transparent"
            style={{ borderTopColor: "#00ff9f", borderLeftColor: "#f59e0b" }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">
            {steps[currentStep].icon}
          </div>
        </div>
        <p className="text-white font-semibold text-lg">Analyzing Your Resume</p>
        <p className="text-gray-500 text-sm mt-1">Our AI is processing every detail...</p>
      </div>

      {/* Steps */}
      <div className="max-w-md mx-auto space-y-3">
        {steps.map((step, i) => {
          const isCompleted = completedSteps.includes(i);
          const isCurrent = i === currentStep;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: isCompleted || isCurrent ? 1 : 0.3 }}
              className="flex items-center gap-3"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  isCompleted ? "bg-[#00ff9f]/20 border border-[#00ff9f]" : isCurrent ? "border-2 border-[#00f0ff]" : "border border-[#ffffff15]"
                }`}
              >
                {isCompleted ? (
                  <svg className="w-3.5 h-3.5 text-[#00ff9f]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                ) : isCurrent ? (
                  <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 rounded-full bg-[#00f0ff]" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-gray-700" />
                )}
              </div>
              <span className={`text-sm transition-colors duration-300 ${isCompleted ? "text-[#00ff9f]" : isCurrent ? "text-white" : "text-gray-600"}`}>
                {step.label}
              </span>
              {isCurrent && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="text-xs font-mono text-[#00f0ff] ml-auto"
                >
                  processing...
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Skeleton cards preview */}
      <div className="grid grid-cols-3 gap-4 mt-8 opacity-30">
        {[1, 2, 3].map((n) => (
          <div key={n} className="rounded-xl border border-[#ffffff10] bg-[#ffffff03] p-4 space-y-2">
            <div className="h-2 bg-[#ffffff10] rounded animate-pulse w-2/3" />
            <div className="h-2 bg-[#ffffff10] rounded animate-pulse" />
            <div className="h-2 bg-[#ffffff10] rounded animate-pulse w-4/5" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}