/**
 * Minimal Portfolio Template
 * Clean, typography-first, ATS-friendly professional portfolio.
 * Place at: backend/templates/minimal/template.js
 */

const {
  wrapHTML,
  escapeHtml
} = require("../utils/templateHelpers");

module.exports = function minimalTemplate(data) {
  const { personal, skills, experience, projects, education, copy, meta, certifications } = data;
  const P = meta.primaryColor || "#3b82f6";
  const A = meta.accentColor  || "#10b981";

  const styles = `
    body { background: #ffffff; color: #1a1a2e; font-family: 'Inter', sans-serif; line-height: 1.6; }
    * { box-sizing: border-box; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    .animate-on-scroll { opacity:0; transform:translateY(20px); transition:all 0.6s ease; }
    .animate-on-scroll.visible { opacity:1; transform:none; }

    /* ── Nav ── */
    nav { padding: 24px 80px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; position: sticky; top: 0; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); z-index: 100; }
    .nav-name { font-weight: 700; font-size: 1.1rem; color: #1a1a2e; }
    .nav-links { display: flex; gap: 32px; list-style: none; }
    .nav-links a { color: #64748b; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
    .nav-links a:hover { color: ${P}; }
    .nav-contact { padding: 10px 24px; background: ${P}; color: #fff; border-radius: 8px; text-decoration: none; font-size: 0.85rem; font-weight: 600; transition: background 0.2s; }
    .nav-contact:hover { background: ${A}; }

    /* ── Hero ── */
    .hero { padding: 80px 80px 60px; max-width: 1200px; margin: 0 auto; }
    .hero-available { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; background: ${A}15; border-radius: 999px; font-size: 0.78rem; font-weight: 600; color: ${A}; margin-bottom: 28px; }
    .available-dot { width: 6px; height: 6px; border-radius: 50%; background: ${A}; animation: pulse-dot 2s infinite; }
    @keyframes pulse-dot { 0%,100%{transform:scale(1)} 50%{transform:scale(1.5); opacity:0.6} }
    .hero-h1 { font-size: clamp(2.5rem,5vw,4rem); font-weight: 900; line-height: 1.1; letter-spacing: -2px; color: #0f172a; margin-bottom: 16px; }
    .hero-role { font-size: 1.2rem; color: ${P}; font-weight: 600; margin-bottom: 20px; }
    .hero-bio { color: #64748b; font-size: 1rem; max-width: 600px; line-height: 1.8; margin-bottom: 40px; }
    .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
    .btn-solid { padding: 12px 28px; background: #0f172a; color: #fff; border-radius: 8px; text-decoration: none; font-size: 0.9rem; font-weight: 600; transition: background 0.2s; }
    .btn-solid:hover { background: ${P}; }
    .btn-border { padding: 12px 28px; border: 1.5px solid #e2e8f0; color: #475569; border-radius: 8px; text-decoration: none; font-size: 0.9rem; font-weight: 600; transition: all 0.2s; }
    .btn-border:hover { border-color: ${P}; color: ${P}; }

    /* ── Sections ── */
    section { max-width: 1200px; margin: 0 auto; padding: 60px 80px; }
    .divider { border: none; border-top: 1px solid #f0f0f0; margin: 0 80px; }
    .sec-label { font-size: 0.72rem; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: ${P}; margin-bottom: 8px; }
    .sec-h2 { font-size: 1.8rem; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; margin-bottom: 40px; }

    /* ── Skills ── */
    .skills-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .skill-group-title { font-size: 0.85rem; font-weight: 700; color: #0f172a; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid ${P}; }
    .skill-list { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill-chip { padding: 6px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.82rem; color: #475569; font-weight: 500; transition: all 0.2s; }
    .skill-chip:hover { border-color: ${P}; color: ${P}; background: ${P}08; }
    .skill-chip-featured { background: ${P}10; border-color: ${P}33; color: ${P}; font-weight: 600; }

    /* ── Experience ── */
    .exp-list { display: flex; flex-direction: column; }
    .exp-entry { padding: 28px 0; border-bottom: 1px solid #f0f0f0; display: grid; grid-template-columns: 160px 1fr; gap: 32px; }
    .exp-entry:last-child { border-bottom: none; }
    .exp-date-col { padding-top: 3px; }
    .exp-date-text { font-size: 0.8rem; color: #94a3b8; font-weight: 500; }
    .exp-loc { font-size: 0.78rem; color: #cbd5e1; margin-top: 4px; }
    .exp-title-row { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
    .exp-job-title { font-size: 1rem; font-weight: 700; color: #0f172a; }
    .exp-curr-tag { font-size: 0.7rem; background: ${A}15; color: ${A}; padding: 2px 8px; border-radius: 999px; font-weight: 600; }
    .exp-company-row { font-size: 0.88rem; color: ${P}; font-weight: 600; margin-bottom: 12px; }
    .exp-body { color: #64748b; font-size: 0.88rem; line-height: 1.7; margin-bottom: 12px; }
    .exp-bullets { list-style: none; }
    .exp-bullets li { font-size: 0.85rem; color: #64748b; padding: 3px 0 3px 16px; position: relative; }
    .exp-bullets li::before { content: '·'; position: absolute; left: 0; color: ${P}; font-size: 1.2rem; top: -1px; }
    .exp-tech { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
    .exp-tech-chip { font-size: 0.72rem; background: #f1f5f9; color: #64748b; padding: 3px 10px; border-radius: 4px; }

    /* ── Projects ── */
    .projects-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
    .proj-card-min { padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; transition: all 0.2s; }
    .proj-card-min:hover { border-color: ${P}; box-shadow: 0 4px 20px rgba(0,0,0,0.06); transform: translateY(-2px); }
    .proj-title-min { font-size: 1rem; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
    .proj-desc-min { color: #64748b; font-size: 0.85rem; line-height: 1.7; margin-bottom: 14px; }
    .proj-tags-min { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
    .proj-tag-min { font-size: 0.72rem; padding: 3px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; color: #94a3b8; }
    .proj-links-min { display: flex; gap: 12px; }
    .proj-link-min { font-size: 0.8rem; color: ${P}; text-decoration: none; font-weight: 600; }
    .proj-link-min:hover { text-decoration: underline; }

    /* ── Education ── */
    .edu-list { display: flex; flex-direction: column; gap: 20px; }
    .edu-item { display: grid; grid-template-columns: 160px 1fr; gap: 32px; padding: 20px 0; border-bottom: 1px solid #f0f0f0; }
    .edu-year { font-size: 0.8rem; color: #94a3b8; }
    .edu-degree { font-size: 0.95rem; font-weight: 700; color: #0f172a; margin-bottom: 2px; }
    .edu-institution { font-size: 0.88rem; color: ${P}; margin-bottom: 4px; }
    .edu-grade { font-size: 0.8rem; color: #94a3b8; }

    /* ── Contact ── */
    .contact-min { display: flex; gap: 16px; flex-wrap: wrap; }
    .contact-item { display: flex; align-items: center; gap: 10px; padding: 14px 20px; border: 1px solid #e2e8f0; border-radius: 8px; text-decoration: none; color: #64748b; font-size: 0.88rem; transition: all 0.2s; }
    .contact-item:hover { border-color: ${P}; color: ${P}; }
    .contact-icon-box { width: 32px; height: 32px; border-radius: 6px; background: ${P}10; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: ${P}; }

    /* ── Footer ── */
    footer { padding: 32px 80px; border-top: 1px solid #f0f0f0; display: flex; justify-content: space-between; font-size: 0.8rem; color: #94a3b8; }

    @media(max-width:768px) {
      nav { padding: 16px 20px; } .nav-links { display: none; }
      section, .hero { padding: 40px 20px; }
      .exp-entry, .edu-item { grid-template-columns: 1fr; gap: 8px; }
      .skills-2col { grid-template-columns: 1fr; }
      footer { flex-direction: column; gap: 8px; padding: 24px 20px; }
    }
  `;

  const expHTML = experience.slice(0, 5).map((e) => `
    <div class="exp-entry animate-on-scroll">
      <div class="exp-date-col">
        <div class="exp-date-text">${escapeHtml(e.duration)}</div>
        ${e.location ? `<div class="exp-loc">${escapeHtml(e.location)}</div>` : ""}
      </div>
      <div>
        <div class="exp-title-row">
          <span class="exp-job-title">${escapeHtml(e.role)}</span>
          ${e.current ? `<span class="exp-curr-tag">Current</span>` : ""}
        </div>
        <div class="exp-company-row">${escapeHtml(e.company)}</div>
        ${e.description ? `<p class="exp-body">${escapeHtml(e.description)}</p>` : ""}
        ${Array.isArray(e.achievements) &&
e.achievements.length ? `<ul class="exp-bullets">${e.achievements.slice(0,4).map((a) => `<li>${escapeHtml(a)}</li>`).join("")}</ul>` : ""}
        ${Array.isArray(e.technologies) &&
e.technologies.length ? `<div class="exp-tech">${e.technologies.slice(0,6).map((t) => `<span class="exp-tech-chip">${escapeHtml(t)}</span>`).join("")}</div>` : ""}
      </div>
    </div>`).join("");
const safeProjects = Array.isArray(projects)
  ? projects
  : Object.values(projects || {});
  const projHTML = safeProjects.slice(0, 6).map((p) => `
    <div class="proj-card-min animate-on-scroll">
      <div class="proj-title-min">${escapeHtml(p.name)}</div>
      ${p.description ? `<div class="proj-desc-min">${escapeHtml(p.description)}</div>` : ""}
      ${Array.isArray(p.technologies) &&
p.technologies.length ? `<div class="proj-tags-min">${p.technologies.slice(0,5).map((t) => `<span class="proj-tag-min">${escapeHtml(t)}</span>`).join("")}</div>` : ""}
      <div class="proj-links-min">
        ${p.githubUrl ? `<a href="${escapeHtml(p.githubUrl)}" class="proj-link-min" target="_blank">↗ GitHub</a>` : ""}
        ${p.liveUrl   ? `<a href="${escapeHtml(p.liveUrl)}"   class="proj-link-min" target="_blank">↗ Live</a>` : ""}
      </div>
    </div>`).join("");

  const eduHTML = education.slice(0, 3).map((e) => `
    <div class="edu-item animate-on-scroll">
      <div class="edu-year">${escapeHtml(e.duration)}</div>
      <div>
        <div class="edu-degree">${escapeHtml(e.degree)} ${e.field ? `in ${escapeHtml(e.field)}` : ""}</div>
        <div class="edu-institution">${escapeHtml(e.institution)}</div>
        ${e.grade ? `<div class="edu-grade">GPA / Grade: ${escapeHtml(e.grade)}</div>` : ""}
      </div>
    </div>`).join("");

    const technicalSkills =
  Array.isArray(skills?.technical)
    ? skills.technical
    : [];

const featuredSkills =
  Array.isArray(skills?.featured)
    ? skills.featured
    : [];

const softSkills =
  Array.isArray(skills?.soft)
    ? skills.soft
    : [];

  const body = `
  
    <nav>
      <div class="nav-name">${escapeHtml(personal.name)}</div>
      <ul class="nav-links">
        <li><a href="#about">About</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      ${personal.email ? `<a href="mailto:${escapeHtml(personal.email)}" class="nav-contact">Email Me</a>` : ""}
    </nav>

    <div class="hero animate-on-scroll" id="home">
      <div class="hero-available"><span class="available-dot"></span>Open to opportunities</div>
      <h1 class="hero-h1">${escapeHtml(personal.name)}</h1>
      <div class="hero-role">${escapeHtml(personal.title)}</div>
      <p class="hero-bio">${escapeHtml(copy?.aboutParagraph1 || personal.bio)}</p>
      <div class="hero-actions">
        ${personal.email    ? `<a href="mailto:${escapeHtml(personal.email)}"   class="btn-solid">Get in Touch</a>` : ""}
        ${personal.linkedin ? `<a href="${escapeHtml(personal.linkedin)}"        class="btn-border" target="_blank">LinkedIn</a>` : ""}
        ${personal.github   ? `<a href="${escapeHtml(personal.github)}"          class="btn-border" target="_blank">GitHub</a>` : ""}
      </div>
    </div>

    <hr class="divider" />

    <section id="skills">
      <div class="sec-label">Expertise</div>
      <h2 class="sec-h2">Skills & Technologies</h2>
      <div class="skills-2col animate-on-scroll">
        <div>
          <div class="skill-group-title">Technical Skills</div>
          <div class="skill-list">${technicalSkills.slice(0,12).map((s) =>
  `<span class="skill-chip ${
    featuredSkills.includes(s.name)
      ? "skill-chip-featured"
      : ""
  }">
    ${escapeHtml(s.name)}
  </span>`
).join("")}</div>
        </div>
        <div>
          <div class="skill-group-title">Soft Skills</div>
          <div class="skill-list">${softSkills.map((s) => `<span class="skill-chip">${escapeHtml(s)}</span>`).join("")}</div>
        </div>
      </div>
    </section>

    <hr class="divider" />

    <section id="experience">
      <div class="sec-label">Career</div>
      <h2 class="sec-h2">Work Experience</h2>
      <div class="exp-list">${expHTML || "<p style='color:#94a3b8'>No experience listed.</p>"}</div>
    </section>

    <hr class="divider" />

    <section id="projects">
      <div class="sec-label">Portfolio</div>
      <h2 class="sec-h2">Projects</h2>
      <div class="projects-list">${projHTML || "<p style='color:#94a3b8'>No projects listed.</p>"}</div>
    </section>

    ${education.length ? `
    <hr class="divider" />
    <section id="education">
      <div class="sec-label">Education</div>
      <h2 class="sec-h2">Academic Background</h2>
      <div class="edu-list">${eduHTML}</div>
    </section>` : ""}

    <hr class="divider" />

    <section id="contact">
      <div class="sec-label">Contact</div>
      <h2 class="sec-h2">Get in Touch</h2>
      <p style="color:#64748b;margin-bottom:28px;font-size:0.95rem">${escapeHtml(copy?.contactIntro || "Let's connect.")}</p>
      <div class="contact-min">
        ${personal.email    ? `<a href="mailto:${escapeHtml(personal.email)}" class="contact-item"><div class="contact-icon-box">@</div>${escapeHtml(personal.email)}</a>` : ""}
        ${personal.linkedin ? `<a href="${escapeHtml(personal.linkedin)}"     class="contact-item" target="_blank"><div class="contact-icon-box">in</div>LinkedIn</a>` : ""}
        ${personal.github   ? `<a href="${escapeHtml(personal.github)}"       class="contact-item" target="_blank"><div class="contact-icon-box">gh</div>GitHub</a>` : ""}
        ${personal.twitter  ? `<a href="${escapeHtml(personal.twitter)}"      class="contact-item" target="_blank"><div class="contact-icon-box">tw</div>Twitter</a>` : ""}
      </div>
    </section>

    <footer>
      <span>© ${new Date().getFullYear()} ${escapeHtml(personal.name)}</span>
      <span>Built with ResumeIQ AI</span>
    </footer>
  `;

  return wrapHTML({ title: personal.name, primaryColor: P, accentColor: A, styles, body });
};