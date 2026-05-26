import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, User, Mail, Lock, Briefcase, ArrowRight, Check } from "lucide-react";

const steps = ["Account", "Profile", "Plan"];

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
  name: "", email: "", password: "", confirmPassword: "",
    jobTitle: "", experience: "", plan: "free"
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleNext = () => {
    setError("");
    if (step === 0) {
      if (!form.name || !form.email || !form.password) return setError("All fields required.");
      if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
      if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    }
    if (step < 2) setStep(step + 1);
  };

      const handleSubmit = async () => {

  setLoading(true);

  setError("");

  try {

    await signup(form);

    navigate("/dashboard");

  } catch (e) {

    setError(
      e.response?.data?.message ||
      "Registration failed."
    );

  } finally {

    setLoading(false);

  }

};                                                                               
  const plans = [
    { id: "free", name: "Free", price: "$0", features: ["3 Resume Scans/mo", "Basic ATS Score", "Job Board Access"] },
    { id: "pro", name: "Pro", price: "$19", features: ["Unlimited Scans", "AI Skill Coach", "Interview Prep", "Career Chatbot"] },
    { id: "enterprise", name: "Enterprise", price: "$49", features: ["Everything in Pro", "Team Analytics", "API Access", "Priority Support"] },
  ];

  return (
    <div className="
min-h-screen

flex
items-center
justify-center

px-4

relative
overflow-hidden

bg-[#030712]

before:absolute
before:inset-0

before:bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_30%)]

after:absolute
after:inset-0

after:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]

after:bg-[size:45px_45px]
">
      {/* bg grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="
absolute
top-[-120px]
left-[-120px]

w-[450px]
h-[450px]

bg-cyan-500/20
rounded-full
blur-[140px]

animate-pulse
" />

<div className="
absolute
bottom-[-120px]
right-[-120px]

w-[500px]
h-[500px]

bg-purple-600/20
rounded-full
blur-[160px]

animate-pulse
" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="
w-11
h-11

rounded-2xl

bg-gradient-to-br
from-cyan-400
via-blue-500
to-purple-600

shadow-[0_0_40px_rgba(59,130,246,0.45)]

flex
items-center
justify-center
">
              <span className="text-white font-black text-sm">R</span>
            </div>
            <span className="
text-transparent
bg-clip-text

bg-gradient-to-r
from-cyan-300
via-blue-400
to-purple-400

font-black
text-3xl
tracking-tight
">
ResumeIQ
</span>
          </Link>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all duration-300 ${
                i < step ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_25px_rgba(59,130,246,0.35)]" : i === step ? "bg-indigo-500/20 border border-indigo-500 text-indigo-400" : "bg-white/5 border border-white/10 text-white/30"
              }`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-sm ${i === step ? "text-white" : "text-white/30"}`}>{s}</span>
              {i < steps.length - 1 && <div className={`w-8 h-px ${i < step ? "bg-indigo-500" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        <div className="
relative
overflow-hidden

bg-white/[0.04]

backdrop-blur-2xl

border
border-cyan-400/10

rounded-[32px]

p-8

shadow-[0_0_60px_rgba(6,182,212,0.08)]

before:absolute
before:top-0
before:left-0
before:w-full
before:h-[2px]

before:bg-gradient-to-r
before:from-cyan-400
before:via-blue-500
before:to-purple-500

before:opacity-80
">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h2 className="
text-4xl
font-black

text-transparent
bg-clip-text

bg-gradient-to-r
from-white
via-cyan-200
to-purple-300

mb-2
">Create your account</h2>
                <p className="
text-white/50
text-base
leading-relaxed
mb-8
">Join 50,000+ professionals advancing their careers</p>
                {[
                  { icon: User, name: "name", placeholder: "Full Name", type: "text" },
                  { icon: Mail, name: "email", placeholder: "Email Address", type: "email" },
                ].map(({ icon: Icon, name, placeholder, type }) => (
                  <div key={name} className="relative">
                    <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type={type} name={name} placeholder={placeholder} value={form[name]} onChange={handleChange}
                      className="

w-full

bg-white/[0.04]
backdrop-blur-xl

border
border-white/10

rounded-2xl

py-3.5
pl-12
pr-4

text-white
placeholder-white/30

focus:outline-none
focus:border-cyan-400/50
focus:bg-white/[0.06]

transition-all
duration-300

shadow-[0_0_20px_rgba(0,0,0,0.15)]

"
                    />
                  </div>
                ))}
                {[
                  { name: "password", placeholder: "Password" },
                  { name: "confirmPassword", placeholder: "Confirm Password" },
                ].map(({ name, placeholder }) => (
                  <div key={name} className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type={showPassword ? "text" : "password"} name={name} placeholder={placeholder} value={form[name]} onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-11 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all text-sm"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                ))}
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button onClick={handleNext} className="

relative
overflow-hidden

w-full

bg-gradient-to-r
from-cyan-500
via-blue-500
to-purple-600

text-white

rounded-2xl

py-4

font-bold

flex
items-center
justify-center
gap-2

shadow-[0_0_45px_rgba(59,130,246,0.35)]

hover:scale-[1.02]
hover:shadow-cyan-400/30

transition-all
duration-300

">
                  Continue <ArrowRight size={16} />
                </button>
                <p className="text-center text-white/40 text-sm">Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Sign in</Link></p>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-1">Your Profile</h2>
                <p className="text-white/50 text-sm mb-6">Help us personalize your AI experience</p>
                <div className="relative">
                  <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text" name="jobTitle" placeholder="Current / Target Job Title" value={form.jobTitle} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 transition-all text-sm"
                  />
                </div>
                <select name="experience" value={form.experience} onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white/70 focus:outline-none focus:border-indigo-500/50 transition-all text-sm">
                  <option value="" className="bg-[#0a0a1a]">Years of Experience</option>
                  {["0-1 years","1-3 years","3-5 years","5-10 years","10+ years"].map(y => (
                    <option key={y} value={y} className="bg-[#0a0a1a]">{y}</option>
                  ))}
                </select>
                <button onClick={handleNext} className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  Continue <ArrowRight size={16} />
                </button>
                <button onClick={() => setStep(0)} className="w-full text-white/40 text-sm hover:text-white/60 transition-colors">← Back</button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold text-white mb-1">Choose a Plan</h2>
                <p className="text-white/50 text-sm mb-6">Start free, upgrade anytime</p>
                <div className="space-y-3 mb-6">
                  {plans.map(p => (
                    <div key={p.id} onClick={() => setForm({ ...form, plan: p.id })}
                      className={`relative border rounded-xl p-4 cursor-pointer transition-all ${form.plan === p.id ? "border-indigo-500 bg-indigo-500/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}>
                      {p.id === "pro" && <div className="absolute -top-2 right-4 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-xs px-3 py-0.5 rounded-full font-semibold">Popular</div>}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold">{p.name}</span>
                        <span className="text-indigo-400 font-bold">{p.price}<span className="text-white/40 text-xs font-normal">/mo</span></span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {p.features.map(f => <span key={f} className="text-white/50 text-xs bg-white/5 px-2 py-0.5 rounded">{f}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
                {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
                <button onClick={handleSubmit} disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60">
                  {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><ArrowRight size={16} /> Get Started</>}
                </button>
                <button onClick={() => setStep(1)} className="w-full text-white/40 text-sm hover:text-white/60 transition-colors mt-3">← Back</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}