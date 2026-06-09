// frontend/components/Portfolio/PortfolioLoader.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const steps = [
  "Crafting your hero section...",
  "Styling your portfolio layout...",
  "Organizing your projects...",
  "Adding skill badges...",
  "Finalizing your portfolio...",
];

export default function PortfolioLoader() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setStep((s) => (s + 1) % steps.length), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#050510]/90 backdrop-blur-md z-50 flex flex-col items-center justify-center"
    >
      {/* Orbital animation */}
      <div className="relative w-32 h-32 mb-8">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360 * (i % 2 === 0 ? 1 : -1) }}
            transition={{ duration: 2 + i, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-transparent"
            style={{
              borderTopColor: i === 0 ? "#00f0ff" : i === 1 ? "#bf00ff" : "#00ff9f",
              inset: `${i * 12}px`,
            }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center text-3xl">⚡</div>
      </div>

      <h3 className="text-white font-bold text-xl mb-2">Building Your Portfolio</h3>
      <motion.p key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-gray-400 text-sm">
        {steps[step]}
      </motion.p>

      {/* Progress bar */}
      <div className="mt-6 w-48 h-1 bg-[#ffffff10] rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
          className="h-full rounded-full bg-gradient-to-r from-[#00f0ff] to-[#bf00ff]"
        />
      </div>
    </motion.div>
  );
}