import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Play, RefreshCw, ChevronRight, Star, Clock, Target, Sparkles, CheckCircle } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { aiAPI } from "../services/api";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = ["Behavioral", "Technical", "System Design", "HR", "Situational"];
const difficulty = ["Easy", "Medium", "Hard"];

export default function AIInterviewPage() {
  const [selectedCat, setSelectedCat] = useState("All");
  const [selectedDiff, setSelectedDiff] = useState("All");
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [activeQ, setActiveQ] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [recording, setRecording] = useState(false);
  const [jobRole, setJobRole] = useState("");
  const navigate = useNavigate();

  const generateQuestions = async () => {
    if (!jobRole) return;
    setGenerating(true);
    try {
      const res =
await aiAPI.generateInterviewQuestions({

  role: jobRole,

  category: selectedCat,

  difficulty: selectedDiff

});

setQuestions(
  res.data.questions
); 
      setQuestions(res.data.questions);
    } catch (err) {

  console.log(err);

  setQuestions([]);

} finally { setGenerating(false); }
  };

  const filtered = questions.filter(q =>
    (selectedCat === "All" || q.category === selectedCat) &&
    (selectedDiff === "All" || q.difficulty === selectedDiff)
  );
  const getAIFeedback = async () => {
  if (!answer.trim() || !activeQ) return;

  setLoadingFeedback(true);

  try {
    const res = await aiAPI.generateInterviewFeedback({
      question: activeQ.question,
      answer,
    });

    setFeedback(res.data);

  } catch (err) {
    console.log(err);

  } finally {
    setLoadingFeedback(false);
  }
};
 
 
  const scoreColor = (s) => s >= 80 ? "text-emerald-400" : s >= 60 ? "text-yellow-400" : "text-red-400";

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
overflow-hidden
min-h-screen
text-white
p-3 sm:p-6
bg-[#030712]
">
  {/* Futuristic Background */}
<div className="
absolute
inset-0
overflow-hidden
pointer-events-none
">

  {/* Gradient Glow */}
  <div className="
  absolute
  top-[-200px]
  left-[-150px]
  w-[500px]
  h-[500px]
  bg-cyan-500/20
  rounded-full
  blur-[140px]
  animate-pulse
  " />

  <div className="
  absolute
  bottom-[-250px]
  right-[-200px]
  w-[500px]
  h-[500px]
  bg-purple-500/20
  rounded-full
  blur-[160px]
  animate-pulse
  " />

  {/* Grid */}
  <div className="
  absolute
  inset-0
  bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]
  bg-[size:40px_40px]
  " />

</div>
      <div className="
relative
z-10
max-w-6xl
mx-auto
space-y-6
">
        <div>
          <h1 className="
text-3xl sm:text-4xl lg:text-5xl
font-black
tracking-tight
bg-gradient-to-r
from-cyan-400
via-blue-400
to-purple-500
bg-clip-text
text-transparent
drop-shadow-[0_0_30px_rgba(34,211,238,0.35)]
">AI Interview Generator</h1>
          <p className="
text-white/60
text-lg
mt-3
max-w-2xl
leading-relaxed
">Practice with AI-generated interview questions and get instant feedback</p>
        </div>

        {/* Generator */}
        <div className="
relative
overflow-hidden
bg-white/[0.04]
backdrop-blur-3xl
border
border-cyan-500/10
rounded-[30px]
p-4 sm:p-7
shadow-[0_0_50px_rgba(34,211,238,0.08)]
">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Sparkles size={18} className="text-indigo-400" />Generate Custom Questions</h3>
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <input value={jobRole} onChange={e => setJobRole(e.target.value)} placeholder="Job role (e.g., Senior React Developer)"
              className="
flex-1
min-w-48
bg-white/[0.04]
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
focus:bg-white/[0.06]
transition-all
duration-300
shadow-[0_0_25px_rgba(0,0,0,0.2)]
" />
            <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)}
              className="
bg-white/[0.04]
backdrop-blur-xl
border
border-white/10
rounded-2xl
py-3
px-5
text-white/80
focus:outline-none
focus:border-cyan-400/40
transition-all
duration-300
">
              <option className="bg-[#0a0a1a]" value="All">All Types</option>
              {categories.map(c => <option key={c} value={c} className="bg-[#0a0a1a]">{c}</option>)}
            </select>
            <select value={selectedDiff} onChange={e => setSelectedDiff(e.target.value)}
             className="
bg-white/[0.04]
backdrop-blur-xl
border
border-white/10
rounded-2xl
py-3
px-5
text-white/80
focus:outline-none
focus:border-cyan-400/40
transition-all
duration-300
">
              <option className="bg-[#0a0a1a]" value="All">All Levels</option>
              {difficulty.map(d => <option key={d} value={d} className="bg-[#0a0a1a]">{d}</option>)}
            </select>
            <button onClick={generateQuestions} disabled={generating || !jobRole}
              className="
