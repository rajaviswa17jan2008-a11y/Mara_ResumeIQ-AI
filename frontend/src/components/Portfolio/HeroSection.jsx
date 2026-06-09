// frontend/components/Portfolio/HeroSection.jsx
import React from "react";
import { motion } from "framer-motion";

export default function HeroSection({ data = {}, accentColor = "#00f0ff" }) {
  const personal = data.personal || {};
  console.log("HERO DATA =", data)
  console.log("IMAGE =", data.personal?.image);
  return (
   <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">

      {/* Background glow */}
      
          <div
          data-export-ignore="true"
  className="absolute inset-0 pointer-events-none"
>
  
  <div
    
  className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[120px] opacity-20"
  style={{ background: accentColor }}
/>
</div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10">
        
         {/* Avatar */}

<motion.div
  whileHover={{
    scale: 1.08,
    rotate: 3,
  }}
  className="mx-auto mb-6 w-40 h-40 rounded-full overflow-hidden border-2"
  style={{
    borderColor: accentColor,
    boxShadow: `0 0 30px ${accentColor}60`,
  }}
>
  
  <img
    src={
      data.personal?.image ||
      "https://via.placeholder.com/300"
    }
    alt={data.personal?.name}
    className="w-full h-full object-cover"
  />
</motion.div>


        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-5xl md:text-7xl font-extrabold text-white mb-3">
          {personal.name || "Your Name"}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-xl md:text-2xl font-light mb-6" style={{ color: accentColor }}>
        {personal.title || "Your Professional Title"}
        </motion.p>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-gray-400 text-base max-w-xl mx-auto mb-8 leading-relaxed">
          {personal.bio || "A passionate developer building amazing digital experiences."}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-wrap justify-center gap-4">
          {personal.github && (
            <a href={personal.github} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-xl font-semibold text-black text-sm transition-all hover:scale-105" style={{ background: accentColor }}>
              GitHub
            </a>
          )}
          {personal.linkedin && (
            <a href={personal.linkedin} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-xl font-semibold text-sm border transition-all hover:scale-105" style={{ borderColor: `${accentColor}50`, color: accentColor }}>
              LinkedIn
            </a>
          )}
          {personal.email && (
            <a href={`mailto:${personal.email}`} className="px-6 py-3 rounded-xl font-semibold text-sm border border-white/10 text-white transition-all hover:border-white/30 hover:scale-105">
              Contact Me
            </a>
          )}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </motion.div>
    </section>
  );
}