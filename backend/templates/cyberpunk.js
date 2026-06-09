/**
 * Cyberpunk Portfolio Template
 * Neon-lit dark UI with glitch effects, scanlines, and terminal aesthetic.
 * Place at: backend/templates/cyberpunk/template.js
 */

const {
  wrapHTML,
  escapeHtml
} = require("../utils/templateHelpers");

module.exports = function cyberpunkTemplate(data) {
  const { personal, skills, experience, projects, education, copy, meta, certifications, achievements } = data;
  const P = meta.primaryColor || "#00ffff";
  const A = meta.accentColor  || "#ff00ff";

  const styles = `
    body { background: #050505; color: #e0e0e0; font-family: 'Inter', sans-serif; overflow-x: hidden; }
    ::selection { background: ${P}33; color: ${P}; }
    ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: ${P}; }

    /* ── Scanlines overlay ── */
    body::before { content:''; position:fixed; inset:0; background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.05) 2px,rgba(0,0,0,0.05) 4px); pointer-events:none; z-index:9999; }

    /* ── Glitch Effect ── */
    @keyframes glitch { 0%,100%{clip-path:inset(0 0 100% 0);transform:translate(0)} 20%{clip-path:inset(10% 0 60% 0);transform:translate(-4px,2px)} 40%{clip-path:inset(50% 0 10% 0);transform:translate(4px,-2px)} 60%{clip-path:inset(30% 0 40% 0);transform:translate(-2px,4px)} 80%{clip-path:inset(80% 0 5% 0);transform:translate(2px,-4px)} }
    @keyframes flicker { 0%,100%{opacity:1} 41%{opacity:1} 42%{opacity:0.8} 43%{opacity:1} 75%{opacity:1} 76%{opacity:0.4} 77%{opacity:1} }
    @keyframes scanBar { from{top:-50px} to{top:100%} }
    @keyframes neonPulse { 0%,100%{box-shadow:0 0 5px ${P},0 0 10px ${P},0 0 20px ${P}} 50%{box-shadow:0 0 10px ${P},0 0 20px ${P},0 0 40px ${P}} }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
    .animate-on-scroll {
  opacity:1;
  transform:none;
}
    .animate-on-scroll.visible { opacity:1; transform:none; }

    /* ── Nav ── */
    nav { position:fixed; top:0; width:100%; z-index:100; background:rgba(5,5,5,0.9); backdrop-filter:blur(20px); border-bottom:1px solid ${P}33; padding:16px 48px; display:flex; justify-content:space-between; align-items:center; }
    .nav-logo { font-family:'Orbitron',monospace; font-size:1.2rem; color:${P}; text-shadow:0 0 10px ${P}; letter-spacing:3px; animation:flicker 8s infinite; }
    .nav-links { display:flex; gap:32px; list-style:none; }
    .nav-links a { color:#888; text-decoration:none; font-size:0.85rem; letter-spacing:2px; text-transform:uppercase; transition:color 0.3s; }
    .nav-links a:hover { color:${P}; text-shadow:0 0 8px ${P}; }

    /* ── Hero ── */
    .hero {
 min-height:100vh;
 display:flex;
 justify-content:center;
 align-items:center;
 text-align:center;
 padding:0 48px;
 padding-top:80px;
 position:relative;
 overflow:hidden;
}
    .hero::before {
  content:'';
  position:absolute;
  inset:0;
  background:radial-gradient(
    ellipse at 50% 50%,
    ${P}11 0%,
    transparent 70%
  );
}
    .hero-grid { position:absolute; inset:0; background-image:linear-gradient(${P}08 1px,transparent 1px),linear-gradient(90deg,${P}08 1px,transparent 1px); background-size:50px 50px; }
    .scan-bar { position:absolute; width:100%; height:2px; background:linear-gradient(90deg,transparent,${P},transparent); animation:scanBar 4s linear infinite; opacity:0.4; }
    .hero-content {
 position:relative;
 z-index:1;
 max-width:900px;
 margin:auto;
 text-align:center;
}
    .hero-tag { color:${A}; font-family:'JetBrains Mono',monospace; font-size:0.8rem; letter-spacing:3px; margin-bottom:16px; text-transform:uppercase; }
    .hero-name { font-family:'Orbitron',monospace; font-size:clamp(2.5rem,6vw,5rem); font-weight:900; line-height:1.1; margin-bottom:16px; }
    .hero-name span { color:${P}; text-shadow:0 0 30px ${P},0 0 60px ${P}44; display:block; position:relative; }
    .hero-name span::before { content:attr(data-text); position:absolute; left:2px; top:2px; color:${A}; opacity:0.5; animation:glitch 3s infinite; clip-path:inset(0 0 60% 0); }
    .hero-title { color:#888; font-size:1.2rem; margin-bottom:24px; letter-spacing:2px; }
    .hero-desc { color:#666; max-width:600px; line-height:1.8; margin-bottom:48px; font-size:0.95rem; }
    .hero-badges { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:40px; }
    .badge { background:${P}11; border:1px solid ${P}44; color:${P}; padding:8px 16px; font-family:'JetBrains Mono',monospace; font-size:0.75rem; letter-spacing:2px; animation:neonPulse 3s infinite; border-radius:2px; }
    .hero-cta {
 display:flex;
 justify-content:center;
 gap:16px;
 flex-wrap:wrap;
}
    .btn-primary { background:${P}; color:#000; padding:14px 32px; font-weight:700; text-decoration:none; font-family:'Orbitron',monospace; font-size:0.85rem; letter-spacing:2px; transition:all 0.3s; clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%); }
    .btn-primary:hover { background:${A}; box-shadow:0 0 30px ${A}; }
    .btn-secondary { border:1px solid ${P}; color:${P}; padding:14px 32px; text-decoration:none; font-family:'Orbitron',monospace; font-size:0.85rem; letter-spacing:2px; transition:all 0.3s; clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%); }
    .btn-secondary:hover { background:${P}11; box-shadow:0 0 20px ${P}44; }

    /* ── Sections ── */
    section { padding:100px 48px; }
    .section-tag { font-family:'JetBrains Mono',monospace; font-size:0.75rem; color:${A}; letter-spacing:4px; text-transform:uppercase; margin-bottom:8px; }
    .section-title { font-family:'Orbitron',monospace; font-size:2rem; font-weight:700; color:#fff; margin-bottom:48px; position:relative; display:inline-block; }
    .section-title::after { content:''; position:absolute; bottom:-8px; left:0; width:60%; height:2px; background:linear-gradient(90deg,${P},transparent); }

    /* ── Skills ── */
    .skills-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:16px; }
    .skill-item { background:#0a0a0a; border:1px solid #1a1a1a; border-left:3px solid ${P}; padding:16px; transition:all 0.3s; }
    .skill-item:hover { border-left-color:${A}; background:#0f0f0f; transform:translateX(4px); }
    .skill-header { display:flex; justify-content:space-between; margin-bottom:8px; }
    .skill-name { font-size:0.9rem; font-weight:600; color:#ddd; }
    .skill-level { font-family:'JetBrains Mono',monospace; font-size:0.8rem; color:${P}; }
    .skill-bar { height:3px; background:#1a1a1a; border-radius:0; }
    .skill-fill { height:100%; background:linear-gradient(90deg,${P},${A}); transition:width 1.5s cubic-bezier(0.4,0,0.2,1); }
    .featured-skills { display:flex; flex-wrap:wrap; gap:10px; margin-bottom:40px; }
    .feat-skill { border:1px solid ${P}55; color:${P}; padding:8px 16px; font-family:'JetBrains Mono',monospace; font-size:0.8rem; background:${P}08; }

    /* ── Experience ── */
    .timeline { position:relative; padding-left:40px; }
    .timeline::before { content:''; position:absolute; left:0; top:0; bottom:0; width:1px; background:linear-gradient(${P},${A},transparent); }
    .timeline-item { position:relative; margin-bottom:48px; }
    .timeline-dot { position:absolute; left:-44px; top:6px; width:10px; height:10px; background:${P}; box-shadow:0 0 10px ${P}; clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%); }
    .exp-card { background:#0a0a0a; border:1px solid #1a1a1a; border-top:1px solid ${P}33; padding:28px; transition:border-color 0.3s; }
    .exp-card:hover { border-color:${P}33; box-shadow:0 0 30px ${P}11; }
    .exp-role { font-size:1.1rem; font-weight:700; color:#fff; margin-bottom:4px; }
    .exp-company { color:${P}; font-family:'JetBrains Mono',monospace; font-size:0.85rem; margin-bottom:8px; }
    .exp-meta { color:#555; font-size:0.8rem; margin-bottom:16px; font-family:'JetBrains Mono',monospace; }
    .exp-desc { color:#888; line-height:1.7; font-size:0.9rem; margin-bottom:16px; }
    .exp-achievements { list-style:none; }
    .exp-achievements li { color:#777; font-size:0.85rem; padding:4px 0; padding-left:20px; position:relative; }
    .exp-achievements li::before { content:'▶'; position:absolute; left:0; color:${P}; font-size:0.6rem; top:7px; }
    .tech-tags { display:flex; flex-wrap:wrap; gap:8px; margin-top:16px; }
    .tech-tag { background:#111; border:1px solid #222; color:#666; padding:4px 12px; font-family:'JetBrains Mono',monospace; font-size:0.7rem; letter-spacing:1px; }

    /* ── Projects ── */
    .projects-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(360px,1fr)); gap:24px; }
    .project-card { background:#070707; border:1px solid #1a1a1a; padding:28px; position:relative; overflow:hidden; transition:all 0.3s; cursor:pointer; }
    .project-card::before { content:''; position:absolute; inset:0; border:1px solid ${P}; opacity:0; transition:opacity 0.3s; pointer-events:none; }
    .project-card:hover { transform:translateY(-4px); box-shadow:0 20px 40px rgba(0,0,0,0.6); }
    .project-card:hover::before { opacity:1; }
    .project-card::after { content:''; position:absolute; top:0; right:0; width:60px; height:60px; background:linear-gradient(225deg,${P}22,transparent); }
    .project-num { font-family:'JetBrains Mono',monospace; font-size:2.5rem; font-weight:700; color:#1a1a1a; position:absolute; right:20px; bottom:16px; line-height:1; }
    .project-name { font-size:1.1rem; font-weight:700; color:#ddd; margin-bottom:12px; }
    .project-desc { color:#666; font-size:0.85rem; line-height:1.7; margin-bottom:16px; }
    .project-impact { color:${A}; font-size:0.8rem; font-family:'JetBrains Mono',monospace; margin-bottom:16px; padding:8px; background:${A}11; border-left:2px solid ${A}; }
    .project-links { display:flex; gap:12px; margin-top:16px; }
    .project-link { color:${P}; font-size:0.8rem; text-decoration:none; font-family:'JetBrains Mono',monospace; border-bottom:1px solid ${P}44; padding-bottom:2px; transition:border-color 0.2s; }
    .project-link:hover { border-color:${P}; }

    /* ── Contact ── */
    .contact-section { background:#070707; border-top:1px solid ${P}22; border-bottom:1px solid ${P}22; }
    .contact-grid { display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; }
    .contact-intro { color:#666; line-height:1.8; font-size:0.95rem; margin-bottom:32px; }
    .contact-links { display:flex; flex-direction:column; gap:16px; }
    .contact-link { display:flex; align-items:center; gap:16px; color:#888; text-decoration:none; padding:16px; border:1px solid #1a1a1a; transition:all 0.3s; }
    .contact-link:hover { border-color:${P}; color:${P}; transform:translateX(8px); }
    .contact-link-icon { width:40px; height:40px; background:${P}11; border:1px solid ${P}33; display:flex; align-items:center; justify-content:center; font-family:'JetBrains Mono',monospace; font-size:0.7rem; color:${P}; }
    .contact-info-group { background:#0a0a0a; border:1px solid #1a1a1a; padding:32px; }
    .contact-info-item { margin-bottom:20px; padding-bottom:20px; border-bottom:1px solid #111; }
    .contact-info-item:last-child { border-bottom:none; margin-bottom:0; padding-bottom:0; }
    .contact-info-label { font-family:'JetBrains Mono',monospace; font-size:0.7rem; color:${P}; letter-spacing:2px; text-transform:uppercase; margin-bottom:4px; }
    .contact-info-value { color:#888; font-size:0.9rem; }

    /* ── Footer ── */
    footer { padding:40px 48px; border-top:1px solid #111; display:flex; justify-content:space-between; align-items:center; }
    .footer-text { font-family:'JetBrains Mono',monospace; font-size:0.75rem; color:#333; }
    .footer-logo { font-family:'Orbitron',monospace; font-size:0.9rem; color:${P}44; letter-spacing:3px; }

    /* ── Responsive ── */
    @media(max-width:768px) {
      nav { padding:16px 24px; }
      .nav-links { display:none; }
      section { padding:60px 24px; }
      .hero { padding:24px; padding-top:80px; }
      .hero-name { font-size:2.2rem; }
      .contact-grid { grid-template-columns:1fr; }
      .projects-grid { grid-template-columns:1fr; }
      footer { flex-direction:column; gap:16px; text-align:center; }
    }
  `;

  const technicalSkills = Array.isArray(skills?.technical)
  ? skills.technical
  : Object.values(skills?.technical || {});
  const featuredSkills = Array.isArray(skills?.featured)
  ? skills.featured
  : Object.values(skills?.featured || {});
const skillsHTML = technicalSkills
    .slice(0, 16)
    .map(
      (s) => `
      <div class="skill-item animate-on-scroll">
        <div class="skill-header">
          <span class="skill-name">${escapeHtml(s.name)}</span>
          <span class="skill-level">${s.level}%</span>
        </div>
        <div class="skill-bar"><div class="skill-fill" style="width:${s.level}%"></div></div>
      </div>`
    )
    .join("");

  const safeExperience = Array.isArray(experience)
  ? experience
  : Object.values(experience || {});

const experienceHTML = safeExperience
  .slice(0, 4)
    .map(
      (e) => `
      <div class="timeline-item animate-on-scroll">
        <div class="timeline-dot"></div>
        <div class="exp-card">
          <div class="exp-role">${escapeHtml(e.role)}</div>
          <div class="exp-company">${escapeHtml(e.company)}</div>
          <div class="exp-meta">${escapeHtml(e.duration)} ${e.location ? `· ${escapeHtml(e.location)}` : ""}</div>
          <div class="exp-desc">${escapeHtml(e.description)}</div>
          ${(e.achievements || []).length ? `<ul class="exp-achievements">${e.achievements.map((a) => `<li>${escapeHtml(a)}</li>`).join("")}</ul>` : ""}
          ${(e.technologies || []).length ? `<div class="tech-tags">${e.technologies.map((t) => `<span class="tech-tag">${escapeHtml(t)}</span>`).join("")}</div>` : ""}
        </div>
      </div>`
    )
    .join("");
const safeProjects = Array.isArray(projects)
  ? projects
  : Object.values(projects || {});
  const projectsHTML = safeProjects
  .slice(0, 6)
    .map(
      (p, i) => `
      <div class="project-card animate-on-scroll">
        <span class="project-num">0${i + 1}</span>
        <div class="project-name">${escapeHtml(p.name)}</div>
        ${p.description ? `<div class="project-desc">${escapeHtml(p.description)}</div>` : ""}
        ${p.impact ? `<div class="project-impact">▶ ${escapeHtml(p.impact)}</div>` : ""}
        ${(p.technologies || []).length ? `<div class="tech-tags">${p.technologies.slice(0, 5).map((t) => `<span class="tech-tag">${escapeHtml(t)}</span>`).join("")}</div>` : ""}
        <div class="project-links">
          ${p.githubUrl ? `<a href="${escapeHtml(p.githubUrl)}" class="project-link" target="_blank">[ GitHub ]</a>` : ""}
          ${p.liveUrl   ? `<a href="${escapeHtml(p.liveUrl)}"   class="project-link" target="_blank">[ Live Demo ]</a>` : ""}
        </div>
      </div>`
    )
    .join("");

  const body = `
    <!-- NAV -->
    <nav>
      <div class="nav-logo">${escapeHtml((personal?.name || "User").split(" ")[0])}_</div>
      <ul class="nav-links">
        <li><a href="#about">About</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#experience">Work</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>

    <!-- HERO -->
    <section class="hero" id="home">
      <div class="hero-grid"></div>
      <div class="scan-bar"></div>
      <div class="hero-content">
      ${personal.image ? `
<div style="margin-bottom:30px;">
  <img
    src="${escapeHtml(personal.image)}"
    alt="${escapeHtml(personal.name)}"
    style="
      width:220px;
height:220px;
      border-radius:50%;
      object-fit:cover;
      border:3px solid ${P};
      box-shadow:0 0 30px ${P};
    "
  />
</div>
` : ""}
        <div class="hero-tag">// ${escapeHtml(meta.industry)} · ${escapeHtml(meta.experienceLevel)} Engineer</div>
        <h1 class="hero-name">
          <span data-text="${escapeHtml(personal.name)}">${escapeHtml(personal.name)}</span>
        </h1>
        <div class="hero-title">{ ${escapeHtml(personal.title)} }</div>
        <div class="hero-desc">
${escapeHtml(
personal.bio ||
"A passionate developer building amazing digital experiences."
)}
</div>
        <div class="hero-badges">
      
          ${featuredSkills
  .slice(0,4)
  .map((s) => `<span class="badge">${escapeHtml(s)}</span>`)
  .join("")}
        </div>
        <div class="hero-cta">
          ${personal.github ? `<a href="${escapeHtml(personal.github)}" class="btn-primary" target="_blank">GitHub_</a>` : ""}
          ${personal.linkedin ? `<a href="${escapeHtml(personal.linkedin)}" class="btn-secondary" target="_blank">LinkedIn_</a>` : ""}
          ${personal.email ? `<a href="mailto:${escapeHtml(personal.email)}" class="btn-secondary">Contact_</a>` : ""}
        </div>
      </div>
    </section>

    <!-- ABOUT -->
    <section id="about">
      <div class="section-tag">// 001</div>
      <h2 class="section-title">About_me</h2>
      <div style="max-width:700px;color:#888;line-height:1.9;font-size:0.95rem;" class="animate-on-scroll">
        <p>${escapeHtml(personal.aboutMe || personal.bio || "No About Information Available")}</p>
        ${copy?.aboutParagraph2 ? `<p style="margin-top:16px">${escapeHtml(copy.aboutParagraph2)}</p>` : ""}
        ${personal.location ? `<p style="margin-top:24px;color:#555;font-family:'JetBrains Mono',monospace;font-size:0.85rem;">📍 ${escapeHtml(personal.location)}</p>` : ""}
      </div>
    </section>

    <!-- SKILLS -->
    <section id="skills" style="background:#070707;">
      <div class="section-tag">// 002</div>
      <h2 class="section-title">Tech_stack</h2>
      <div class="featured-skills animate-on-scroll">
        ${(skills?.featured || []).map((s) => `<span class="feat-skill">${escapeHtml(s)}</span>`).join("")}
      </div>
      <div class="skills-grid">${skillsHTML}</div>
    </section>

    <!-- EXPERIENCE -->
    <section id="experience">
      <div class="section-tag">// 003</div>
      <h2 class="section-title">Experience_</h2>
      <div class="timeline">${experienceHTML || "<p style='color:#444'>No experience data available.</p>"}</div>
    </section>

    <!-- PROJECTS -->
    <section id="projects" style="background:#070707;">
      <div class="section-tag">// 004</div>
      <h2 class="section-title">Projects_</h2>
      <div class="projects-grid">${projectsHTML || "<p style='color:#444'>No projects listed.</p>"}</div>
    </section>

    <!-- CONTACT -->
    <section id="contact" class="contact-section">
      <div class="section-tag">// 005</div>
      <h2 class="section-title">Contact_</h2>
      <div class="contact-grid animate-on-scroll">
        <div>
          <p class="contact-intro">${escapeHtml(copy?.contactIntro || "Let's connect and build something great together.")}</p>
          <div class="contact-links">
            ${personal.email    ? `<a href="mailto:${escapeHtml(personal.email)}" class="contact-link"><div class="contact-link-icon">@</div><span>${escapeHtml(personal.email)}</span></a>` : ""}
            ${personal.linkedin ? `<a href="${escapeHtml(personal.linkedin)}"     class="contact-link" target="_blank"><div class="contact-link-icon">in</div><span>LinkedIn</span></a>` : ""}
            ${personal.github   ? `<a href="${escapeHtml(personal.github)}"       class="contact-link" target="_blank"><div class="contact-link-icon">gh</div><span>GitHub</span></a>` : ""}
            ${personal.twitter  ? `<a href="${escapeHtml(personal.twitter)}"      class="contact-link" target="_blank"><div class="contact-link-icon">tw</div><span>Twitter</span></a>` : ""}
          </div>
        </div>
        <div class="contact-info-group">
          ${personal.location ? `<div class="contact-info-item"><div class="contact-info-label">Location</div><div class="contact-info-value">${escapeHtml(personal.location)}</div></div>` : ""}
          <div class="contact-info-item"><div class="contact-info-label">Experience</div><div class="contact-info-value">${meta?.totalYearsExperience || 0}+ years in ${escapeHtml(meta?.industry || "Technology")}</div></div>
          <div class="contact-info-item"><div class="contact-info-label">Level</div><div class="contact-info-value">${escapeHtml(meta?.experienceLevel || "Beginner")}</div></div>
          ${personal.website ? `<div class="contact-info-item"><div class="contact-info-label">Website</div><div class="contact-info-value"><a href="${escapeHtml(personal.website)}" style="color:#888;text-decoration:none;" target="_blank">${escapeHtml(personal.website)}</a></div></div>` : ""}
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer>
      <span class="footer-text">Built with ResumeIQ AI · ${new Date().getFullYear()}</span>
      <span class="footer-logo">RESUME_IQ</span>
    </footer>
  `;

  return wrapHTML({
    title: personal.name,
    primaryColor: P,
    accentColor: A,
    styles,
    body,
  });
};