group
relative
overflow-hidden
flex
items-center
gap-2
px-6
py-3
w-full sm:w-auto
rounded-2xl
bg-gradient-to-r
from-cyan-500
via-blue-500
to-purple-600
text-white
font-semibold
shadow-[0_0_35px_rgba(59,130,246,0.35)]
hover:scale-105
transition-all
duration-300
disabled:opacity-50
">
              {generating ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><RefreshCw size={14} />Generate</>}
            </button>
          </div>
        </div>

        <div className={`
grid
gap-6
grid-cols-1
${activeQ ? "lg:grid-cols-5" : ""}
`}>
          {/* Questions list */}
          <div className={activeQ ? "lg:col-span-2 w-full" : "w-full"}>
            <div className="space-y-3">
              {filtered.map((q, i) => (
                <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => { setActiveQ(q); setAnswer(""); setFeedback(null); }}
                  className={`
group
relative
overflow-hidden
backdrop-blur-2xl
border
rounded-3xl
p-5
cursor-pointer
transition-all
duration-500
hover:-translate-y-1
hover:shadow-[0_0_40px_rgba(34,211,238,0.12)]

${
activeQ?.id === q.id
? "bg-cyan-500/10 border-cyan-400/30 shadow-[0_0_40px_rgba(34,211,238,0.18)]"
: "bg-white/[0.04] border-white/10 hover:border-cyan-400/20"
}
`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        q.difficulty === "Hard" ? "bg-red-400/10 text-red-400" :
                        q.difficulty === "Medium" ? "bg-yellow-400/10 text-yellow-400" : "bg-emerald-400/10 text-emerald-400"
                      }`}>{q.difficulty}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40">{q.category}</span>
                    </div>
                    <ChevronRight size={14} className="text-white/20 flex-shrink-0 mt-0.5" />
                  </div>
                  <p className="text-white/80 text-sm line-clamp-2">{q.question}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Practice Panel */}
          {activeQ && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3 space-y-4 w-full">
              <div className="relative
overflow-hidden
bg-white/[0.04]
backdrop-blur-3xl
border
border-purple-500/10
rounded-[30px]
p-7
shadow-[0_0_45px_rgba(168,85,247,0.08)]">
                <div className="flex gap-2 mb-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${activeQ.difficulty === "Hard" ? "bg-red-400/10 text-red-400" : activeQ.difficulty === "Medium" ? "bg-yellow-400/10 text-yellow-400" : "bg-emerald-400/10 text-emerald-400"}`}>{activeQ.difficulty}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40">{activeQ.category}</span>
                </div>
                <h3 className="text-white font-semibold mb-3">{activeQ.question}</h3>
                <div className="flex items-start gap-2 bg-indigo-400/5 border border-indigo-400/10 rounded-xl p-3">
                  <Target size={14} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                  <p className="text-white/60 text-xs">{activeQ.tip}</p>
                </div>
              </div>

              <div className="relative
overflow-hidden
bg-white/[0.04]
backdrop-blur-3xl
border
border-purple-500/10
rounded-[30px]
p-7
shadow-[0_0_45px_rgba(168,85,247,0.08)]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium text-sm">Your Answer</h4>
                  <button onClick={() => setRecording(!recording)}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${recording ? "bg-red-400/10 border-red-400/20 text-red-400" : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"}`}>
                    {recording ? <><MicOff size={12} />Stop</> : <><Mic size={12} />Record</>}
                  </button>
                </div>
                <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Type your answer here..." rows={4}
                  className="
w-full
bg-white/[0.04]
backdrop-blur-xl
border
border-white/10
rounded-2xl
py-4
px-5
text-white
placeholder-white/30
focus:outline-none
focus:border-cyan-400/50
focus:bg-white/[0.06]
transition-all
duration-300
resize-none
" />
                <button onClick={getAIFeedback} disabled={!answer.trim() || loadingFeedback}
                  className="mt-3 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all">
                  {loadingFeedback ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Sparkles size={14} />Get AI Feedback</>}
                </button>
              </div>

              {feedback && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="relative
overflow-hidden
bg-white/[0.04]
backdrop-blur-3xl
border
border-purple-500/10
rounded-[30px]
p-7
shadow-[0_0_45px_rgba(168,85,247,0.08)]">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className={`text-3xl font-black ${scoreColor(feedback.score)}`}>{feedback.score}</p>
                      <p className="text-white/40 text-xs">Score</p>
                    </div>
                    <div className="flex-1 bg-white/5 rounded-full h-2">
                      <motion.div className={`h-full rounded-full ${feedback.score >= 80 ? "bg-emerald-400" : feedback.score >= 60 ? "bg-yellow-400" : "bg-red-400"}`} animate={{ width: `${feedback.score}%` }} transition={{ duration: 0.8 }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-emerald-400 text-xs font-semibold mb-2">Strengths</p>
                      {feedback.strengths.map(s => (
                        <div key={s} className="flex items-start gap-1.5 text-xs text-white/70 mb-1"><CheckCircle size={11} className="text-emerald-400 flex-shrink-0 mt-0.5" />{s}</div>
                      ))}
                    </div>
                    <div>
                      <p className="text-yellow-400 text-xs font-semibold mb-2">Improvements</p>
                      {feedback.improvements.map(s => (
                        <div key={s} className="flex items-start gap-1.5 text-xs text-white/70 mb-1"><Star size={11} className="text-yellow-400 flex-shrink-0 mt-0.5" />{s}</div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-white/50 text-xs font-semibold mb-1">Sample Strong Answer</p>
                    <p className="text-white/70 text-xs">{feedback.sampleAnswer}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
         </div>
  </div>
  </>
);
} 
 