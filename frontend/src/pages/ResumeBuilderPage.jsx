import { useState } from "react";
import {
  Plus,
  Trash2,
  Download,
  Eye,
  Save,
  Sparkles,
  Mail,
  Phone,
  MapPin,
   Link,
  GitBranch
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { aiAPI } from "../services/api";
import html2pdf from "html2pdf.js";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const defaultResume = {
  personalInfo: { name: "", email: "", phone: "", location: "", linkedin: "", github: "", website: "" },
  summary: "",
  experience: [{ id: 1, company: "", title: "", startDate: "", endDate: "", current: false, bullets: [""] }],
  education: [{ id: 1, school: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" }],
  skills: { technical: "", soft: "", languages: "" },
  projects: [{ id: 1, name: "", url: "", description: "", tech: "" }],
  certifications: [{ id: 1, name: "", issuer: "", date: "" }],
};

const sections = ["Personal Info", "Summary", "Experience", "Education", "Skills", "Projects", "Certifications"];

export default function ResumeBuilderPage() {
  const [profileImage, setProfileImage] =
  useState(null);
  const [resume, setResume] = useState(defaultResume);
  const [activeSection, setActiveSection] = useState(0);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState("");
  const [template, setTemplate] =
  useState("modern");
  const navigate = useNavigate();

  const updateField = (section, field, value) => setResume(r => ({ ...r, [section]: { ...r[section], [field]: value } }));
  const updateTopLevel = (key, value) => setResume(r => ({ ...r, [key]: value }));

  const addItem = (key, template) => setResume(r => ({ ...r, [key]: [...r[key], { ...template, id: Date.now() }] }));
  const removeItem = (key, id) => setResume(r => ({ ...r, [key]: r[key].filter(i => i.id !== id) }));
  const updateItem = (key, id, field, value) => setResume(r => ({ ...r, [key]: r[key].map(i => i.id === id ? { ...i, [field]: value } : i) }));

  const addBullet = (expId) => setResume(r => ({
    ...r, experience: r.experience.map(e => e.id === expId ? { ...e, bullets: [...e.bullets, ""] } : e)
  }));
  const updateBullet = (expId, idx, val) => setResume(r => ({
    ...r, experience: r.experience.map(e => e.id === expId ? { ...e, bullets: e.bullets.map((b, i) => i === idx ? val : b) } : e)
  }));

  const handleAISummary = async () => {
    setAiLoading("summary");
    try {
      const res = await aiAPI.generateSummary(
  resume.experience
);
     updateTopLevel(
  "summary",
  res.data.summary || "AI generated summary"
);
    } catch (err) {
  console.log(err);
}finally { setAiLoading(""); }
  };
  const handleAISkills = async () => {

  setAiLoading("skills");

  try {

    const res = await aiAPI.getSkills(
      resume.experience.map(e => e.title).join(", ")
    );

    updateField(
      "skills",
      "technical",
      res.data.skills?.join(", ") || ""
    );

  } catch (err) {

    console.log(err);

  } finally {

    setAiLoading("");

  }
};

const handleAIBullets = async (expId) => {

  setAiLoading(expId);

  try {

    const exp = resume.experience.find(e => e.id === expId);

    const res = await aiAPI.generateBullets({
      title: exp.title,
      company: exp.company
    });

    setResume(r => ({
      ...r,
      experience: r.experience.map(e =>
        e.id === expId
          ? { ...e, bullets: res.data.bullets || [] }
          : e
      )
    }));

  } catch (err) {

    console.log(err);

  } finally {

    setAiLoading("");

  }
};

const handleATSKeywords = async () => {

  try {

    const res = await aiAPI.getATSKeywords(
      resume.summary
    );

    updateField(
      "skills",
      "technical",
      res.data.keywords.join(", ")
    );

  } catch (err) {

    console.log(err);

  }
};

  const handleSave = async () => {
    setSaving(true);
    try {await aiAPI.saveResume(resume); } catch (err) {
  console.log(err);
} finally { setSaving(false); }
  };
const handleDownload = async () => {

  const element =
    document.getElementById(
      "resume-preview"
    );

  if (!element) return;

  const opt = {

    margin: 0.2,

    filename: `${resume.personalInfo.name || "Resume"}_Resume.pdf`,

    image: {
      type: "jpeg",
      quality: 0.98,
    },

    html2canvas: {
      scale: 3,
      useCORS: true,
    },

    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },

    pagebreak: {
      mode: ["avoid-all"]
    }

  };

  await html2pdf()
    .set(opt)
    .from(element)
    .save();

};

  const inputCls = `
w-full
bg-white/[0.03]
backdrop-blur-xl
border
border-white/10
rounded-2xl
py-3
px-5
text-white
placeholder-white/30
focus:outline-none
focus:border-cyan-400/50
focus:bg-white/[0.05]
transition-all
duration-300
shadow-[0_0_20px_rgba(0,0,0,0.15)]
`;

  return (
    <>
    <button
  onClick={() => navigate("/dashboard")}
  className="
  flex
  items-center
  gap-2

  px-4
  py-2

  rounded-xl

  bg-white/5
  border
  border-cyan-500/20

  text-white/70

  hover:text-cyan-400
  hover:border-cyan-400/40
  hover:bg-cyan-500/10

  transition-all
  duration-300
  "
>
  <ArrowLeft size={18} />
  Exit
</button>
      <div className="
fixed inset-0
bg-[#020617]
overflow-hidden
-z-10
">

  {/* Glow 1 */}
  <div className="
  absolute
  top-[-200px]
  left-[-150px]
  w-[500px]
  h-[500px]
  bg-cyan-500/20
  blur-[140px]
  rounded-full
  animate-pulse
  " />

  {/* Glow 2 */}
  <div className="
  absolute
  bottom-[-250px]
  right-[-150px]
  w-[500px]
  h-[500px]
  bg-purple-500/20
  blur-[140px]
  rounded-full
  animate-pulse
  " />

  {/* Grid */}
  <div className="
  absolute
  inset-0
  bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
  bg-[size:40px_40px]
  " />

</div>
      <div className="
flex
flex-col
sm:flex-row

sm:items-center
justify-between

gap-4
mb-6
">
        <div>
          <h1 className="
text-4xl
font-black
tracking-tight
text-transparent
bg-clip-text
bg-gradient-to-r
from-cyan-400
via-blue-400
to-purple-500
drop-shadow-[0_0_30px_rgba(34,211,238,0.35)]
">
  Resume Maker
</h1>

<p className="
text-white/60
text-sm
mt-2
tracking-wide
font-medium
">
  Build ATS-optimized resumes with AI-powered assistance
</p>
        </div>
        <div className="
flex
flex-wrap

gap-2
w-full
sm:w-auto
">
          <button onClick={() => setPreview(!preview)}
            className="
flex
items-center
gap-2
px-4
py-2.5
bg-white/[0.04]
backdrop-blur-xl
border
border-white/10
text-white/70
hover:text-white
rounded-2xl
transition-all
duration-300
hover:bg-white/[0.08]
hover:border-cyan-400/20
">
            <Eye size={15} />{preview ? "Edit" : "Preview"}
          </button>
          <button onClick={handleSave} disabled={saving}
          className="
flex
items-center
gap-2
px-4
py-2.5
bg-white/[0.04]
backdrop-blur-xl
border
border-white/10
text-white/70
hover:text-white
rounded-2xl
transition-all
duration-300
hover:bg-white/[0.08]
hover:border-cyan-400/20
">
            <Save size={15} />{saving ? "Saving..." : "Save"}
          </button>
          <button onClick={handleDownload}
            className="
flex
items-center
gap-2
px-5
py-3
rounded-2xl
font-semibold
text-white
bg-gradient-to-r
from-cyan-500
via-blue-500
to-purple-600
hover:scale-105
transition-all
duration-300
shadow-[0_0_40px_rgba(59,130,246,0.35)]
" >
            <Download size={15} />Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Nav */}
        <div className="lg:col-span-1 space-y-1">
          {sections.map((s, i) => (
            <button key={s} onClick={() => setActiveSection(i)}
              className={`

min-w-[180px]
lg:w-full

text-left
px-5
py-4
rounded-2xl
backdrop-blur-xl
border
transition-all
duration-300

${
activeSection === i

? `
bg-gradient-to-r
from-cyan-500/20
to-purple-500/20
border-cyan-400/30
text-cyan-300
shadow-[0_0_30px_rgba(6,182,212,0.18)]
`

: `
bg-white/[0.03]
border-white/5
text-white/60
hover:bg-white/[0.05]
hover:text-white
`
}
`}>
              {s}
            </button>
          ))}
         <select
  value={template}
  onChange={(e) =>
    setTemplate(e.target.value)
  }
  className="
    w-full
    bg-slate-900
    text-white
    border
    border-cyan-500/40
    rounded-xl
    px-4
    py-3
    mt-3
    outline-none
    focus:border-cyan-400
    shadow-lg
  "
>

  <option
    value="modern"
    className="bg-slate-900 text-white"
  >
    Modern
  </option>

  <option
    value="classic"
    className="bg-slate-900 text-white"
  >
    Classic
  </option>

  <option
    value="minimal"
    className="bg-slate-900 text-white"
  >
    Minimal
  </option>

</select>
</div>
        {/* Form */}
 <div className="
lg:col-span-3
relative
overflow-hidden
bg-white/[0.04]
backdrop-blur-3xl
border
border-cyan-500/10
rounded-[32px]
p-4
sm:p-6
lg:p-8
shadow-[0_0_60px_rgba(6,182,212,0.08)]
">  <div className="
absolute
top-0
left-0
w-full
h-[2px]
bg-gradient-to-r
from-cyan-400
via-blue-500
to-purple-500
opacity-70
" />
  {activeSection === 0 && (
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Personal Information</h3>
              <div className="grid
grid-cols-1
md:grid-cols-2

gap-4">
                <div className="col-span-2">

  <label className="text-white/50 text-sm block mb-2">
    Profile Image
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {

      const file = e.target.files[0];

      if (file) {

        setProfileImage(
          URL.createObjectURL(file)
        );

      }

    }}
    className={inputCls}
  />

</div>
                {[["name","Full Name"],["email","Email"],["phone","Phone"],["location","Location"],["linkedin","LinkedIn URL"],["github","GitHub URL"],["website","Portfolio URL"]].map(([k,p]) => (
                  <input key={k} placeholder={p} value={resume.personalInfo[k]} onChange={e => updateField("personalInfo", k, e.target.value)} className={inputCls + (k === "name" || k === "website" ? " col-span-2" : "")} />
                ))}
              </div>
            </div>
          )}

          {activeSection === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">Professional Summary</h3>
                <button onClick={handleAISummary} disabled={aiLoading === "summary"}
                  className="flex items-center gap-1.5 text-xs text-indigo-400 border border-indigo-400/20 bg-indigo-400/5 px-3 py-1.5 rounded-lg hover:bg-indigo-400/10 transition-all">
                  <Sparkles size={12} />{aiLoading === "summary" ? "Generating..." : "AI Generate"}
                </button>
              </div>
              <textarea placeholder="Write a compelling professional summary..." value={resume.summary} onChange={e => updateTopLevel("summary", e.target.value)} rows={5}
                className={inputCls + " resize-none"} />
            </div>
          )}

          {activeSection === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">Work Experience</h3>
                <button onClick={() => addItem("experience", { company: "", title: "", startDate: "", endDate: "", current: false, bullets: [""] })}
                  className="flex items-center gap-1.5 text-xs text-white/60 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all">
                  <Plus size={12} />Add
                </button>
              </div>
              {resume.experience.map((exp, ei) => (
                <div key={exp.id} className="
group
relative
overflow-hidden
bg-white/[0.04]
backdrop-blur-2xl
border
border-cyan-500/10
rounded-3xl
p-5
hover:border-cyan-400/30
hover:shadow-[0_0_40px_rgba(6,182,212,0.12)]
transition-all
duration-500
">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs font-medium">Position {ei + 1}</span>
                    <button
  onClick={() => handleAIBullets(exp.id)}
  className="text-xs text-cyan-400"
>
  {aiLoading === exp.id
  ? "Generating..."
  : "AI Generate Bullets"}
</button>
                    {resume.experience.length > 1 && (
                      <button onClick={() => removeItem("experience", exp.id)} className="text-red-400/60 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                    )}
                  </div>
                  <div className="grid
grid-cols-1
md:grid-cols-2

gap-3">
                    {[["title","Job Title"],["company","Company"]].map(([k,p]) => (
                      <input key={k} placeholder={p} value={exp[k]} onChange={e => updateItem("experience", exp.id, k, e.target.value)} className={inputCls} />
                    ))}
                    {[["startDate","Start Date"],["endDate","End Date"]].map(([k,p]) => (
                      <input key={k} type="month" placeholder={p} value={exp[k]} onChange={e => updateItem("experience", exp.id, k, e.target.value)} className={inputCls} />
                    ))}
                  </div>
                  <div className="space-y-2">
                    <p className="text-white/40 text-xs">Bullet Points</p>
                    {exp.bullets.map((b, bi) => (
                      <input key={bi} placeholder={`• Achievement ${bi + 1}`} value={b} onChange={e => updateBullet(exp.id, bi, e.target.value)} className={inputCls} />
                    ))}
                    <button onClick={() => addBullet(exp.id)} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                      <Plus size={11} />Add bullet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">Education</h3>
                <button onClick={() => addItem("education", { school: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" })}
                  className="flex items-center gap-1.5 text-xs text-white/60 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"><Plus size={12} />Add</button>
              </div>
              {resume.education.map((edu, i) => (
                <div key={edu.id} className="
group
relative
overflow-hidden
bg-white/[0.04]
backdrop-blur-2xl
border
border-cyan-500/10
rounded-3xl
p-5
hover:border-cyan-400/30
hover:shadow-[0_0_40px_rgba(6,182,212,0.12)]
transition-all
duration-500
">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs">Education {i + 1}</span>
                    {resume.education.length > 1 && <button onClick={() => removeItem("education", edu.id)} className="text-red-400/60 hover:text-red-400"><Trash2 size={14} /></button>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[["school","School/University"],["degree","Degree"],["field","Field of Study"],["gpa","GPA"]].map(([k,p]) => (
                      <input key={k} placeholder={p} value={edu[k]} onChange={e => updateItem("education", edu.id, k, e.target.value)} className={inputCls} />
                    ))}
                    {[["startDate","Start"],["endDate","End"]].map(([k,p]) => (
                      <input key={k} type="month" placeholder={p} value={edu[k]} onChange={e => updateItem("education", edu.id, k, e.target.value)} className={inputCls} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 4 && (
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Skills</h3>
              <button
  onClick={handleAISkills}
  className="flex items-center gap-1.5 text-xs text-indigo-400 border border-indigo-400/20 bg-indigo-400/5 px-3 py-1.5 rounded-lg hover:bg-indigo-400/10 transition-all"
>
  <Sparkles size={12} />
  AI Suggest Skills
</button>
<button
  onClick={handleATSKeywords}
  className="flex items-center gap-1.5 text-xs text-cyan-400 border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 rounded-lg hover:bg-cyan-400/10 transition-all"
>
  <Sparkles size={12} />
  ATS Keywords
</button>
              {[["technical","Technical Skills","React, Node.js, Python, AWS..."],["soft","Soft Skills","Leadership, Communication..."],["languages","Languages","English (Native), Spanish (B2)..."]].map(([k,l,p]) => (
                <div key={k}>
                  <label className="text-white/50 text-sm mb-1.5 block">{l}</label>
                  <textarea placeholder={p} value={resume.skills[k]} onChange={e => updateField("skills", k, e.target.value)} rows={2} className={inputCls + " resize-none"} />
                </div>
              ))}
            </div>
          )}

          {activeSection === 5 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">Projects</h3>
                <button onClick={() => addItem("projects", { name: "", url: "", description: "", tech: "" })}
                  className="flex items-center gap-1.5 text-xs text-white/60 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"><Plus size={12} />Add</button>
              </div>
              {resume.projects.map((p, i) => (
                <div key={p.id} className="
group
relative
overflow-hidden
bg-white/[0.04]
backdrop-blur-2xl
border
border-cyan-500/10
rounded-3xl
p-5
hover:border-cyan-400/30
hover:shadow-[0_0_40px_rgba(6,182,212,0.12)]
transition-all
duration-500
">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs">Project {i + 1}</span>
                    {resume.projects.length > 1 && <button onClick={() => removeItem("projects", p.id)} className="text-red-400/60 hover:text-red-400"><Trash2 size={14} /></button>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Project Name" value={p.name} onChange={e => updateItem("projects", p.id, "name", e.target.value)} className={inputCls} />
                    <input placeholder="URL / GitHub Link" value={p.url} onChange={e => updateItem("projects", p.id, "url", e.target.value)} className={inputCls} />
                    <input placeholder="Tech Stack" value={p.tech} onChange={e => updateItem("projects", p.id, "tech", e.target.value)} className={inputCls + " col-span-2"} />
                    <textarea placeholder="Description" value={p.description} onChange={e => updateItem("projects", p.id, "description", e.target.value)} rows={2} className={inputCls + " col-span-2 resize-none"} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 6 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">Certifications</h3>
                <button onClick={() => addItem("certifications", { name: "", issuer: "", date: "" })}
                  className="flex items-center gap-1.5 text-xs text-white/60 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"><Plus size={12} />Add</button>
              </div>
              {resume.certifications.map((c, i) => (
                <div key={c.id} className="
group
relative
overflow-hidden
bg-white/[0.04]
backdrop-blur-2xl
border
border-cyan-500/10
rounded-3xl
p-5
hover:border-cyan-400/30
hover:shadow-[0_0_40px_rgba(6,182,212,0.12)]
transition-all
duration-500
">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs">Cert {i + 1}</span>
                    {resume.certifications.length > 1 && <button onClick={() => removeItem("certifications", c.id)} className="text-red-400/60 hover:text-red-400"><Trash2 size={14} /></button>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Certification Name" value={c.name} onChange={e => updateItem("certifications", c.id, "name", e.target.value)} className={inputCls + " col-span-2"} />
                    <input placeholder="Issuing Organization" value={c.issuer} onChange={e => updateItem("certifications", c.id, "issuer", e.target.value)} className={inputCls} />
                    <input type="month" placeholder="Date" value={c.date} onChange={e => updateItem("certifications", c.id, "date", e.target.value)} className={inputCls} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
     <div
  style={{
    position: "fixed",
    top: 0,
    left: preview ? "0" : "-9999px",
    width: "100%",
    zIndex: -1,
    background: "white"
  }}
>
<div
  id="resume-preview"
  className={`
    font-sans
    w-full
max-w-[950px]

overflow-hidden
    transition-all duration-500
    h-auto
    mx-auto
    shadow-[0_20px_60px_rgba(0,0,0,0.25)]
rounded-[32px]
overflow-hidden

    ${
      template === "modern"
        ? "bg-white text-black"

        : template === "classic"
        ? "bg-[#f8f6f2] text-black"

        : "bg-white text-gray-800 border border-gray-300"
    }
  `}
>
{/* MODERN TEMPLATE */}

{template === "modern" && (

<div className="
grid

grid-cols-1
md:grid-cols-3
">

  {/* SIDEBAR */}

  <div className="bg-slate-900 text-white p-8 sticky top-4">

    <div className="mb-10">

      {profileImage ? (

  <img
    src={profileImage}
    alt="Profile"
    className="
      w-28
      h-28
      rounded-full
      object-cover
      border-4
      border-cyan-400
      mb-5
    "
  />

) : (

  <div className="w-28 h-28 rounded-full bg-slate-700 mb-5"></div>

)}

      <h1 className="text-3xl font-bold">
        {resume.personalInfo.name || "Your Name"}
      </h1>

      <p className="text-slate-300 mt-2">
        {resume.experience[0]?.title || "Full Stack Developer"}
      </p>

    </div>

    {/* CONTACT */}
    
    <div className="mb-10">

      <h2 className="text-lg font-semibold border-b border-slate-700 pb-2 mb-4">
        Contact
      </h2>

      <div className="space-y-3 text-sm">

  <div className="flex items-center gap-2">
    <Mail size={16} />
    <span>{resume.personalInfo.email}</span>
  </div>

  <div className="flex items-center gap-2">
    <Phone size={16} />
    <span>{resume.personalInfo.phone}</span>
  </div>

  <div className="flex items-center gap-2">
    <MapPin size={16} />
    <span>{resume.personalInfo.location}</span>
  </div>

  <div className="flex items-center gap-2">
    <Link size={16} />
    <span>{resume.personalInfo.linkedin}</span>
  </div>

  {/* ADD HERE */}

  <div className="flex items-center gap-2">
    <Link size={16} />
    <span>{resume.personalInfo.website}</span>
  </div>

</div>
</div>
         

    {/* SKILLS */}

    <div>

      <h2 className="text-lg font-semibold border-b border-slate-700 pb-2 mb-4">
        Skills
      </h2>

      <div className="flex flex-wrap gap-2">

        {resume.skills.technical
  ?.split(",")
  .filter(skill => skill.trim() !== "")
  .map((skill, i) => (

          <span
            key={i}
            className="bg-slate-700 px-3 py-1 rounded-full text-xs"
          >
            {skill}
          </span>

        ))}

      </div>

    </div>

  </div>

  {/* MAIN CONTENT */}

  <div className="
col-span-2

p-5
sm:p-8
lg:p-10
">

    {/* SUMMARY */}

    <section
  className="mb-10"
  style={{ pageBreakInside: "avoid" }}
>

      <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">
        Professional Summary
      </h2>

      <p className="text-gray-700 leading-8">
        {resume.summary}
      </p>

    </section>

    {/* EXPERIENCE */}

    <section
  className="mb-10"
  style={{ pageBreakInside: "avoid" }}
>

      <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">
        Experience
      </h2>

      {resume.experience.map((exp) => (

        <div
          key={exp.id}
          className="mb-6 p-5 border border-gray-200 rounded-2xl shadow-sm"
        >

          <h3 className="text-xl font-semibold">
            {exp.title}
          </h3>

          <p className="text-indigo-600 font-medium">
            {exp.company}
          </p>

          <p className="text-sm text-gray-500 mb-3">
            {exp.startDate} - {exp.endDate}
          </p>

          <ul className="list-disc ml-5 space-y-2">

            {exp.bullets
  .filter(b => b.trim() !== "")
  .map((b, i) => (

              <li key={i}>
                {b}
              </li>

            ))}

          </ul>

        </div>

      ))}

    </section>
    {/* EDUCATION */}

<section
  className="mb-10"
  style={{ pageBreakInside: "avoid" }}
>

  <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">
    Education
  </h2>

  {resume.education.map((edu) => (

    <div
      key={edu.id}
      className="mb-6 p-5 border border-gray-200 rounded-2xl shadow-sm"
    >

      <h3 className="text-xl font-semibold">
        {edu.degree}
      </h3>

      <p className="text-indigo-600">
        {edu.school}
      </p>

      <p className="text-gray-600">
        {edu.field}
      </p>

      <p className="text-sm text-gray-500">
        {edu.startDate} - {edu.endDate}
      </p>

    </div>

  ))}

</section>



{/* PROJECTS */}

<section
  className="mb-10"
  style={{ pageBreakInside: "avoid" }}
>

  <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">
    Projects
  </h2>

  {resume.projects.map((p) => (

    <div
      key={p.id}
      className="mb-6 p-5 border border-gray-200 rounded-2xl shadow-sm"
    >

      <h3 className="text-xl font-semibold">
        {p.name}
      </h3>

      <p className="text-indigo-600 mb-2">
        {p.tech}
      </p>

      <p className="text-gray-700 mb-2">
        {p.description}
      </p>

      <p className="text-sm text-blue-600">
        {p.url}
      </p>

    </div>

  ))}

</section>



{/* CERTIFICATIONS */}

<section
  style={{ pageBreakInside: "avoid" }}
>

  <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">
    Certifications
  </h2>

  {resume.certifications.map((c) => (

    <div
      key={c.id}
      className="mb-4 p-4 border border-gray-200 rounded-xl"
    >

      <h3 className="font-semibold">
        {c.name}
      </h3>

      <p className="text-gray-600">
        {c.issuer}
      </p>

      <p className="text-sm text-gray-500">
        {c.date}
      </p>

    </div>

  ))}

</section>
</div>

</div>

)}
{/* CLASSIC TEMPLATE */}
{template === "classic" && (

<div className="grid md:grid-cols-12 grid-cols-1 bg-[#f4f1ea] text-gray-900">
<div className="md:col-span-4 bg-[#1e293b] text-white p-10">

    <div className="mb-10">
      {profileImage && (

  <img
    src={profileImage}
    alt="Profile"
    className="
      w-32
      h-32
      rounded-full
      object-cover
      border-4
      border-cyan-400
      mb-6
      shadow-xl
    "
  />

)}

      <h1 className="text-4xl font-extrabold leading-tight">
        {resume.personalInfo.name || "Your Name"}
      </h1>

      <p className="text-gray-300 mt-3 text-lg tracking-wide">
        {resume.experience[0]?.title || "Full Stack Developer"}
      </p>

    </div>

    {/* CONTACT */}

    <div className="mb-10">

      <h2 className="text-sm uppercase tracking-[4px] text-cyan-400 mb-5">
        Contact
      </h2>

        <div className="space-y-4 text-sm">

        <div className="flex items-center gap-3">
          <Mail size={16} />
          <span>{resume.personalInfo.email}</span>
        </div>

        <div className="flex items-center gap-3">
          <Phone size={16} />
          <span>{resume.personalInfo.phone}</span>
        </div>

        <div className="flex items-center gap-3">
          <MapPin size={16} />
          <span>{resume.personalInfo.location}</span>
        </div>

        <div className="flex items-center gap-3">
          <Link size={16} />
          <span>{resume.personalInfo.linkedin}</span>
        </div>

      </div>

    </div>

    {/* SKILLS */}

    <div>

      <h2 className="text-sm uppercase tracking-[4px] text-cyan-400 mb-5">
        Skills
      </h2>

      <div className="flex flex-wrap gap-2">

        {resume.skills.technical
  ?.split(",")
  .filter(skill => skill.trim() !== "")
  .map((skill, i) => (

          <span
            key={i}
            className="bg-cyan-500/20 border border-cyan-400/30 px-3 py-1 rounded-full text-xs"
          >
            {skill}
          </span>

        ))}

      </div>

    </div>

  </div>

  {/* RIGHT SIDE */}

  <div className="md:col-span-8 p-12">

    {/* SUMMARY */}

    <section
  className="mb-10"
  style={{ pageBreakInside: "avoid" }}
>

      <h2 className="text-3xl font-bold mb-4 text-slate-800">
        Professional Summary
      </h2>

      <p className="text-gray-700 leading-8 text-[15px]">
        {resume.summary}
      </p>

    </section>

    {/* EXPERIENCE */}

    <section
  className="mb-10"
  style={{ pageBreakInside: "avoid" }}
>

      <h2 className="text-3xl font-bold mb-6 text-slate-800">
        Experience
      </h2>

      {resume.experience.map((exp) => (

        <div
          key={exp.id}
          className="mb-8 bg-white rounded-2xl p-6 shadow-md border border-gray-200"
        >

          <div className="
flex

flex-col
md:flex-row

justify-between
items-start

gap-6
">

            <div>

              <h3 className="text-xl font-bold">
                {exp.title}
              </h3>

              <p className="text-cyan-600 font-medium">
                {exp.company}
              </p>

            </div>

            <p className="text-sm text-gray-500">
              {exp.startDate} - {exp.endDate}
            </p>

          </div>

          <ul className="list-disc ml-6 mt-4 space-y-2 text-gray-700">

            {exp.bullets
  .filter(b => b.trim() !== "")
  .map((b, i) => (
              <li key={i}>{b}</li>
            ))}

          </ul>

        </div>

      ))}

    </section>

    {/* EDUCATION */}

    <section
  className="mb-10"
  style={{ pageBreakInside: "avoid" }}
>

      <h2 className="text-3xl font-bold mb-6 text-slate-800">
        Education
      </h2>

      {resume.education.map((edu) => (

        <div
          key={edu.id}
          className="mb-5 bg-white p-5 rounded-2xl shadow-sm border"
        >

          <h3 className="text-lg font-bold">
            {edu.degree}
          </h3>

          <p className="text-cyan-600">
            {edu.school}
          </p>

          <p className="text-gray-600">
            {edu.field}
          </p>

        </div>

      ))}

    </section>

    {/* PROJECTS */}

    <section
  className="mb-10"
  style={{ pageBreakInside: "avoid" }}
>

      <h2 className="text-3xl font-bold mb-6 text-slate-800">
        Projects
      </h2>

      {resume.projects.map((p) => (

        <div
          key={p.id}
          className="mb-5 bg-white p-5 rounded-2xl shadow-sm border"
        >

          <h3 className="text-lg font-bold">
            {p.name}
          </h3>

          <p className="text-cyan-600 mb-2">
            {p.tech}
          </p>

          <p className="text-gray-700">
            {p.description}
          </p>

        </div>

      ))}

    </section>

    {/* CERTIFICATIONS */}

    <section>

      <h2 className="text-3xl font-bold mb-6 text-slate-800">
        Certifications
      </h2>

      {resume.certifications.map((c) => (

        <div
          key={c.id}
          className="mb-4 bg-white p-5 rounded-2xl shadow-sm border"
        >

          <h3 className="font-bold">
            {c.name}
          </h3>

          <p className="text-gray-600">
            {c.issuer}
          </p>

        </div>

      ))}

    </section>

  </div>

</div>

)}

{/* MINIMAL TEMPLATE */}


{template === "minimal" && (

<div className="bg-white text-gray-900  px-16 py-14">

  {/* HEADER */}

  <div className="flex md:flex-row flex-col justify-between items-start gap-6 border-b-4 border-gray-900 pb-8 mb-12">

    <div>
{profileImage && (

  <img
    src={profileImage}
    alt="Profile"
    className="
      w-24
      h-24
      rounded-full
      object-cover
      mb-6
    "
  />

)}
      <h1 className="text-5xl font-black tracking-tight">
        {resume.personalInfo.name || "Your Name"}
      </h1>

      <p className="text-gray-500 mt-3 text-xl">
        {resume.experience[0]?.title || "Full Stack Developer"}
      </p>

    </div>

    <div className="text-sm text-right space-y-2">

      <p>{resume.personalInfo.email}</p>

      <p>{resume.personalInfo.phone}</p>

      <p>{resume.personalInfo.location}</p>
      <p>{resume.personalInfo.github}</p>
      <p>{resume.personalInfo.website}</p>

      <p>{resume.personalInfo.linkedin}</p>

    </div>

  </div>

  {/* SUMMARY */}

  <section
  className="mb-12"
  style={{ pageBreakInside: "avoid" }}
>

    <h2 className="text-3xl font-extrabold tracking-tight mb-4">
      Summary
    </h2>

    <p className="text-gray-700 leading-8">
      {resume.summary}
    </p>

  </section>

  {/* EXPERIENCE */}

  <section
  className="mb-12"
  style={{ pageBreakInside: "avoid" }}
>

    <h2 className="text-2xl font-bold mb-6">
      Experience
    </h2>

    {resume.experience.map((exp) => (

      <div key={exp.id} className="mb-8">

        <div className="flex md:flex-row flex-col justify-between gap-2">

          <div>

            <h3 className="text-xl font-bold">
              {exp.title}
            </h3>

            <p className="text-gray-600">
              {exp.company}
            </p>

          </div>

          <p className="text-sm text-gray-500">
            {exp.startDate} - {exp.endDate}
          </p>

        </div>

        <ul className="list-disc ml-6 mt-3 space-y-2 text-gray-700">

          {exp.bullets
  .filter(b => b.trim() !== "")
  .map((b, i) => (
            <li key={i}>{b}</li>
          ))}

        </ul>

      </div>

    ))}

  </section>

  {/* SKILLS */}

  <section
  className="mb-12"
  style={{ pageBreakInside: "avoid" }}
>

    <h2 className="text-2xl font-bold mb-6">
      Skills
    </h2>

    <div className="flex flex-wrap gap-3">

      {resume.skills.technical
  ?.split(",")
  .filter(skill => skill.trim() !== "")
  .map((skill, i) => (

        <span
          key={i}
          className="bg-gray-100 px-4 py-2 rounded-xl text-sm font-medium"
        >
          {skill}
        </span>

      ))}

    </div>

  </section>

  {/* EDUCATION */}

  <section
  className="mb-12"
  style={{ pageBreakInside: "avoid" }}
>

    <h2 className="text-2xl font-bold mb-6">
      Education
    </h2>

    {resume.education.map((edu) => (

      <div key={edu.id} className="mb-5">

        <h3 className="text-lg font-bold">
          {edu.degree}
        </h3>

        <p className="text-gray-600">
          {edu.school}
        </p>

      </div>

    ))}

  </section>

  {/* PROJECTS */}

<section
  className="mb-12"
  style={{ pageBreakInside: "avoid" }}
>

    <h2 className="text-2xl font-bold mb-6">
      Projects
    </h2>

    {resume.projects.map((p) => (

      <div key={p.id} className="mb-5">

        <h3 className="text-lg font-bold">
          {p.name}
        </h3>

        <p className="text-gray-500">
          {p.tech}
        </p>

        <p className="mt-2 text-gray-700">
          {p.description}
        </p>

      </div>

    ))}

  </section>

  {/* CERTIFICATIONS */}

  <section>

    <h2 className="text-2xl font-bold mb-6">
      Certifications
    </h2>

    {resume.certifications.map((c) => (

      <div key={c.id} className="mb-4">

        <h3 className="font-bold">
          {c.name}
        </h3>

        <p className="text-gray-600">
          {c.issuer}
        </p>

      </div>

    ))}

  </section>

</div>

)}
</div>

</div>
    </>
  );
}