// frontend/templates/MinimalTemplate.jsx
import React from "react";
import HeroSection from "../components/Portfolio/HeroSection";
import AboutSection from "../components/Portfolio/AboutSection";
import SkillsSection from "../components/Portfolio/SkillsSection";
import ProjectsSection from "../components/Portfolio/ProjectsSection";
import ContactSection from "../components/Portfolio/ContactSection";

export default function MinimalTemplate({ data = {} }) {
  const accent = "#111111";
              const skills = [
  ...(data.skills?.technical || []),
  ...(data.skills?.soft || []),
];
  return (
    <div className="bg-white text-gray-900 font-sans relative">
      {/* Nav */}
       {!data?.previewMode && (
<nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-8 py-5 flex items-center justify-between">
          <span className="font-black text-lg tracking-tight text-black">{data.name || "Portfolio"}</span>
          <div className="hidden md:flex gap-8 text-sm text-gray-400">
            {["about", "skills", "projects", "contact"].map((s) => (
              <a key={s} href={`#${s}`} className="hover:text-black transition-colors capitalize">{s}</a>
            ))}
          </div>
        </div>
      </nav>
          )}
      {/* Override section colors for light theme */}
      <style>{`
        .minimal-override section { background: white !important; }
        .minimal-override h2, .minimal-override h1, .minimal-override h3 { color: #111 !important; }
        .minimal-override p { color: #555 !important; }
      `}</style>

      <div className="pt-16">
        {/* Custom hero for minimal */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <div className="w-24 h-24 rounded-full mx-auto mb-8 bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-4xl font-black text-gray-700">
            {(data.personal?.name || "?")[0]}
          </div>
         <h1 className="text-6xl font-black text-gray-900 mb-3">
  {data.copy?.heroHeadline || data.personal?.name}
</h1>
          <p className="text-2xl text-gray-400 font-light mb-6">
  {data.copy?.heroSubheadline || data.personal?.title}
</p>
         <p className="text-gray-500 max-w-xl mx-auto leading-relaxed mb-8">
  {data.copy?.aboutParagraph1 ||
    "Passionate developer building amazing digital experiences."}
</p>
          <div className="flex gap-4 flex-wrap justify-center">
            {data.email && <a href={`mailto:${data.email}`} className="px-6 py-3 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-black transition-colors">Contact</a>}
            {data.github && <a href={data.github} className="px-6 py-3 rounded-full border border-gray-200 text-gray-600 text-sm hover:border-gray-400 transition-colors">GitHub</a>}
            {data.linkedin && <a href={data.linkedin} className="px-6 py-3 rounded-full border border-gray-200 text-gray-600 text-sm hover:border-gray-400 transition-colors">LinkedIn</a>}
          </div>
        </section>

        <div className="max-w-4xl mx-auto">
          {/* About */}
          <section id="about" className="py-20 px-8 border-t border-gray-100">
  <h2 className="text-3xl font-black text-gray-900 mb-8">About</h2>

  <p className="text-gray-500 text-lg leading-relaxed mb-4">
    {data.copy?.aboutParagraph1}
  </p>

  <p className="text-gray-500 text-lg leading-relaxed">
    {data.copy?.aboutParagraph2}
  </p>
</section>
          {/* Skills */}
          <section id="skills" className="py-20 px-8 border-t border-gray-100">
  <h2 className="text-3xl font-black text-gray-900 mb-8">
    Skills
  </h2>

  <div className="flex flex-wrap gap-3">
    {skills.map((skill, index) => (
      <span
        key={index}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
      >
        {typeof skill === "object"
          ? skill.name
          : skill}
      </span>
    ))}
  </div>
</section>
          {/* Projects */}
          <section id="projects" className="py-20 px-8 border-t border-gray-100">
            <h2 className="text-3xl font-black text-gray-900 mb-8">Projects</h2>
            <div className="space-y-6">
              {(data.projects || []).map((p, i) => (
                <div key={i} className="p-6 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{p.name}</h3>
                    {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-700 text-sm">↗</a>}
                  </div>
                  <p className="text-gray-500 text-sm mb-3">{p.description}</p>
                  {p.tech && <div className="flex flex-wrap gap-1">{p.tech.split(",").map((t) => <span key={t} className="text-xs bg-gray-50 border border-gray-200 text-gray-500 px-2 py-0.5 rounded">{t.trim()}</span>)}</div>}
                </div>
              ))}
            </div>
          </section>
          {/* Contact */}
          <section id="contact" className="py-20 px-8 border-t border-gray-100 text-center">
            <h2 className="text-3xl font-black text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-gray-500 mb-8">Open to opportunities and collaborations.</p>
            {data.email && <a href={`mailto:${data.email}`} className="inline-block px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-black transition-colors">{data.email}</a>}
          </section>
        </div>
      </div>

      <footer className="py-6 text-center border-t border-gray-100">
        <p className="text-gray-300 text-xs">{data.name || "Portfolio"} — AI Portfolio Generator</p>
      </footer>
    </div>
  );
}