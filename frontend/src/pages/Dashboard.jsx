import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useResume } from "../context/ResumeContext";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  FileText, Cpu, Briefcase, MessageSquare, TrendingUp, Upload,
  ChevronRight, Zap, Star, Award, Bell, ArrowUp
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";

const scoreData = [
  { week: "W1", ats: 45, skill: 52 }, { week: "W2", ats: 58, skill: 61 },
  { week: "W3", ats: 63, skill: 70 }, { week: "W4", ats: 72, skill: 75 },
  { week: "W5", ats: 78, skill: 82 }, { week: "W6", ats: 85, skill: 88 },
];

const quickActions = [
  { label: "Upload Resume", icon: Upload, to: "/upload", color: "from-indigo-500 to-cyan-500", desc: "Analyze your resume" },
  { label: "AI Analysis", icon: Cpu, to: "/analysis", color: "from-violet-500 to-purple-600", desc: "Get AI feedback" },
  { label: "Job Matches", icon: Briefcase, to: "/jobs", color: "from-cyan-500 to-teal-500", desc: "Find opportunities" },
  { label: "AI Chatbot", icon: MessageSquare, to: "/chatbot", color: "from-pink-500 to-rose-500", desc: "Career guidance" },
];

//const recentActivity = [
  //{ action: "Resume analyzed", detail: "ATS Score: 85/100", time: "2h ago", icon: Cpu, color: "text-indigo-400" },
  //{ action: "3 Jobs matched", detail: "Senior Dev @ Meta", time: "5h ago", icon: Briefcase, color: "text-cyan-400" },
  //{ action: "Skill gap found", detail: "Add: Docker, K8s", time: "1d ago", icon: Zap, color: "text-yellow-400" },
  //{ action: "Interview prep", detail: "15 questions ready", time: "2d ago", icon: Star, color: "text-pink-400" },
//];
const recommendedJobs =

  JSON.parse(
    localStorage.getItem(
      "recommendedJobs"
    )
  ) || [];

const recentActivity = [

  ...recommendedJobs
    .slice(0, 3)
    .map((job) => ({

      action:
        "Job matched",

      detail:
        `${job.job_title} @ ${job.employer_name}`,

      time:
        "Recently",

      icon:
        Briefcase,

      color:
        "text-cyan-400"

    }))

];

export default function Dashboard() {
  const { user } = useAuth();
  const { resumes } = useResume();
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 17) setGreeting("Good afternoon");
    else if (h >= 17) setGreeting("Good evening");
  }, []);

  const activeResume =

  JSON.parse(
    localStorage.getItem(
      "activeResume"
    )
  );

  const statsCards = [

  {

    label: "ATS Score",

    value:
      activeResume?.atsScore || 0,

    unit: "/100",

    icon: Cpu,

    change: "+12"

  },

  {

    label: "Skills Found",

    value:
      activeResume?.skills
        ?.length || 0,

    unit: "skills",

    icon: Award,

    change: "+5"

  },

  {

    label: "Job Matches",

    value:
  JSON.parse(
    localStorage.getItem(
      "recommendedJobs"
    )
  )?.length || 0,

    unit: "jobs",

    icon: Briefcase,

    change: "+8"

  },

  {

  label: "Resumes",

  value:
    activeResume ? 1 : 0,

  unit:
    activeResume ? "file" : "files",

  icon: FileText,

  change: "+1"

}

];

  return (
    <DashboardLayout>
      <div className="
space-y-6
relative
overflow-hidden
">

  {/* CYBER GRID */}

  <div className="
  fixed
  inset-0
  bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]
  bg-[size:40px_40px]
  pointer-events-none
  -z-10
  " />

  {/* AI GLOW */}

  <div className="
  fixed
  top-10
  left-10
  w-72
  h-72
  bg-cyan-500/20
  rounded-full
  blur-[120px]
  animate-pulse
  -z-10
  " />

  <div className="
  fixed
  bottom-10
  right-10
  w-96
  h-96
  bg-purple-500/20
  rounded-full
  blur-[150px]
  animate-pulse
  -z-10
  " />

  <div className="
  fixed
  top-1/2
  left-1/2
  -translate-x-1/2
  -translate-y-1/2
  w-[500px]
  h-[500px]
  bg-blue-500/10
  rounded-full
  blur-[180px]
  -z-10
  " />
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
          <div>
            
            <h1 className="
