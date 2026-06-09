import { useResume } from "../context/ResumeContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, DollarSign, ExternalLink, Search, Zap, Star } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
const activeResume =

  JSON.parse(
    localStorage.getItem(
      "activeResume"
    )
  );
 const resumeSkills =
  activeResume?.skills ||
  activeResume?.missingKeywords ||
  [];

const targetRole =
  activeResume?.targetRole || "";

const summary =
  activeResume?.summary || "";

const allText = `
${resumeSkills.join(" ")}
${targetRole}
${summary}
`.toLowerCase();
  

export default function JobRecommendationPage() {
  const [jobs, setJobs] =
useState([]);
const [loading, setLoading] = useState(true);
const [initialLoad, setInitialLoad] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
 const [saved, setSaved] =
 useState(new Set());
 useEffect(() => {
 // const cachedJobs = localStorage.getItem("recommendedJobs");

//if (cachedJobs) {
 // setJobs(JSON.parse(cachedJobs));
 // setLoading(false);
//}

  const loadJobs = async () => {
    setLoading(true);

    const storedResume = JSON.parse(
      localStorage.getItem("activeResume")
    );

    if (!storedResume) {
  setLoading(false);
  return;
}

    const resumeSkills = (
  storedResume.skills ||
  storedResume.parsedData?.skills ||
  []
).map(skill =>

      typeof skill === "string"
        ? skill.toLowerCase()
        : skill.name.toLowerCase()
    );

    console.log(
      "RESUME SKILLS:",
      resumeSkills
    );
console.log("STORED RESUME:", storedResume);
console.log("TARGET ROLE:", storedResume.targetRole);
    const searchQuery =
  storedResume.targetRole ||
  resumeSkills.slice(0, 3).join(" ") ||
  "software developer";

    console.log(
      "SEARCH QUERY:",
      searchQuery
    );

   let apiJobs = [];

try {
  const { data } = await api.post(
  "/jobs/recommend",
  {
    resumeText:
      storedResume.rawText ||
      JSON.stringify(storedResume)
  }
);
console.log("FULL RESPONSE =", data);
console.log("DATA.DATA =", data.data);
console.log("DATA.DATA.JOBS =", data.data?.jobs);

apiJobs = data.data.jobs || [];
  console.log("API JOBS COUNT:", apiJobs?.length);
console.log("API JOBS:", apiJobs);
} catch (err) {
  console.log(err);
}
      if (!apiJobs || apiJobs.length === 0) {

  setJobs([]);
setLoading(false);

  return;
}

    console.log(
      "API JOBS:",
      apiJobs
    );

    const scoredJobs =
  apiJobs.slice(0, 12).map((job, index) => {

        const fullText = `
${job.title || ""}
${job.reason || ""}
`.toLowerCase();

const title =
(job.title || "").toLowerCase();
        let score = 0;

resumeSkills.forEach(skill => {

  if (title.includes(skill)) {
    score += 30;
  }

  if (fullText.includes(skill)) {
    score += 20;
  }

});

        return {

         id:
 `${index}-${job.title}`,
title:
 job.title,

company:
 "AI Recommended",

          location:
  "Remote",

          type:
  "Full-time",

          salary:
  job.job_min_salary && job.job_max_salary
    ? `₹${job.job_min_salary} - ₹${job.job_max_salary}`
    : "Not disclosed",

          posted:
            "Recently",

          logo:
  job.title?.[0] || "A",

          color:
            "from-cyan-500 to-blue-700",

          match:
 job.matchScore || 75,

          skills:
            resumeSkills.slice(0, 4),

          description:
 job.reason

        };

      });

   const sortedJobs =
  scoredJobs.sort(
    (a, b) =>
      b.match - a.match
  );

setJobs(sortedJobs);
setInitialLoad(false);
localStorage.setItem(
  "recommendedJobs",
  JSON.stringify(sortedJobs)
);
setLoading(false);

};

loadJobs();

}, []);
   const navigate = useNavigate();
 

  const toggleSave = (id, e) => {
    e.stopPropagation();
    setSaved(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const filtered = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || j.type === typeFilter;
    return matchSearch && matchType;
  });

  const matchColor = (m) => m >= 90 ? "text-emerald-400 bg-emerald-400/10" : m >= 80 ? "text-yellow-400 bg-yellow-400/10" : "text-white/50 bg-white/5";
;

const statsCards = [

  {

    title: "ATS Score",

    value:
      activeResume?.atsScore || 0,

    suffix: "/100"

  },

  {

    title: "Skills Found",

    value:
      (
  activeResume?.skills ||
  activeResume?.parsedData?.skills ||
  []
).length,

    suffix: "skills"

  },

  {

    title: "Job Matches",

    value:
      jobs.length || 0,

    suffix: "jobs"

  }

];
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
max-w-7xl
mx-auto
space-y-8
overflow-hidden
">

  {/* Neon Glow */}
  <div className="
  absolute
  top-[-150px]
  left-[-120px]
  w-[350px]
  h-[350px]
  bg-cyan-500/20
  blur-[140px]
  rounded-full
  animate-pulse
  " />

  <div className="
  absolute
  bottom-[-150px]
  right-[-120px]
  w-[350px]
  h-[350px]
  bg-purple-500/20
  blur-[140px]
  rounded-full
  animate-pulse
  " />

  {/* AI Grid */}
  <div className="
  absolute
  inset-0
  bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
  bg-[size:40px_40px]
  pointer-events-none
  " />
        <div>
          <h1 className="
text-5xl
font-black
tracking-tight
text-transparent
bg-clip-text
bg-gradient-to-r
from-cyan-400
via-blue-500
to-purple-500
drop-shadow-[0_0_35px_rgba(34,211,238,0.35)]
">Job Recommendations</h1>
          <p className="
text-white/50
text-sm
mt-2
tracking-wide
">AI-matched positions based on your resume profile</p>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs or companies..."
              className="
w-full
bg-white/[0.04]
backdrop-blur-2xl

border
border-cyan-500/20

rounded-2xl

py-3
pl-11
pr-5

text-white
placeholder-white/30

focus:outline-none
focus:border-cyan-400/50
focus:bg-white/[0.06]

transition-all
duration-300

shadow-[0_0_35px_rgba(6,182,212,0.08)]
"  ></input>
          </div>
          <button
  className="
  px-5
  py-2.5

  rounded-2xl

  text-sm
  font-semibold

  bg-gradient-to-r
  from-cyan-500
  to-purple-600

  text-white

  shadow-[0_0_35px_rgba(34,211,238,0.3)]
  "
>
  All Jobs
</button>
          
        </div>

        <div className={`grid gap-4 ${selectedJob ? "grid-cols-1 lg:grid-cols-5" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
          {/* Job Cards */}
          <div className={`${selectedJob ? "lg:col-span-2" : "md:col-span-2 lg:col-span-3"} grid gap-4 ${selectedJob ? "" : "md:grid-cols-2 lg:grid-cols-3"}`}>
           {loading && jobs.length === 0 ? (

  <div className="
  flex
  flex-col
  items-center
  justify-center
  py-24
  text-cyan-400
  animate-pulse
  ">

    <div className="
    w-14
    h-14
    border-4
    border-cyan-400/20
    border-t-cyan-400
    rounded-full
    animate-spin
    mb-5
    " />

    <p className="
    text-lg
    font-semibold
    ">
      AI finding best jobs for your resume...
    </p>

    <p className="
    text-white/40
    text-sm
    mt-2
    ">
      Analyzing skills & matching careers
    </p>

  </div>

) : !loading && filtered.length === 0 ? (

  <div className="
  text-white/50
  text-center
  py-20
  col-span-full
  ">
  AI couldn't find matching jobs right now
  </div>

) : null}
 {filtered.map((job, i) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                className={`
group
relative
overflow-hidden

bg-white/[0.04]
backdrop-blur-2xl

border
rounded-3xl

p-6
cursor-pointer

transition-all
duration-500

hover:-translate-y-2
hover:shadow-[0_0_55px_rgba(34,211,238,0.18)]

${
selectedJob?.id === job.id

? "border-cyan-400/40 shadow-[0_0_45px_rgba(34,211,238,0.18)]"

: "border-white/10 hover:border-cyan-400/30"
}
`}>
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
<div className="flex items-start justify-between mb-4">

  <div
    className={`
    w-12
    h-12

    rounded-2xl

    bg-gradient-to-br
    ${job.color}

    flex
    items-center
    justify-center

    text-white
    font-bold

    shadow-[0_0_30px_rgba(59,130,246,0.35)]

    group-hover:scale-110

    transition-all
    duration-300
    `}
  >
    {job.logo}
  </div>

  <div className="flex items-center gap-2">
                
                    <button onClick={(e) => toggleSave(job.id, e)}
                      className={`text-white/30 hover:text-yellow-400 transition-colors ${saved.has(job.id) ? "text-yellow-400" : ""}`}>
                      <Star size={16} fill={saved.has(job.id) ? "currentColor" : "none"} />
                    </button>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${matchColor(job.match)}`}>{job.match}% match</span>
                  </div>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{job.title}</h3>
                <p className="text-white/50 text-xs mb-3">{job.company}</p>
                <div className="flex items-center gap-3 text-white/40 text-xs mb-3">
                  <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
                  <span className="flex items-center gap-1"><Clock size={11} />{job.posted}</span>
                </div>
                <p className="text-emerald-400 text-sm font-semibold mb-3">{job.salary}</p>
                <div className="flex flex-wrap gap-1">
                  {job.skills.map(s => <span key={s} className="text-xs bg-white/5 text-white/50 px-2 py-0.5 rounded">{s}</span>)}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Job Detail */}
          {selectedJob && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="
lg:col-span-3

bg-white/[0.05]
backdrop-blur-2xl

border
border-cyan-500/20

rounded-3xl
p-8

h-fit
sticky
top-6

shadow-[0_0_55px_rgba(34,211,238,0.12)]

overflow-hidden
">

              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedJob.color} flex items-center justify-center text-white font-bold text-lg`}>{selectedJob.logo}</div>
                  <div>
                    <h2 className="text-white font-bold text-lg">{selectedJob.title}</h2>
                    <p className="text-white/60">{selectedJob.company}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedJob(null)} className="text-white/30 hover:text-white/60 text-xl leading-none">×</button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: MapPin, label: "Location", val: selectedJob.location },
                  { icon: Briefcase, label: "Type", val: selectedJob.type },
                  { icon: DollarSign, label: "Salary", val: selectedJob.salary },
                  { icon: Clock, label: "Posted", val: selectedJob.posted },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="bg-white/5 rounded-xl p-3">
                    <p className="text-white/40 text-xs mb-1 flex items-center gap-1"><Icon size={11} />{label}</p>
                    <p className="text-white text-sm font-medium">{val}</p>
                  </div>
                ))}
              </div>
              <div className="mb-6">
                <p className="text-white/60 text-sm mb-2">Required Skills</p>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map(s => <span key={s} className="text-sm bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-lg">{s}</span>)}
                </div>
              </div>
              <div className="flex items-center gap-2 mb-6 bg-white/5 rounded-xl p-4">
                <Zap size={16} className="text-yellow-400" />
                <div>
                  <p className="text-white text-sm font-semibold">{selectedJob.match}% Profile Match</p>
                  <p className="text-white/40 text-xs">Your resume matches most requirements</p>
                </div>
              </div>
              <a href="#" className="
relative
overflow-hidden

flex
items-center
justify-center
gap-2

w-full

bg-gradient-to-r
from-cyan-500
via-blue-500
to-purple-600

text-white

py-3.5
rounded-2xl

font-semibold

shadow-[0_0_45px_rgba(59,130,246,0.35)]

hover:scale-[1.02]
hover:shadow-cyan-400/40

transition-all
duration-300
">
                Apply Now <ExternalLink size={16} />
              </a>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}