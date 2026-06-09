/**
 * Futuristic Portfolio Template
 * Space-age holographic UI with orbital animations and gradient meshes.
 * Place at: backend/templates/futuristic/template.js
 */

const {
  wrapHTML,
  escapeHtml
} = require("../utils/templateHelpers");

module.exports = function futuristicTemplate(data) {
  const { personal, skills, experience, projects, copy, meta } = data;
  const P = meta.primaryColor || "#7b2fff";
  const A = meta.accentColor  || "#00ffcc";

  const styles = `
    body { background: #030310; color: #c8d6f0; font-family: 'Inter', sans-serif; overflow-x: hidden; }
    ::selection { background: ${P}44; }

    /* ── Animated mesh background ── */
    .mesh-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background: radial-gradient(ellipse at 20% 50%, ${P}22 0%, transparent 50%),
                  radial-gradient(ellipse at 80% 20%, ${A}18 0%, transparent 50%),
                  radial-gradient(ellipse at 50% 80%, #3b82f622 0%, transparent 50%); }
    .grid-overlay { position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background-image: linear-gradient(${P}10 1px, transparent 1px), linear-gradient(90deg, ${P}10 1px, transparent 1px);
      background-size: 60px 60px; mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%); }

    @keyframes fadeUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
    @keyframes orbitSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes holoPulse { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.02)} }
    @keyframes dataFlow { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
    .animate-on-scroll { opacity:0; transform:translateY(30px); transition:all 0.9s cubic-bezier(0.16,1,0.3,1); }
    .animate-on-scroll.visible { opacity:1; transform:none; }

    /* ── Nav ── */
    nav { position: fixed; top: 0; width: 100%; z-index: 100; padding: 18px 64px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid ${P}33; background: rgba(3,3,16,0.8); backdrop-filter: blur(30px); }
    .nav-brand { display: flex; align-items: center; gap: 12px; }
    .nav-dot { width: 8px; height: 8px; border-radius: 50%; background: ${A}; box-shadow: 0 0 10px ${A}; animation: holoPulse 2s infinite; }
    .nav-name { font-weight: 700; font-size: 1rem; color: rgba(255,255,255,0.9); }
    .nav-links { display: flex; gap: 32px; list-style: none; }
    .nav-links a { color: rgba(255,255,255,0.4); font-size: 0.85rem; text-decoration: none; letter-spacing: 1px; transition: color 0.3s; }
    .nav-links a:hover { color: ${A}; }
    .nav-cta { padding: 8px 20px; border-radius: 8px; border: 1px solid ${P}66; color: ${P}; font-size: 0.8rem; text-decoration: none; transition: all 0.3s; }
    .nav-cta:hover { background: ${P}22; box-shadow: 0 0 20px ${P}44; }

    /* ── Hero ── */
    .hero { min-height: 100vh; display: flex; align-items: center; padding: 100px 64px 80px; position: relative; z-index: 1; }
    .hero-inner { display: grid; grid-template-columns: 1fr auto; gap: 80px; align-items: center; width: 100%; max-width: 1200px; }
    .hero-tag { font-size: 0.75rem; letter-spacing: 4px; text-transform: uppercase; color: ${A}; margin-bottom: 24px; }
    .hero-h1 { font-size: clamp(2.8rem,6vw,5rem); font-weight: 900; line-height: 1.05; letter-spacing: -2px; margin-bottom: 20px; }
    .hero-h1 .line1 { color: rgba(255,255,255,0.9); }
    .hero-h1 .line2 { background: linear-gradient(135deg, ${P}, ${A}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .hero-subtitle { color: rgba(255,255,255,0.4); font-size: 1.05rem; margin-bottom: 40px; line-height: 1.7; max-width: 520px; }
    .hero-stats { display: flex; gap: 32px; margin-bottom: 48px; }
    .stat-block { }
    .stat-num { font-size: 1.8rem; font-weight: 800; color: ${A}; font-family: 'Orbitron', monospace; }
    .stat-label { font-size: 0.75rem; color: rgba(255,255,255,0.3); letter-spacing: 1px; margin-top: 2px; }
    .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }
    .btn-holo { padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 0.9rem; text-decoration: none; transition: all 0.3s; }
    .btn-holo-fill { background: linear-gradient(135deg, ${P}, ${A}33); border: 1px solid ${A}55; color: #fff; box-shadow: 0 8px 30px ${P}44, inset 0 1px 0 rgba(255,255,255,0.1); }
    .btn-holo-fill:hover { box-shadow: 0 16px 40px ${P}66; transform: translateY(-2px); }
    .btn-holo-ghost { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); }
    .btn-holo-ghost:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.2); }

    /* ── Orbital avatar ── */
    .orbital { width: 280px; height: 280px; position: relative; flex-shrink: 0; }
    .orbital-ring { position: absolute; border-radius: 50%; border: 1px solid; }
    .ring1 { inset: 0; border-color: ${P}44; animation: orbitSpin 20s linear infinite; }
    .ring2 { inset: 20px; border-color: ${A}33; animation: orbitSpin 15s linear infinite reverse; }
    .ring3 { inset: 40px; border-color: ${P}22; animation: orbitSpin 10s linear infinite; }
    .ring1::before { content:''; position:absolute; width:10px;height:10px; border-radius:50%; background:${P}; box-shadow:0 0 10px ${P}; top:-5px; left:50%; transform:translateX(-50%); }
    .ring2::before { content:''; position:absolute; width:8px;height:8px; border-radius:50%; background:${A}; box-shadow:0 0 8px ${A}; bottom:-4px; left:50%; transform:translateX(-50%); }
    .avatar-center { position:absolute; inset:60px; border-radius:50%; background:linear-gradient(135deg,${P}33,${A}22); border:2px solid ${P}55; display:flex; align-items:center; justify-content:center; font-family:'Orbitron',monospace; font-size:2.5rem; font-weight:900; color:#fff; text-shadow:0 0 20px ${P}; }

    /* ── Sections ── */
    section { padding: 100px 64px; position: relative; z-index: 1; }
    .sec-eyebrow { font-family: 'Orbitron', monospace; font-size: 0.7rem; letter-spacing: 4px; color: ${A}; text-transform: uppercase; margin-bottom: 12px; }
    .sec-h2 { font-size: 2.2rem; font-weight: 800; letter-spacing: -1px; margin-bottom: 48px; }
    .sec-h2 span { background: linear-gradient(135deg, ${P}, ${A}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

    /* ── Skills hexagons ── */
    .skills-wrap { display: flex; flex-direction: column; gap: 32px; }
    .skill-row { display: flex; gap: 16px; flex-wrap: wrap; }
    .skill-hex { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 20px 16px; min-width: 100px; border: 1px solid ${P}33; background: ${P}08; border-radius: 12px; transition: all 0.3s; }
    .skill-hex:hover { border-color: ${A}55; background: ${A}11; transform: translateY(-4px); box-shadow: 0 10px 30px ${P}22; }
    .skill-hex-name { font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.7); text-align: center; }
    .skill-hex-level { font-family: 'Orbitron', monospace; font-size: 0.75rem; color: ${A}; }

    /* ── Timeline experience ── */
    .timeline-futuristic { display: flex; flex-direction: column; gap: 32px; }
    .tl-item { display: grid; grid-template-columns: 120px 1fr; gap: 32px; align-items: start; }
    .tl-date { text-align: right; padding-top: 4px; }
    .tl-date-text { font-family: 'Orbitron', monospace; font-size: 0.7rem; color: ${A}; letter-spacing: 1px; }
    .tl-body { border: 1px solid ${P}22; border-left: 3px solid ${P}; background: ${P}05; padding: 24px 28px; border-radius: 0 12px 12px 0; transition: all 0.3s; }
    .tl-body:hover { border-left-color: ${A}; background: ${A}05; }
    .tl-role { font-size: 1.05rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
    .tl-company { color: ${P}; font-size: 0.85rem; margin-bottom: 12px; }
    .tl-desc { color: rgba(255,255,255,0.45); font-size: 0.85rem; line-height: 1.7; }

    /* ── Projects ── */
    .proj-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
    .proj-card { padding: 28px; border: 1px solid ${P}22; background: linear-gradient(135deg, ${P}06, transparent); border-radius: 16px; transition: all 0.3s; position: relative; overflow: hidden; }
    .proj-card::after { content: ''; position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: radial-gradient(${A}22, transparent); border-radius: 50%; transform: translate(40%, -40%); }
    .proj-card:hover { transform: translateY(-6px); border-color: ${A}44; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
    .proj-name { font-size: 1.05rem; font-weight: 700; color: #fff; margin-bottom: 10px; }
    .proj-desc { color: rgba(255,255,255,0.4); font-size: 0.83rem; line-height: 1.7; margin-bottom: 14px; }
    .proj-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
    .proj-tag { padding: 3px 10px; border-radius: 4px; font-size: 0.72rem; background: ${A}11; border: 1px solid ${A}22; color: ${A}88; }
    .proj-actions { display: flex; gap: 12px; }
    .proj-btn { font-size: 0.78rem; color: ${P}; text-decoration: none; transition: color 0.2s; font-weight: 600; }
    .proj-btn:hover { color: ${A}; }

    /* ── Contact ── */
    .contact-container { max-width: 800px; }
    .contact-grid-fut { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 40px; }
    .contact-tile { padding: 24px; border: 1px solid ${P}22; background: ${P}06; border-radius: 12px; text-decoration: none; color: inherit; transition: all 0.3s; display: block; }
    .contact-tile:hover { border-color: ${A}44; background: ${A}08; transform: translateY(-3px); }
    .contact-tile-label { font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; color: ${A}; margin-bottom: 8px; font-family: 'Orbitron', monospace; }
    .contact-tile-value { font-size: 0.9rem; color: rgba(255,255,255,0.7); }

    footer { padding: 40px 64px; border-top: 1px solid ${P}22; display: flex; justify-content: space-between; position: relative; z-index: 1; }
    .footer-l { color: rgba(255,255,255,0.2); font-size: 0.8rem; }
    .footer-r { font-family: 'Orbitron', monospace; font-size: 0.7rem; color: ${P}44; }

    @media(max-width:768px) {
      nav { padding: 14px 20px; } .nav-links, .nav-cta { display: none; }
      section { padding: 60px 20px; }
      .hero { padding: 80px 20px 40px; }
      .hero-inner { grid-template-columns: 1fr; }
      .orbital { display: none; }
      .hero-h1 { font-size: 2.2rem; }
      .tl-item { grid-template-columns: 1fr; }
      .tl-date { text-align: left; }
      .contact-grid-fut { grid-template-columns: 1fr; }
      footer { flex-direction: column; gap: 8px; }
    }
  `;
  const technicalSkills = Array.isArray(skills?.technical)
  ? skills.technical
  : [];

  const skillsHTML = `
    <div class="skill-row animate-on-scroll">
    
      ${technicalSkills.slice(0, 8).map((s) => `
        <div class="skill-hex">
          <span class="skill-hex-name">${escapeHtml(s.name)}</span>
          <span class="skill-hex-level">${s.level}%</span>
        </div>`).join("")}
    </div>
    <div class="skill-row animate-on-scroll">
      ${technicalSkills.slice(8, 16).map((s) => `
        <div class="skill-hex">
          <span class="skill-hex-name">${escapeHtml(s.name)}</span>
          <span class="skill-hex-level">${s.level}%</span>
        </div>`).join("")}
    </div>
  `;

  const expHTML = experience.slice(0, 4).map((e) => `
    <div class="tl-item animate-on-scroll">
      <div class="tl-date"><div class="tl-date-text">${escapeHtml(e.duration)}</div></div>
      <div class="tl-body">
        <div class="tl-role">${escapeHtml(e.role)}</div>
        <div class="tl-company">${escapeHtml(e.company)}</div>
        ${e.description ? `<div class="tl-desc">${escapeHtml(e.description)}</div>` : ""}
        ${Array.isArray(e.achievements) && e.achievements.length?`<ul style="list-style:none;margin-top:12px">${e.achievements.slice(0,3).map((a) => `<li style="font-size:0.82rem;color:rgba(255,255,255,0.35);padding:4px 0;padding-left:16px;position:relative"><span style="position:absolute;left:0;color:${A}">▸</span>${escapeHtml(a)}</li>`).join("")}</ul>` : ""}
      </div>
    </div>`).join("");
const safeProjects = Array.isArray(projects)
  ? projects
  : Object.values(projects || {});
  const projHTML = safeProjects.slice(0, 6).map((p) => `
    <div class="proj-card animate-on-scroll">
      <div class="proj-name">${escapeHtml(p.name)}</div>
      ${p.description ? `<div class="proj-desc">${escapeHtml(p.description)}</div>` : ""}
      ${Array.isArray(p.technologies) && p.technologies.length
  ? `<div class="proj-tags">
      ${p.technologies
  .slice(0,5)
  .map((t) => `
    <span class="proj-tag">
      ${escapeHtml(t)}
    </span>
  `)
  .join("")}
     </div>`
  : ""}
      <div class="proj-actions">
        ${p.githubUrl ? `<a href="${escapeHtml(p.githubUrl)}" class="proj-btn" target="_blank">↗ Source</a>` : ""}
        ${p.liveUrl   ? `<a href="${escapeHtml(p.liveUrl)}"   class="proj-btn" target="_blank">↗ Live</a>` : ""}
      </div>
    </div>`).join("");

  const body = `
    <div class="mesh-bg"></div>
    <div class="grid-overlay"></div>

    <nav>
      <div class="nav-brand"><div class="nav-dot"></div><span class="nav-name">${escapeHtml(personal.name)}</span></div>
      <ul class="nav-links">
        <li><a href="#about">About</a></li><li><a href="#skills">Skills</a></li>
        <li><a href="#experience">Work</a></li><li><a href="#projects">Projects</a></li>
      </ul>
      ${personal.email ? `<a href="mailto:${escapeHtml(personal.email)}" class="nav-cta">Contact</a>` : ""}
    </nav>

    <section class="hero" id="home">
      <div class="hero-inner">
        <div class="animate-on-scroll">
          <div class="hero-tag">// ${escapeHtml(meta.industry)} · ${escapeHtml(meta.experienceLevel)}</div>
          <h1 class="hero-h1">
            <span class="line1">${escapeHtml(personal.name.split(" ")[0])}</span><br>
            <span class="line2">${escapeHtml(personal.name.split(" ").slice(1).join(" ") || personal.title)}</span>
          </h1>
          <p class="hero-subtitle">${escapeHtml(copy?.heroSubheadline || personal.tagline)}</p>
          <div class="hero-stats">
            <div class="stat-block"><div class="stat-num">${meta.totalYearsExperience || "3"}+</div><div class="stat-label">Years Exp</div></div>
            <div class="stat-block"><div class="stat-num">${experience.length || "5"}+</div><div class="stat-label">Roles</div></div>
            <div class="stat-block"><div class="stat-num">${safeProjects.length || "8"}+</div><div class="stat-label">Projects</div></div>
          </div>
          <div class="hero-btns">
            ${personal.email    ? `<a href="mailto:${escapeHtml(personal.email)}" class="btn-holo btn-holo-fill">Get in Touch</a>` : ""}
            ${personal.linkedin ? `<a href="${escapeHtml(personal.linkedin)}"      class="btn-holo btn-holo-ghost" target="_blank">LinkedIn</a>` : ""}
            ${personal.github   ? `<a href="${escapeHtml(personal.github)}"        class="btn-holo btn-holo-ghost" target="_blank">GitHub</a>` : ""}
          </div>
        </div>
        <div class="orbital animate-on-scroll">
          <div class="orbital-ring ring1"></div>
          <div class="orbital-ring ring2"></div>
          <div class="orbital-ring ring3"></div>
          <div class="avatar-center">${escapeHtml(personal.initials || "ME")}</div>
        </div>
      </div>
    </section>

    <section id="about">
      <div class="sec-eyebrow">About</div>
      <h2 class="sec-h2">Who I <span>Am</span></h2>
      <p style="color:rgba(255,255,255,0.45);max-width:680px;line-height:1.9;font-size:0.97rem;" class="animate-on-scroll">${escapeHtml(copy?.aboutParagraph1 || personal.bio)}</p>
      ${copy?.aboutParagraph2 ? `<p style="color:rgba(255,255,255,0.3);max-width:640px;line-height:1.8;font-size:0.9rem;margin-top:16px" class="animate-on-scroll">${escapeHtml(copy.aboutParagraph2)}</p>` : ""}
    </section>

    <section id="skills" style="background:${P}05">
      <div class="sec-eyebrow">Capabilities</div>
      <h2 class="sec-h2">Tech <span>Stack</span></h2>
      <div class="skills-wrap">${skillsHTML}</div>
    </section>

    <section id="experience">
      <div class="sec-eyebrow">Career</div>
      <h2 class="sec-h2">Work <span>Experience</span></h2>
      <div class="timeline-futuristic">${expHTML || "<p style='color:rgba(255,255,255,0.3)'>No experience data available.</p>"}</div>
    </section>

    <section id="projects" style="background:${P}03">
      <div class="sec-eyebrow">Portfolio</div>
      <h2 class="sec-h2">Featured <span>Projects</span></h2>
      <div class="proj-grid">${projHTML || "<p style='color:rgba(255,255,255,0.3)'>No projects listed.</p>"}</div>
    </section>

    <section id="contact">
      <div class="contact-container animate-on-scroll">
        <div class="sec-eyebrow">Contact</div>
        <h2 class="sec-h2">${escapeHtml(copy?.callToAction || "Let's <span>Connect</span>")}</h2>
        <p style="color:rgba(255,255,255,0.35);max-width:500px;line-height:1.8">${escapeHtml(copy?.contactIntro || "Open to new opportunities.")}</p>
        <div class="contact-grid-fut">
          ${personal.email    ? `<a href="mailto:${escapeHtml(personal.email)}" class="contact-tile"><div class="contact-tile-label">Email</div><div class="contact-tile-value">${escapeHtml(personal.email)}</div></a>` : ""}
          ${personal.linkedin ? `<a href="${escapeHtml(personal.linkedin)}"     class="contact-tile" target="_blank"><div class="contact-tile-label">LinkedIn</div><div class="contact-tile-value">View Profile</div></a>` : ""}
          ${personal.github   ? `<a href="${escapeHtml(personal.github)}"       class="contact-tile" target="_blank"><div class="contact-tile-label">GitHub</div><div class="contact-tile-value">View Repos</div></a>` : ""}
          ${personal.location ? `<div class="contact-tile"><div class="contact-tile-label">Location</div><div class="contact-tile-value">${escapeHtml(personal.location)}</div></div>` : ""}
        </div>
      </div>
    </section>

    <footer>
      <span class="footer-l">© ${new Date().getFullYear()} ${escapeHtml(personal.name)} · Built with ResumeIQ AI</span>
      <span class="footer-r">RESUME_IQ // ${escapeHtml(meta.industry?.toUpperCase())}</span>
    </footer>
  `;

  return wrapHTML({ title: personal.name, primaryColor: P, accentColor: A, styles, body });
};