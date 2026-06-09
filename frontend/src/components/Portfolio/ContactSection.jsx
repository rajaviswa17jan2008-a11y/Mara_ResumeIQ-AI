// frontend/components/Portfolio/ContactSection.jsx
import React from "react";
import { motion } from "framer-motion";

export default function ContactSection({ data = {}, accentColor = "#00f0ff" }) {
 const personal = data.personal || {};
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-10">
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: accentColor }}>04</span>
            <div className="h-px flex-1 opacity-20" style={{ background: accentColor }} />
            <h2 className="text-3xl font-extrabold text-white">Contact</h2>
            <div className="h-px flex-1 opacity-20" style={{ background: accentColor }} />
          </div>

          <p className="text-gray-400 mb-10 text-lg">
            I'm always open to new opportunities and collaborations. Let's build something great together.
          </p>

          {data.email && (
            <a
              href={`mailto:${data.email}`}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-black text-lg mb-8 hover:scale-105 transition-all duration-300"
              style={{ background: accentColor, boxShadow: `0 0 40px ${accentColor}40` }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              {data.email}
            </a>
          )}

          
          <div className="space-y-4 mt-8">
  {personal.phone && (
    <div className="p-4 rounded-xl border border-white/10">
      📱 {personal.phone}
    </div>
  )}

  {personal.github && (
    <a
      href={personal.github}
      target="_blank"
      rel="noreferrer"
      className="block p-4 rounded-xl border border-white/10 hover:border-cyan-400"
    >
      🐙 GitHub
    </a>
  )}

  {personal.linkedin && (
    <a
      href={personal.linkedin}
      target="_blank"
      rel="noreferrer"
      className="block p-4 rounded-xl border border-white/10 hover:border-cyan-400"
    >
      💼 LinkedIn
    </a>
  )}

  {personal.website && (
    <a
      href={personal.website}
      target="_blank"
      rel="noreferrer"
      className="block p-4 rounded-xl border border-white/10 hover:border-cyan-400"
    >
      🌐 Website
    </a>
  )}
</div>

        </motion.div>
      </div>
    </section>
  );
}