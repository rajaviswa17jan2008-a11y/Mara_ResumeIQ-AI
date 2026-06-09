// frontend/components/Portfolio/AboutSection.jsx
import React from "react";
import { motion } from "framer-motion";

export default function AboutSection({ data = {}, accentColor = "#00f0ff" }) {
  const stats = [
  {
    label: "Projects",
    value: data.projects?.length || 0,
  },
  {
    label: "Experience",
    value: data.experience?.length || 0,
  },
  {
    label: "Technologies",
    value:
      (data.skills?.technical?.length || 0) +
      (data.skills?.soft?.length || 0),
  },
];

  return (
    <section id="about" className="pt-0 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-3 mb-10">
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: accentColor }}>01</span>
            <div className="h-px flex-1 opacity-20" style={{ background: accentColor }} />
            <h2 className="text-3xl font-extrabold text-white">About Me</h2>
            <div className="h-px flex-1 opacity-20" style={{ background: accentColor }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
      <div className="space-y-3 mb-6">

  <div className="p-4 rounded-xl border border-white/5 bg-white/2">

    <p className="text-[10px] text-gray-500 uppercase tracking-wide">
      About Me
    </p>

    <p className="text-sm text-gray-300 mt-3 leading-relaxed">
        {data.personal?.aboutMe ||
        "No About Information Available"}
    </p>

  </div>

</div>
              <div className="grid grid-cols-3 gap-4">
                {stats.map((s) => (
                  <div key={s.label} className="text-center p-4 rounded-xl border border-white/5" style={{ background: `${accentColor}08` }}>
                    <p className="text-2xl font-black mb-1" style={{ color: accentColor }}>{s.value}</p>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact info */}
            <div className="space-y-3">
              {[
                { icon: "📧", label: "Email", val: data.personal?.email },
                { icon: "📱", label: "Phone", val: data.personal?.phone },
                { icon: "🌐", label: "Website", val: data.personal?.website },
                { icon: "💼", label: "LinkedIn", val: data.personal?.linkedin },
                { icon: "🐙", label: "GitHub", val: data.personal?.github },
              ].filter((i) => i.val).map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/2">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">{item.label}</p>
                    <p className="text-sm text-gray-300 truncate">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}