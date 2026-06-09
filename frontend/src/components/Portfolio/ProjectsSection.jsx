// frontend/components/Portfolio/ProjectsSection.jsx
import React from "react";
import { motion } from "framer-motion";

export default function ProjectsSection({ data = {}, accentColor = "#00f0ff" }) {
  const projects = data.projects || [];
  const personalWebsite =
  data.personal?.website || "";

  return (
    <section id="projects" className="py-24 px-6">

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">

      <div
        className="p-5 rounded-2xl border text-center backdrop-blur-md"
        style={{
          borderColor: `${accentColor}30`,
          background: `${accentColor}08`,
        }}
      >
        <h3 className="text-3xl font-bold">{projects.length}</h3>
        <p>Total Projects</p>
      </div>

      <div
        className="p-5 rounded-2xl border text-center backdrop-blur-md"
        style={{
          borderColor: `${accentColor}30`,
          background: `${accentColor}08`,
        }}
      >
        <h3 className="text-3xl font-bold">
          {
            [...new Set(
              projects.flatMap((p) =>
                Array.isArray(p.technologies)
                  ? p.technologies
                  : []
              )
            )].length
          }
        </h3>
        <p>Technologies</p>
      </div>

      <div
        className="p-5 rounded-2xl border text-center backdrop-blur-md"
        style={{
          borderColor: `${accentColor}30`,
          background: `${accentColor}08`,
        }}
      >
        <h3 className="text-3xl font-bold">100%</h3>
        <p>Passion</p>
      </div>

    </div>


      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-10">
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: accentColor }}>03</span>
            <div className="h-px flex-1 opacity-20" style={{ background: accentColor }} />
            <h2 className="text-3xl font-extrabold text-white">Projects</h2>
            <div className="h-px flex-1 opacity-20" style={{ background: accentColor }} />
          </div>

          {projects.length === 0 ? (
            <p className="text-gray-500 text-center py-16">No projects added yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj, i) => (
                <motion.div
                  key={i}
                   whileHover={{
  y: -12,
  scale: 1.03,
  boxShadow: `0 20px 40px ${accentColor}15`
}}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="
relative
rounded-3xl
border
p-7
backdrop-blur-md
overflow-hidden
group
"
                  style={{ borderColor: `${accentColor}20`, background: `${accentColor}05` }}
                >
                  {/* Top accent line */}
                  <div
  className="
  absolute
  -top-20
  -right-20
  w-40
  h-40
  rounded-full
  blur-3xl
  opacity-10
  group-hover:opacity-30
  transition-all
  duration-500
  "
  style={{
    background: accentColor,
  }}
/>
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />

                 <div className="flex items-center justify-between gap-3 mb-4">

  <div className="flex items-center gap-3">

    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center"
      style={{
        background: `${accentColor}15`,
        color: accentColor,
      }}
    >
      🚀
    </div>

    <h3 className="text-lg font-bold text-white">
      {proj.name || "Project Name"}
    </h3>

  </div>
                    {(proj.githubUrl || proj.liveUrl) && (
  <a
 href={
  proj.liveUrl ||
  proj.githubUrl ||
  personalWebsite
}
 target="_blank"
 rel="noreferrer"
 className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 hover:border-current transition-all" style={{ color: accentColor }}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    )}
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{proj.description || "Project description goes here."}</p>
  <a
  href={proj.liveUrl || proj.githubUrl}
  target="_blank"
  rel="noreferrer"
  className="inline-block mt-4 px-4 py-2 rounded-lg"
  style={{
    background: `${accentColor}15`,
    color: accentColor,
    border: `1px solid ${accentColor}30`,
  }}
>
  🌐 View Project
</a>

                  {proj.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies.map((t) => (
                        <motion.span
  key={t}
  whileHover={{
    scale: 1.1,
  }} className="text-[11px] px-2 py-0.5 rounded-md font-mono" style={{ background: `${accentColor}10`, color: accentColor, border: `1px solid ${accentColor}20` }}>
                          {t.trim()}
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {/* Number watermark */}
                  <div className="absolute bottom-4 right-5 text-5xl font-black opacity-10 group-hover:opacity-20 transition-all text-white pointer-events-none select-none">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}