text-4xl
font-black
mt-1
bg-gradient-to-r
from-cyan-400
via-blue-500
to-purple-500
bg-clip-text
text-transparent
tracking-tight
">{user?.name || "Welcome back"}</h1>
            <p className="text-white/50 text-sm mt-1">Your career intelligence dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-cyan-400/40
hover:-translate-y-1
hover:shadow-[0_0_40px_rgba(6,182,212,0.18)]
transition-all
duration-500
group">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-400 rounded-full" />
            </button>
            <Link to="/upload" className="
flex
items-center
gap-2
bg-gradient-to-r
from-cyan-500
via-blue-500
to-purple-600
text-white
px-5
py-2.5
rounded-2xl
text-sm
font-semibold
hover:scale-105
transition-all
duration-300
shadow-[0_0_35px_rgba(59,130,246,0.35)]
">
              <Upload size={15} /> Upload Resume
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white/[0.04]
backdrop-blur-2xl
border border-cyan-500/20
shadow-[0_0_35px_rgba(6,182,212,0.08)]">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br
from-cyan-500/20
to-purple-500/20
shadow-[0_0_25px_rgba(59,130,246,0.25)] flex items-center justify-center">
  {s.icon && (
    <s.icon size={18} className="text-indigo-400" />
  )}
</div>
                <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                  <ArrowUp size={11} />{s.change}
                </span>
              </div>
              <p className="text-white/40 text-xs mb-1">{s.label}</p>
              <p className="text-white font-bold text-2xl">{s.value}<span className="text-white/40 text-sm font-normal">{s.unit}</span></p>
            </motion.div>
          ))}
        </div>

        {/* Chart + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
           className="
lg:col-span-2
bg-white/[0.04]
backdrop-blur-2xl
border
border-cyan-500/20
rounded-3xl
p-6
shadow-[0_0_45px_rgba(6,182,212,0.08)]
hover:border-cyan-400/40
transition-all
duration-500
 ">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold">Progress Overview</h3>
              <div className="flex gap-4 text-xs text-white/40">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-400" />ATS Score</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" />Skill Match</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={scoreData}>
                <defs>
                  <linearGradient id="atsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="skillGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" stroke="#ffffff20" tick={{ fill: "#ffffff40", fontSize: 12 }} />
                <YAxis stroke="#ffffff20" tick={{ fill: "#ffffff40", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "#0f0f1a", border: "1px solid #ffffff15", borderRadius: 12, color: "#fff" }} />
                <Area type="monotone" dataKey="ats" stroke="#6366f1" fill="url(#atsGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="skill" stroke="#06b6d4" fill="url(#skillGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            className="
bg-white/[0.04]
backdrop-blur-2xl
border
border-purple-500/20
rounded-3xl
p-6
shadow-[0_0_45px_rgba(168,85,247,0.08)]
hover:border-purple-400/40
transition-all
duration-500
">
            <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <a.icon size={14} className={a.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{a.action}</p>
                    <p className="text-white/40 text-xs">{a.detail}</p>
                  </div>
                  <span className="text-white/30 text-xs flex-shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((a, i) => (
              <motion.div key={a.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * i }}>
                <Link to={a.to} className="
group
block
bg-white/[0.04]
backdrop-blur-2xl
border
border-cyan-500/20
rounded-3xl
p-5
hover:border-cyan-400/40
hover:bg-white/[0.06]
hover:-translate-y-1
hover:shadow-[0_0_45px_rgba(6,182,212,0.15)]
transition-all
duration-500
">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center mb-4 group-hover:scale-110
group-hover:rotate-3
transition-all
duration-500
shadow-[0_0_30px_rgba(59,130,246,0.3)]`}>
                    <a.icon size={22} className="text-white" />
                  </div>
                  <p className="text-white font-semibold text-sm">{a.label}</p>
                  <p className="text-white/40 text-xs mt-1">{a.desc}</p>
                  <div className="flex items-center gap-1 mt-3 text-white/30 group-hover:text-white/60 transition-colors">
                    <span className="text-xs">Open</span><ChevronRight size={12} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}