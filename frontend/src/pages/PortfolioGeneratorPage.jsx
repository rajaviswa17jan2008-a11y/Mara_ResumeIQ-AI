// frontend/pages/PortfolioGeneratorPage.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { generatePortfolio } from "../services/portfolioAPI";
import PortfolioLoader from "../components/Portfolio/PortfolioLoader";
import "../styles/portfolio.css";
import { useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
const steps = ["Personal Info", "Skills", "Projects", "Preferences"];

const defaultForm = {
  name: "",
  title: "",
  bio: "",
  email: "",
  phone: "",
  github: "",
  linkedin: "",
  website: "",
  profileImage: null,
  skills: "",
  projects: [
    {
      name: "",
      description: "",
      tech: "",
      link: "",
    },
  ],
  template: "cyberpunk",
  colorScheme: "cyan",
};

export default function PortfolioGeneratorPage() {
  const [step, setStep] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

const location = useLocation();
const selectedTemplate =
  location.state?.template ||
  "cyberpunk";
console.log(
  "SELECTED TEMPLATE =",
  selectedTemplate
);
  console.log(
  "LOCATION STATE =",
  location.state
);

const [form, setForm] = useState({
  ...defaultForm,
  template: selectedTemplate
});
  const updateField = (field, val) => setForm((f) => ({ ...f, [field]: val }));
  const updateProject = (i, field, val) => {
    const p = [...form.projects];
    p[i][field] = val;
    setForm((f) => ({ ...f, projects: p }));
  };
  const addProject = () => setForm((f) => ({ ...f, projects: [...f.projects, { name: "", description: "", tech: "", link: "" }] }));
  const removeProject = (i) => setForm((f) => ({ ...f, projects: f.projects.filter((_, idx) => idx !== i) }));

  const handleGenerate = async () => {
    console.log("FORM DATA =", form);
    setLoading(true);
    setError(null);
    try {
      const data = await generatePortfolio(form);
      console.log("API RESPONSE =", data);
     navigate("/portfolio-preview", {
  state: {
    portfolioData: data.data.portfolioData,
    template: form.template
  }
});
    } catch (e) {
      setError(e.message || "Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[#ffffff05] border border-[#ffffff10] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#00f0ff]/50 focus:shadow-[0_0_15px_#00f0ff15] transition-all duration-300";
  const labelClass = "text-xs font-mono text-gray-400 uppercase tracking-widest mb-2 block";

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#bf00ff]/5 blur-[120px]" />
        <div className="absolute bottom-0 left-[-5%] w-[400px] h-[400px] rounded-full bg-[#00f0ff]/5 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(#bf00ff 1px, transparent 1px), linear-gradient(90deg, #bf00ff 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>
      <div className="relative z-20 p-4">
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
</div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#bf00ff]/30 bg-[#bf00ff]/5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#bf00ff] animate-pulse" />
            <span className="text-[#bf00ff] text-xs font-mono tracking-widest uppercase">Portfolio AI Generator</span>
          </div>
          <h1 className="text-5xl font-extrabold mb-4">
            <span className="text-white">Build Your </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bf00ff] to-[#00f0ff]">Dream Portfolio</span>
          </h1>
          <p className="text-gray-400 text-base max-w-xl mx-auto">Fill in your details. Our AI crafts a stunning, personalized portfolio in seconds.</p>
        </motion.div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-10 px-2">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <button
                onClick={() => i <= step && setStep(i)}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${i <= step ? "cursor-pointer" : "cursor-default opacity-40"}`}
              >
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  i < step ? "border-[#00ff9f] bg-[#00ff9f]/10 text-[#00ff9f]" : i === step ? "border-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff]" : "border-[#ffffff15] text-gray-600"
                }`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span className={`text-xs font-mono ${i === step ? "text-[#00f0ff]" : "text-gray-600"}`}>{s}</span>
              </button>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px mx-2" style={{ background: i < step ? "linear-gradient(90deg, #00ff9f, #00f0ff)" : "#ffffff10" }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="rounded-2xl border border-[#ffffff10] bg-[#ffffff03] backdrop-blur-xl p-8"
        >
          {/* Step 0: Personal Info */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[["name", "Full Name", "John Doe"], ["title", "Professional Title", "Full Stack Developer"], ["email", "Email", "john@example.com"], ["phone", "Phone", "+1 234 567 8900"], ["github", "GitHub URL", "https://github.com/johndoe"], ["linkedin", "LinkedIn URL", "https://linkedin.com/in/johndoe"], ["website", "Personal Website", "https://johndoe.dev"]].map(([field, label, placeholder]) => (
                  <div key={field}>
                    <label className={labelClass}>{label}</label>
                    <input className={inputClass} value={form[field]} onChange={(e) => updateField(field, e.target.value)} placeholder={placeholder} />
                  </div>
                ))}
              </div>
              <div>
                <label className={labelClass}>Bio </label>
                <textarea className={`${inputClass} resize-none h-28`} value={form.bio} onChange={(e) => updateField("bio", e.target.value)} placeholder="Write a compelling bio about yourself..." />
                  <div>
                    <div>
  <label className={labelClass}>
    About Me
  </label>

  <textarea
    className={`${inputClass} resize-none h-28`}
    value={form.aboutMe}
    onChange={(e) =>
      updateField(
        "aboutMe",
        e.target.value
      )
    }
    placeholder="Write about yourself..."
  />
</div>
  <label className={labelClass}>
    Profile Image
  </label>

  <input
    type="file"
    accept="image/*"
    className={inputClass}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        profileImage: e.target.files[0],
      }))
    }
  />
</div>
              </div>
            </div>
          )}

          {/* Step 1: Skills */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white mb-6">Skills & Technologies</h2>
              <div>
                <label className={labelClass}>Skills (comma-separated)</label>
                <textarea className={`${inputClass} resize-none h-32`} value={form.skills} onChange={(e) => updateField("skills", e.target.value)} placeholder="React, Node.js, TypeScript, Python, AWS, Docker, MongoDB..." />
                <p className="text-gray-600 text-xs mt-2">Each skill will be displayed as a visual badge in your portfolio.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-[#ffffff08] bg-[#ffffff02]">
                <p className="text-xs font-mono text-gray-500 uppercase tracking-wide mb-3">Preview</p>
                <div className="flex flex-wrap gap-2">
                  {form.skills.split(",").filter(Boolean).map((s) => (
                    <span key={s} className="text-xs px-3 py-1.5 rounded-lg border border-[#00f0ff]/30 bg-[#00f0ff]/5 text-[#00f0ff]">{s.trim()}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Projects */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Projects</h2>
                <button onClick={addProject} className="text-xs px-4 py-2 rounded-xl border border-[#00f0ff]/30 text-[#00f0ff] hover:bg-[#00f0ff]/10 transition-all">+ Add Project</button>
              </div>
              {form.projects.map((proj, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-xl border border-[#ffffff08] bg-[#ffffff02] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-500">Project {i + 1}</span>
                    {form.projects.length > 1 && <button onClick={() => removeProject(i)} className="text-xs text-red-400/60 hover:text-red-400 transition-colors">Remove</button>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[["name", "Project Name", "My Awesome App"], ["link", "Project Link", "https://github.com/..."], ["tech", "Tech Stack", "React, Node.js, MongoDB"]].map(([f, l, ph]) => (
                      <div key={f}>
                        <label className={labelClass}>{l}</label>
                        <input className={inputClass} value={proj[f]} onChange={(e) => updateProject(i, f, e.target.value)} placeholder={ph} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea className={`${inputClass} resize-none h-20`} value={proj.description} onChange={(e) => updateProject(i, "description", e.target.value)} placeholder="Describe what this project does and your role..." />
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">Portfolio Preferences</h2>
              <div>
                <label className={labelClass}>Template Style</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: "cyberpunk", label: "Cyberpunk", color: "#00f0ff", desc: "Neon & Dark" },
                    { id: "glassmorphism", label: "Glass", color: "#bf00ff", desc: "Frosted UI" },
                    { id: "minimal", label: "Minimal", color: "#ffffff", desc: "Clean & Simple" },
                    { id: "futuristic", label: "Futuristic", color: "#00ff9f", desc: "Sci-Fi Vibes" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => updateField("template", t.id)}
                      className={`p-4 rounded-xl border text-left transition-all duration-300 ${form.template === t.id ? "border-current bg-current/10" : "border-[#ffffff10] bg-[#ffffff03] hover:border-[#ffffff20]"}`}
                      style={{ color: t.color }}
                    >
                      <p className="font-bold text-sm">{t.label}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>Color Accent</label>
                <div className="flex gap-3">
                  {[
                    { id: "cyan", color: "#00f0ff" }, { id: "purple", color: "#bf00ff" },
                    { id: "green", color: "#00ff9f" }, { id: "orange", color: "#f97316" },
                    { id: "pink", color: "#ec4899" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => updateField("colorScheme", c.id)}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-200 hover:scale-110 ${form.colorScheme === c.id ? "scale-110" : "border-transparent opacity-60"}`}
                      style={{ background: c.color, borderColor: form.colorScheme === c.id ? "white" : "transparent" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="px-6 py-3 rounded-xl border border-[#ffffff15] text-gray-400 hover:text-white hover:border-[#ffffff30] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
          >
            ← Back
          </button>
          {step < steps.length - 1 ? (
            <button onClick={() => setStep((s) => s + 1)} className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#bf00ff] text-black font-bold text-sm hover:shadow-[0_0_30px_#00f0ff40] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
              Next →
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#00ff9f] to-[#00f0ff] text-black font-bold text-sm hover:shadow-[0_0_30px_#00ff9f40] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Generating..." : "⚡ Generate Portfolio"}
            </button>
          )}
        </div>

        {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}
        <AnimatePresence>{loading && <PortfolioLoader />}</AnimatePresence>
      </div>
    </div>
  );
}