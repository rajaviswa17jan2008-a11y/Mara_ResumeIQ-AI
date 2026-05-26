import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Brain,
  Zap,
  Target,
  TrendingUp,
  Star,
  ArrowRight,
  ChevronDown,
  Play,
  Sparkles,
} from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "AI Resume Analysis",
    desc: "Deep NLP analysis of your resume.",
  },
  {
    icon: Target,
    title: "ATS Score Calculator",
    desc: "Improve ATS compatibility instantly.",
  },
  {
    icon: Zap,
    title: "Skill Gap Detection",
    desc: "Find missing skills for your target role.",
  },
  {
    icon: TrendingUp,
    title: "Smart Job Matching",
    desc: "Get AI-powered job recommendations.",
  },
  {
    icon: Star,
    title: "Interview AI Coach",
    desc: "Practice with AI-generated interview questions.",
  },
  {
    icon: Sparkles,
    title: "Career Chat AI",
    desc: "24/7 AI career assistant.",
  },
];

const STATS = [
  { value: "50K+", label: "Resumes Analyzed" },
  { value: "92%", label: "ATS Pass Rate" },
  { value: "10K+", label: "Jobs Matched" },
  { value: "4.9★", label: "User Rating" },
];

const TYPEWRITER_WORDS = [
  "Resume",
  "Career",
  "Future",
  "Success",
];

export default function Landing() {
  const [wordIdx, setWordIdx] = useState(0);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, -100]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIdx((prev) => (prev + 1) % TYPEWRITER_WORDS.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="
min-h-screen
text-white
overflow-x-hidden
relative
bg-[#020617]
">

  {/* Cyberpunk Background Glow */}
  <div className="
  absolute
  top-[-250px]
  left-[-200px]
  w-[500px]
  h-[500px]
  bg-cyan-500/20
  blur-[160px]
  rounded-full
  pointer-events-none
  " />

  <div className="
  absolute
  bottom-[-250px]
  right-[-200px]
  w-[500px]
  h-[500px]
  bg-purple-500/20
  blur-[160px]
  rounded-full
  pointer-events-none
  " />

  {/* AI Grid */}
  <div className="
  absolute
  inset-0
  bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
  bg-[size:40px_40px]
  pointer-events-none
  opacity-40
  " />
      {/* Navbar */}
      <nav className="
fixed
top-0
left-0
right-0
z-50
bg-black/30
backdrop-blur-2xl
border-b
border-cyan-500/10
shadow-[0_0_35px_rgba(6,182,212,0.08)]
">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="
text-3xl
font-black
text-transparent
bg-clip-text
bg-gradient-to-r
from-cyan-400
via-blue-400
to-purple-500
tracking-wide
drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]
">
            ResumeIQ AI
          </h1>

          <div className="flex gap-4">
            <Link to="/login" className="text-white/70 hover:text-white">
              Login
            </Link>

            <Link
              to="/signup"
              className="
bg-gradient-to-r
from-cyan-500
via-blue-500
to-purple-600
text-white
px-5
py-2.5
rounded-2xl
font-semibold
hover:scale-105
transition-all
duration-300
shadow-[0_0_35px_rgba(59,130,246,0.35)]
"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center text-center px-6">
        <motion.div style={{ y: heroY }}>
          <h1 className="
text-6xl
md:text-8xl
font-black
leading-tight
mb-6
tracking-tight
">
            Supercharge Your{" "}
            <span className="
text-transparent
bg-clip-text
bg-gradient-to-r
from-cyan-400
via-blue-400
to-purple-500
drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]
animate-pulse
">
              {TYPEWRITER_WORDS[wordIdx]}
            </span>
          </h1>

          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            AI-powered resume analyzer with ATS score,
            skill gap detection, and smart career insights.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="
bg-gradient-to-r
from-cyan-500
via-blue-500
to-purple-600
text-white
px-8
py-4
rounded-2xl
font-bold
flex
items-center
gap-2
hover:scale-105
transition-all
duration-300
shadow-[0_0_45px_rgba(59,130,246,0.35)]
"
            >
              Start Free
              <ArrowRight size={18} />
            </Link>

            <button className="
border
border-cyan-500/20
bg-white/[0.03]
backdrop-blur-2xl
px-8
py-4
rounded-2xl
flex
items-center
gap-2
justify-center
hover:border-cyan-400/40
hover:bg-white/[0.06]
transition-all
duration-300
">
              <Play size={18} />
              Watch Demo
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="
bg-white/[0.04]
backdrop-blur-2xl
border
border-cyan-500/20
rounded-3xl
p-6
hover:border-cyan-400/40
hover:-translate-y-1
hover:shadow-[0_0_40px_rgba(6,182,212,0.18)]
transition-all
duration-500
"
              >
                <h2 className="text-2xl font-bold text-cyan-400">
                  {stat.value}
                </h2>

                <p className="text-white/50 text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="absolute bottom-10 animate-bounce">
          <ChevronDown />
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="
group
relative
overflow-hidden
bg-white/[0.04]
backdrop-blur-2xl
border
border-purple-500/20
rounded-3xl
p-8
hover:border-cyan-400/40
hover:-translate-y-2
hover:shadow-[0_0_50px_rgba(6,182,212,0.18)]
transition-all
duration-500
"
              >
              <div className="
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
                <feature.icon
                  size={40}
                  className="text-cyan-400 mb-4"
                />

                <h3 className="text-xl font-bold mb-2">
                  {feature.title}
                </h3>

                <p className="text-white/60">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}