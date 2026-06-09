/**
 * Glassmorphism Portfolio Template
 * Frosted glass surfaces, blurred backgrounds, soft gradients.
 * Place at: backend/templates/glassmorphism/template.js
 */

const {
  wrapHTML,
  escapeHtml
} = require("../utils/templateHelpers");

module.exports = function glassmorphismTemplate(data) {
  const { personal, skills, experience, projects, education, copy, meta } = data;
  const P = meta.primaryColor || "#6366f1";
  const A = meta.accentColor  || "#a78bfa";

  const styles = `
    body { background: #0a0a1a; color: #e2e8f0; font-family: 'Inter', sans-serif; overflow-x: hidden; }

    /* ── Background orbs ── */
    .bg-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
    .orb { position: absolute; border-radius: 50%; filter: blur(80px); animation: drift 20s ease-in-out infinite; }
    .orb-1 { width: 600px; height: 600px; background: radial-gradient(${P}44, transparent); top: -200px; left: -200px; animation-delay: 0s; }
    .orb-2 { width: 500px; height: 500px; background: radial-gradient(${A}33, transparent); bottom: -100px; right: -100px; animation-delay: -7s; }
    .orb-3 { width: 400px; height: 400px; background: radial-gradient(#06b6d466, transparent); top: 40%; left: 60%; animation-delay: -14s; }

    @keyframes drift { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-30px) scale(1.05)} 66%{transform:translate(-20px,20px) scale(0.95)} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
    @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
    .animate-on-scroll { opacity:0; transform:translateY(30px); transition:all 0.8s cubic-bezier(0.16,1,0.3,1); }
    .animate-on-scroll.visible { opacity:1; transform:none; }

    /* ── Glass mixin ── */
    .glass { background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); }
    .glass-strong { background: rgba(255,255,255,0.08); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.15); }

    /* ── Nav ── */
    nav { position: fixed; top: 0; width: 100%; z-index: 100; padding: 20px 60px; display: flex; justify-content: space-between; align-items: center; background: rgba(10,10,26,0.7); backdrop-filter: blur(30px); border-bottom: 1px solid rgba(255,255,255,0.07); }
    .nav-logo { font-weight: 800; font-size: 1.3rem; background: linear-gradient(135deg, ${P}, ${A}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .nav-links { display: flex; gap: 36px; list-style: none; }
    .nav-links a { color: rgba(255,255,255,0.5); text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.3s; }
    .nav-links a:hover { color: #fff; }

    /* ── Hero ── */
    .hero { min-height: 100vh; display: flex; align-items: center; padding: 100px 60px 60px; position: relative; z-index: 1; }
    .hero-card { max-width: 800px; }
    .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 20px; border-radius: 999px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-bottom: 32px; }
    .hero-badge-dot { width: 8px; height: 8px; border-radius: 50%; background: ${P}; box-shadow: 0 0 8px ${P}; animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.3);opacity:0.7} }
    .hero-name { font-size: clamp(3rem,7vw,5.5rem); font-weight: 900; line-height: 1.05; margin-bottom: 16px; letter-spacing: -2px; }
    .hero-name .gradient-word { background: linear-gradient(135deg, ${P}, ${A}, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-size: 200%; animation: shimmer 4s linear infinite; }
    .hero-title { font-size: 1.3rem; color: rgba(255,255,255,0.5); margin-bottom: 24px; font-weight: 400; }
    .hero-desc { color: rgba(255,255,255,0.4); font-size: 1rem; line-height: 1.8; max-width: 580px; margin-bottom: 48px; }
    .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; }
    .btn-glass { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 0.9rem; text-decoration: none; transition: all 0.3s; cursor: pointer; }
    .btn-filled { background: linear-gradient(135deg, ${P}, ${A}); color: #fff; box-shadow: 0 8px 32px ${P}44; }
    .btn-filled:hover { transform: translateY(-2px); box-shadow: 0 16px 40px ${P}66; }
    .btn-outline { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.8); backdrop-filter: blur(10px); }
    .btn-outline:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.25); }

    /* ── Sections ── */
    section { padding: 100px 60px; position: relative; z-index: 1; }
    .section-label { font-size: 0.75rem; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: ${P}; margin-bottom: 8px; }
    .section-title { font-size: 2.5rem; font-weight: 800; margin-bottom: 16px; letter-spacing: -1px; }
    .section-sub { color: rgba(255,255,255,0.4); font-size: 0.95rem; margin-bottom: 56px; }

    /* ── Skills ── */
    .skills-cloud { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 48px; }
    .skill-tag { padding: 10px 20px; border-radius: 999px; font-size: 0.85rem; font-weight: 500; transition: all 0.3s; cursor: default; }
    .skill-tag:hover { transform: translateY(-2px); }
    .skills-bars { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
    .skill-bar-item { padding: 16px 20px; border-radius: 12px; }
    .skill-bar-header { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.85rem; }
    .skill-bar-name { font-weight: 600; color: rgba(255,255,255,0.85); }
    .skill-bar-pct { color: ${P}; font-weight: 700; }
    .skill-track { height: 4px; background: rgba(255,255,255,0.08); border-radius: 999px; overflow: hidden; }
    .skill-progress { height: 100%; background: linear-gradient(90deg, ${P}, ${A}); border-radius: 999px; }

    /* ── Experience ── */
    .exp-grid { display: flex; flex-direction: column; gap: 24px; }
    .exp-card { border-radius: 20px; padding: 32px; transition: all 0.3s; }
    .exp-card:hover { transform: translateY(-4px); border-color: rgba(${P.replace('#','')},0.3) !important; }
    .exp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; flex-wrap: wrap; gap: 8px; }
    .exp-role-title { font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
    .exp-company-name { font-size: 0.9rem; color: ${P}; font-weight: 600; }
    .exp-dates { font-size: 0.8rem; color: rgba(255,255,255,0.35); padding: 4px 12px; border-radius: 999px; background: rgba(255,255,255,0.06); white-space: nowrap; }
    .current-badge { background: ${P}22; color: ${P}; padding: 4px 12px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
    .exp-desc-text { color: rgba(255,255,255,0.5); line-height: 1.7; font-size: 0.9rem; margin-bottom: 16px; }
    .exp-list { list-style: none; }
    .exp-list li { color: rgba(255,255,255,0.5); font-size: 0.85rem; padding: 6px 0 6px 20px; position: relative; }
    .exp-list li::before { content: ''; position: absolute; left: 0; top: 50%; width: 6px; height: 6px; border-radius: 50%; background: ${P}; transform: translateY(-50%); }

    /* ── Projects ── */
    .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; }
    .project-card { border-radius: 20px; padding: 28px; transition: all 0.3s; position: relative; overflow: hidden; }
    .project-card::before { content: ''; position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(135deg, ${P}08, transparent 60%); pointer-events: none; }
    .project-card:hover { transform: translateY(-6px); box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
    .project-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 10px; }
    .project-desc-text { color: rgba(255,255,255,0.45); font-size: 0.85rem; line-height: 1.7; margin-bottom: 16px; }
    .project-impact-text { background: ${A}11; border-left: 3px solid ${A}; padding: 10px 14px; border-radius: 0 8px 8px 0; font-size: 0.8rem; color: ${A}; margin-bottom: 16px; }
    .tags-row { display: flex; flex-wrap: wrap; gap: 8px; }
    .tag { padding: 4px 12px; border-radius: 999px; font-size: 0.75rem; background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.5); border: 1px solid rgba(255,255,255,0.08); }
    .project-footer { display: flex; gap: 16px; margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); }
    .proj-link { font-size: 0.8rem; color: ${P}; text-decoration: none; font-weight: 600; transition: opacity 0.2s; }
    .proj-link:hover { opacity: 0.7; }

    /* ── Contact ── */
    .contact-wrapper { max-width: 600px; margin: 0 auto; text-align: center; }
    .contact-cards { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 40px; }
    .contact-card { display: flex; align-items: center; gap: 12px; padding: 16px 24px; border-radius: 14px; text-decoration: none; color: rgba(255,255,255,0.7); transition: all 0.3s; }
    .contact-card:hover { color: #fff; transform: translateY(-3px); }
    .contact-icon { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, ${P}33, ${A}22); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; color: ${P}; }

    /* ── Footer ── */
    footer { padding: 40px 60px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1; }
    .footer-text { color: rgba(255,255,255,0.25); font-size: 0.8rem; }

    @media(max-width: 768px) {
      nav { padding: 16px 24px; } .nav-links { display: none; }
      section { padding: 60px 24px; }
      .hero { padding: 80px 24px 40px; }
      .hero-name { font-size: 2.5rem; }
      .contact-grid { grid-template-columns: 1fr; }
      footer { flex-direction: column; gap: 12px; }
    }
  `;

  const skillsHTML = skills.featured
    .map((s, i) => {
      const colors = [`${P}22`, `${A}22`, "rgba(6,182,212,0.15)"];
      const borders = [`${P}44`, `${A}44`, "rgba(6,182,212,0.3)"];
      return `<span class="skill-tag glass" style="background:${colors[i % 3]};border:1px solid ${borders[i % 3]};color:rgba(255,255,255,0.8);">${escapeHtml(s)}</span>`;
    })
    .join("");

  const barsHTML = skills.technical
    .slice(0, 12)
    .map(
      (s) => `
      <div class="skill-bar-item glass animate-on-scroll">
        <div class="skill-bar-header">
          <span class="skill-bar-name">${escapeHtml(s.name)}</span>
          <span class="skill-bar-pct">${s.level}%</span>
        </div>
        <div class="skill-track"><div class="skill-progress" style="width:${s.level}%"></div></div>
      </div>`
    )
    .join("");

  const expHTML = experience
    .slice(0, 4)
    .map(
      (e) => `
      <div class="exp-card glass animate-on-scroll">
        <div class="exp-header">
          <div>
            <div class="exp-role-title">${escapeHtml(e.role)}</div>
            <div class="exp-company-name">${escapeHtml(e.company)}</div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
            <span class="exp-dates">${escapeHtml(e.duration)}</span>
            ${e.current ? `<span class="current-badge">Current</span>` : ""}
          </div>
        </div>
        ${e.description ? `<p class="exp-desc-text">${escapeHtml(e.description)}</p>` : ""}
        ${e.achievements.length ? `<ul class="exp-list">${e.achievements.map((a) => `<li>${escapeHtml(a)}</li>`).join("")}</ul>` : ""}
        ${e.technologies.length ? `<div class="tags-row" style="margin-top:16px">${e.technologies.slice(0,6).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>` : ""}
      </div>`
    )
    .join("");

  const projHTML = projects
    .slice(0, 6)
    .map(
      (p) => `
      <div class="project-card glass animate-on-scroll">
        <div class="project-title">${escapeHtml(p.name)}</div>
        ${p.description ? `<div class="project-desc-text">${escapeHtml(p.description)}</div>` : ""}
        ${p.impact ? `<div class="project-impact-text">${escapeHtml(p.impact)}</div>` : ""}
        ${p.technologies.length ? `<div class="tags-row">${p.technologies.slice(0,5).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>` : ""}
        ${p.githubUrl || p.liveUrl ? `
          <div class="project-footer">
            ${p.githubUrl ? `<a href="${escapeHtml(p.githubUrl)}" class="proj-link" target="_blank">↗ GitHub</a>` : ""}
            ${p.liveUrl   ? `<a href="${escapeHtml(p.liveUrl)}"   class="proj-link" target="_blank">↗ Live Demo</a>` : ""}
          </div>` : ""}
      </div>`
    )
    .join("");

  const body = `
    <div class="bg-orbs">
      <div class="orb orb-1"></div><div class="orb orb-2"></div><div class="orb orb-3"></div>
    </div>

    <nav>
      <div class="nav-logo">${escapeHtml(personal.name.split(" ")[0])}</div>
      <ul class="nav-links">
        <li><a href="#about">About</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>

    <section class="hero" id="home">
      <div class="hero-card animate-on-scroll">
        <div class="hero-badge">
          <span class="hero-badge-dot"></span>
          ${escapeHtml(meta.experienceLevel)} · ${escapeHtml(meta.industry)}
        </div>
        <h1 class="hero-name">
          ${escapeHtml(personal.name.split(" ")[0])}<br>
          <span class="gradient-word">${escapeHtml(personal.name.split(" ").slice(1).join(" ") || "")}</span>
        </h1>
        <div class="hero-title">${escapeHtml(personal.title)}</div>
        <p class="hero-desc">${escapeHtml(copy?.heroSubheadline || personal.tagline)}</p>
        <div class="hero-actions">
          ${personal.email    ? `<a href="mailto:${escapeHtml(personal.email)}"   class="btn-glass btn-filled">Get in Touch</a>` : ""}
          ${personal.github   ? `<a href="${escapeHtml(personal.github)}"          class="btn-glass btn-outline" target="_blank">GitHub</a>` : ""}
          ${personal.linkedin ? `<a href="${escapeHtml(personal.linkedin)}"        class="btn-glass btn-outline" target="_blank">LinkedIn</a>` : ""}
        </div>
      </div>
    </section>

    <section id="about">
      <div class="section-label">About me</div>
      <h2 class="section-title">Who I Am</h2>
      <p class="section-sub" style="max-width:650px">${escapeHtml(copy?.aboutParagraph1 || personal.bio)}</p>
      ${copy?.aboutParagraph2 ? `<p style="color:rgba(255,255,255,0.35);max-width:600px;line-height:1.8;font-size:0.95rem;">${escapeHtml(copy.aboutParagraph2)}</p>` : ""}
    </section>

    <section id="skills">
      <div class="section-label">Technical Skills</div>
      <h2 class="section-title">My Tech Stack</h2>
      <p class="section-sub">Technologies I work with</p>
      <div class="skills-cloud animate-on-scroll">${skillsHTML}</div>
      <div class="skills-bars">${barsHTML}</div>
    </section>

    <section id="experience" style="background:rgba(255,255,255,0.02)">
      <div class="section-label">Career</div>
      <h2 class="section-title">Experience</h2>
      <p class="section-sub">My professional journey</p>
      <div class="exp-grid">${expHTML || "<p style='color:rgba(255,255,255,0.3)'>No experience data available.</p>"}</div>
    </section>

    <section id="projects">
      <div class="section-label">Work</div>
      <h2 class="section-title">Projects</h2>
      <p class="section-sub">Things I've built</p>
      <div class="projects-grid">${projHTML || "<p style='color:rgba(255,255,255,0.3)'>No projects listed.</p>"}</div>
    </section>

    <section id="contact">
      <div class="contact-wrapper animate-on-scroll">
        <div class="section-label">Say Hello</div>
        <h2 class="section-title">${escapeHtml(copy?.callToAction || "Let's Work Together")}</h2>
        <p style="color:rgba(255,255,255,0.4);line-height:1.8">${escapeHtml(copy?.contactIntro || "I'm always open to new opportunities.")}</p>
        <div class="contact-cards">
          ${personal.email    ? `<a href="mailto:${escapeHtml(personal.email)}" class="contact-card glass"><div class="contact-icon">@</div><span>${escapeHtml(personal.email)}</span></a>` : ""}
          ${personal.linkedin ? `<a href="${escapeHtml(personal.linkedin)}"     class="contact-card glass" target="_blank"><div class="contact-icon">in</div><span>LinkedIn</span></a>` : ""}
          ${personal.github   ? `<a href="${escapeHtml(personal.github)}"       class="contact-card glass" target="_blank"><div class="contact-icon">gh</div><span>GitHub</span></a>` : ""}
          ${personal.twitter  ? `<a href="${escapeHtml(personal.twitter)}"      class="contact-card glass" target="_blank"><div class="contact-icon">tw</div><span>Twitter</span></a>` : ""}
        </div>
      </div>
    </section>

    <footer>
      <span class="footer-text">© ${new Date().getFullYear()} ${escapeHtml(personal.name)} · Built with ResumeIQ AI</span>
      <span style="color:rgba(255,255,255,0.15);font-size:0.8rem;">${escapeHtml(meta.industry)} · ${escapeHtml(meta.experienceLevel)}</span>
    </footer>
  `;

  return wrapHTML({ title: personal.name, primaryColor: P, accentColor: A, styles, body });
};