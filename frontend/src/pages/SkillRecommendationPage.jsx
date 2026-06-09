import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, BookOpen, ExternalLink, TrendingUp, Star, Clock, ChevronRight } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { aiAPI } from "../services/api";
import { useResume } from "../context/ResumeContext";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
  

const emptySkills = {

  current: [],

  recommended: []

};


const priorityColors = {
  high: "from-red-500/20 to-orange-500/20 border-red-500/20",
  medium: "from-yellow-500/20 to-amber-500/20 border-yellow-500/20",
  low: "from-blue-500/20 to-cyan-500/20 border-blue-500/20"
};
const priorityBadge = { high: "bg-red-400/10 text-red-400", medium: "bg-yellow-400/10 text-yellow-400", low: "bg-blue-400/10 text-blue-400" };

export default function SkillRecommendationPage() {
  const navigate = useNavigate();
  const [data, setData] = useState({
  current: [],
  recommended: [],
});
  const [activeSkill, setActiveSkill] = useState(null);
  const [filter, setFilter] = useState("all");
  const activeResume =

  JSON.parse(
    localStorage.getItem(
      "activeResume"
    )
  );
      useEffect(() => {

  const storedResume = JSON.parse(
    localStorage.getItem("activeResume")
  );

  if (!storedResume) {
    setData(emptySkills);
    return;
  }

  const blockedWords = [
    "software engineer",
    "frontend developer",
    "full stack developer",
    "developer",
    "engineer",
    "intern",
    "fresher",
    "student",
    "career objective",
    "objective"
  ];

  const extractedSkills =
    (storedResume?.skills || [])
      .filter(skill => {

        const skillName =
          typeof skill === "string"
            ? skill.toLowerCase()
            : skill.name?.toLowerCase();

        return !blockedWords.some(word =>
          skillName?.includes(word)
        );
      });

  console.log(
    "EXTRACTED SKILLS:",
    extractedSkills
  );

  const formattedSkills =
    extractedSkills.map(skill => ({
      name:
        typeof skill === "string"
          ? skill
          : skill.name,

      level:
        Math.floor(Math.random() * 20) + 80,

      category:
        typeof skill === "object"
          ? skill.category || "Skill"
          : "Skill"
    }));

  setData({
    current: formattedSkills,
    recommended:
      storedResume.recommendations || []
  });

}, []);
  const categories = ["all", ...new Set(data.recommended.map(s => s.category))];
  const filtered = filter === "all" ? data.recommended : data.recommended.filter(s => s.category === filter);
  

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
  relative
  max-w-6xl
  mx-auto
  space-y-8
  overflow-hidden
  ">

    {/* Futuristic Background Glow */}
    <div className="
    absolute
    top-[-120px]
    left-[-120px]
    w-[320px]
    h-[320px]
    bg-cyan-500/20
    blur-[120px]
    rounded-full
    " />

    <div className="
    absolute
    bottom-[-120px]
    right-[-120px]
    w-[320px]
    h-[320px]
    bg-purple-500/20
    blur-[120px]
    rounded-full
    " />

    {/* AI Grid */}
    <div className="
    absolute
    inset-0
    bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
    bg-[size:40px_40px]
    pointer-events-none
    " />
        <div className="relative z-10">
  <h1 className="
  text-4xl
  font-black
  text-transparent
  bg-clip-text
  bg-gradient-to-r
  from-cyan-400
  via-blue-400
  to-purple-500
  ">Skill Recommendations</h1>
          <p className="text-white/50 text-sm mt-1">AI-powered skill gap analysis based on your resume</p>
        </div>

        {/* Current Skills */}
        <div className="
relative
z-10
bg-white/[0.04]
backdrop-blur-2xl
border
border-cyan-500/20
rounded-3xl
p-8
shadow-[0_0_45px_rgba(6,182,212,0.12)]
hover:border-cyan-400/40
transition-all
duration-500
">
          <h3 className="text-white font-semibold mb-5 flex items-center gap-2"><Star size={18} className="text-yellow-400" />Your Current Skills</h3>
          <div className="space-y-3">
  {data.current.length === 0 && (
    <p className="text-white/40 text-sm">
      No skills found. Upload and analyze resume first.
    </p>
  )}
         {data.current.map(s => (
              <div
  key={s.name}

  className="
  group
  relative
  flex
  items-center
  gap-4

  px-4
  py-3

  rounded-2xl

  bg-white/[0.03]
  border
  border-white/5

  hover:border-cyan-400/20
  hover:bg-white/[0.05]

  transition-all
  duration-300
  "
><div className="
absolute
top-0
left-0
w-full
h-[1px]

bg-gradient-to-r
from-cyan-400
via-blue-500
to-purple-500

opacity-0
group-hover:opacity-100

transition-all
duration-300
" />
                <span className="text-white/70 text-sm w-28">{s.name}</span>
                <span className="text-white/30 text-xs w-16 text-right">{s.category}</span>
                <div className="flex-1 bg-white/5 rounded-full h-2">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${s.level}%` }} transition={{ duration: 0.8 }}
                    className="
h-full
rounded-full

bg-gradient-to-r
from-cyan-400
via-blue-500
to-purple-500

shadow-[0_0_20px_rgba(34,211,238,0.45)]

animate-pulse
" />
                </div>
                <span className="text-white/60 text-sm w-10 text-right">{s.level}%</span>
              </div>
            ))}
               
          </div>
        </div> 
    

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`
px-5
py-2
rounded-2xl
text-sm
capitalize
font-semibold
transition-all
duration-300
backdrop-blur-xl
border
${
filter === c
? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-400/40 shadow-[0_0_30px_rgba(6,182,212,0.35)]"
: "bg-white/[0.04] border-white/10 text-white/60 hover:border-cyan-400/30 hover:text-white"
}
`}>
              {c}
            </button>
          ))}
        </div>

        {/* Recommended Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((skill, i) => (

  <motion.div
    key={skill.name}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.07 }}

    onClick={() =>
      setActiveSkill(
        activeSkill === skill.name
          ? null
          : skill.name
      )
    }

    className="
    relative
    overflow-hidden
    bg-white/[0.05]
    backdrop-blur-2xl
    border
    border-cyan-500/20
    rounded-3xl
    p-6
    cursor-pointer

    hover:border-cyan-400/40
    hover:shadow-[0_0_50px_rgba(6,182,212,0.18)]
    hover:-translate-y-1

    transition-all
    duration-500
    "
  >
    

    {/* Neon Top Border */}
    <div
      className="
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
      "
    />

    {/* Header */}
    <div className="flex items-start justify-between mb-4">

      <div>

        <div className="flex items-center gap-2 mb-1">

          <h3 className="text-white font-semibold">
            {skill.name}
          </h3>

          <span
            className={`
            text-xs
            px-2
            py-0.5
            rounded-full
            font-medium
            ${priorityBadge[skill.priority]}
            `}
          >
            {skill.priority}
          </span>

        </div>

        <p className="text-white/50 text-xs">
          {skill.reason}
        </p>

      </div>

      <ChevronRight
        size={16}
        className={`
        text-white/30
        transition-transform
        ${activeSkill === skill.name ? "rotate-90" : ""}
        `}
      />

    </div>

    {/* Stats */}
    <div className="flex gap-4 text-sm">

      <div className="flex items-center gap-1.5 text-emerald-400">
        <TrendingUp size={13} />
        <span>{skill.salary}</span>
      </div>

      <div className="flex items-center gap-1.5 text-white/50">
        <Clock size={13} />
        <span>{skill.time}</span>
      </div>

      <div className="flex items-center gap-1.5 text-cyan-400 ml-auto">
        <span className="font-semibold">
          {skill.demand}%
        </span>

        <span className="text-white/40">
          demand
        </span>
      </div>

    </div>

    {/* Progress */}
    <div className="mt-3 bg-white/10 rounded-full h-1.5">

      <motion.div
        className="
        h-full
        rounded-full
        bg-gradient-to-r
        from-indigo-400
        to-cyan-400
        "
        animate={{
          width: `${skill.demand}%`
        }}
        transition={{ duration: 0.6 }}
      />

    </div>

    {/* Expand */}
    {activeSkill === skill.name && (

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="
        mt-4
        pt-4
        border-t
        border-white/10
        "
      >

        <p className="text-white/60 text-xs mb-2">
          Learning Resources
        </p>

        <div className="space-y-1.5">

          {skill.resources?.map((r) => (

            <div
              key={r}
              className="
              flex
              items-center
              gap-2
              text-sm
              text-white/70
              hover:text-white
              transition-colors
              "
            >

              <BookOpen
                size={13}
                className="
                text-indigo-400
                flex-shrink-0
                "
              />

              <span>{r}</span>

              <ExternalLink
                size={11}
                className="text-white/30 ml-auto"
              />

            </div>

          ))}

        </div>

      </motion.div>

    )}

  </motion.div>

))}
        </div>
      </div>
    </>
  );
}