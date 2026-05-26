import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer
} from "recharts";
import { useNavigate }
from "react-router-dom";

import {
  Cpu,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap,
  RefreshCw
} from "lucide-react";
import { ArrowLeft } from "lucide-react";

const ScanLine = () => (
  <motion.div
    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none"
    animate={{ top: ["0%", "100%", "0%"] }}
    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
  />
);

export default function AIAnalysisPage() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(true);
  const navigate = useNavigate();

 const storedResume =

  localStorage.getItem(
    "activeResume"
  );

 console.log("ACTIVE RESUME:", storedResume);

  const activeResume = storedResume
    ? JSON.parse(storedResume)
    : null;

  useEffect(() => {
    const fetchAnalysis = async () => {

      if (!activeResume) {
        setLoading(false);
        setScanning(false);
        return;
      }

      try {

        console.log("ACTIVE RESUME:", activeResume);
      const analysisData = {

  atsScore:
    activeResume?.atsScore || 0,

  strengths:
    activeResume?.feedback
      ?.strengths || [],

  improvements:
    activeResume?.feedback
      ?.improvements || [],

  summary:
    activeResume?.summary ||

    activeResume?.feedback?.summary ||

    "",

};

setAnalysis(analysisData);

console.log(
  "FINAL ANALYSIS:",
  analysisData
);    

      } catch (err) {

        console.log(
          "FULL ERROR:",
          err.response?.data || err.message
        );

      } finally {
       setScanning(false);
setLoading(false);

      }
    };

    fetchAnalysis();

  }, []);

    if (!activeResume) {

  navigate("/upload");

  return null;

}

  const data = analysis || {};

  const radialData = [
    {
      name: "ATS",
      value: data?.atsScore || 0,
      fill: "#6366f1"
    }
  ];

  const scoreColor = (s) =>
    s >= 80
      ? "text-emerald-400"
      : s >= 60
      ? "text-yellow-400"
      : "text-red-400";

  const priorityColor = {
    high: "bg-red-400/10 border-red-400/20 text-red-400",
    medium: "bg-yellow-400/10 border-yellow-400/20 text-yellow-400",
    low: "bg-blue-400/10 border-blue-400/20 text-blue-400"
  };

  return (
    <> 
    
    <button
  onClick={() => navigate("/dashboard")}
  className="
  flex
  items-center
  gap-2

  px-3
sm:px-4

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
max-w-7xl
px-4
sm:px-6
mx-auto
space-y-6
relative
z-10
">
  <div className="
absolute
inset-0
bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]
bg-[size:40px_40px]
pointer-events-none
" />

  {/* AI GLOW EFFECTS */}

  <div className="fixed inset-0 overflow-hidden -z-10">

    <div className="
      absolute
      top-10
      left-10
      w-72
      h-72
      bg-cyan-500/20
      rounded-full
      blur-[120px]
      animate-pulse
    " />

    <div className="
      absolute
      bottom-10
      right-10
      w-96
      h-96
      bg-purple-500/20
      rounded-full
      blur-[150px]
      animate-pulse
    " />

    <div className="
      absolute
      top-1/2
      left-1/2
      -translate-x-1/2
      -translate-y-1/2
      w-[500px]
      h-[500px]
      bg-blue-500/10
      rounded-full
      blur-[180px]
    " />

  </div>

        <div className="
flex
flex-col
sm:flex-row

gap-4

sm:items-center
sm:justify-between
">
          <div>
            <h1 className="
text-3xl
sm:text-4xl
lg:text-5xl
font-black
bg-gradient-to-r
from-cyan-400
via-blue-500
to-purple-500
bg-clip-text
text-transparent
tracking-tight
">
              AI Resume Analysis
            </h1>

            <p className="text-white/50 text-sm mt-1">
              Powered by advanced NLP & ATS simulation
            </p>
          </div>

          <button
            onClick={() => {
              window.location.reload();
            }}
            className="
flex
items-center
gap-2
text-sm
text-white
bg-white/[0.03]
backdrop-blur-xl
border
border-cyan-500/20
hover:border-cyan-400/40
px-5
py-2.5
rounded-2xl
transition-all
duration-500
hover:scale-105
shadow-[0_0_35px_rgba(6,182,212,0.15)]
"
          >
            <RefreshCw size={15} />
            Re-analyze
          </button>
        </div>

        <AnimatePresence>
          {scanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="
relative
bg-white/[0.04]
backdrop-blur-2xl
border
border-cyan-500/20
rounded-3xl
p-10
text-center
overflow-hidden
shadow-[0_0_45px_rgba(6,182,212,0.12)]
"
            >
              <ScanLine />

              <div className="relative z-10">

                <div className="flex items-center justify-center gap-3 mb-3">
                  <Cpu
                    size={20}
                    className="text-cyan-400 animate-pulse"
                  />

                  <span className="text-cyan-400 font-medium">
                    AI Scanning in Progress...
                  </span>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!scanning && (

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

  {/* ATS CARD */}

  <div className="
lg:col-span-1
min-h-[520px]
sm:min-h-0
bg-white/[0.04]
backdrop-blur-2xl
border
border-indigo-500/20
rounded-3xl
p-4
sm:p-6

text-center
shadow-[0_0_45px_rgba(99,102,241,0.12)]
hover:shadow-[0_0_60px_rgba(99,102,241,0.22)]
transition-all
duration-500
hover:-translate-y-1
">

    <h3 className="text-white/60 text-sm mb-4">
      Overall ATS Score
    </h3>

    <div className="
relative

h-[220px]
sm:h-40
">

      <ResponsiveContainer width="100%" height="100%">

        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="65%"
          outerRadius="85%"
          data={radialData}
          startAngle={90}
          endAngle={-270}
        >

          <RadialBar
            dataKey="value"
            background={{ fill: "#ffffff08" }}
            cornerRadius={10}
          />

        </RadialBarChart>

      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center">

        <span className="
text-4xl
sm:text-5xl
font-black
bg-gradient-to-r 
from-cyan-400
to-purple-500
bg-clip-text
text-transparent
drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]
">
          {data?.atsScore || 0}
        </span>

        <span className="text-white/40 text-xs">
          out of 100
          </span></div>
          <div className="
mt-10
sm:mt-6

space-y-4
">
  {/* Skills Match */}
  <div>
    <div className="flex justify-between text-sm text-gray-300 mb-1">
      <span>Skills Match</span>

      <span>
        {Math.min(
          (data?.strengths?.length || 0) * 20,
          100
        )}%
      </span>
    </div>

    <div className="w-full h-2 bg-gray-800 rounded-full">
      <div
        className="h-2 bg-cyan-400 rounded-full transition-all duration-700"
        style={{
          width: `${Math.min(
            (data?.strengths?.length || 0) * 20,
            100
          )}%`
        }}
      />
    </div>
  </div>

  {/* Projects */}
  <div>
    <div className="flex justify-between text-sm text-gray-300 mb-1">
      <span>Projects</span>

      <span>
        {data?.strengths?.length
          ? 80
          : 40}%
      </span>
    </div>

    <div className="w-full h-2 bg-gray-800 rounded-full">
      <div
        className="h-2 bg-purple-400 rounded-full transition-all duration-700"
        style={{
          width: `${
            data?.strengths?.length
              ? 80
              : 40
          }%`
        }}
      />
    </div>
  </div>

  {/* Resume Quality */}
  <div>
    <div className="flex justify-between text-sm text-gray-300 mb-1">
      <span>Resume Quality</span>

      <span>
        {data?.atsScore || 0}%
      </span>
    </div>

    <div className="w-full h-2 bg-gray-800 rounded-full">
      <div
        className="h-2 bg-green-400 rounded-full transition-all duration-700"
        style={{
          width: `${data?.atsScore || 0}%`
        }}
      />
    </div>
</div>
  </div>
  </div>
  </div>

  {/* RIGHT SIDE CONTENT */}

  <div className="lg:col-span-2 space-y-6">

    {/* SUMMARY */}

    <div className="
bg-white/[0.04]
backdrop-blur-2xl
border
border-cyan-500/20
rounded-3xl
p-6
shadow-[0_0_35px_rgba(6,182,212,0.08)]
hover:border-cyan-400/40
transition-all
duration-500
hover:-translate-y-1
">

      <h3 className="text-lg font-semibold text-white mb-3">
        AI Summary
      </h3>

      <p className="
text-white/70

text-sm
sm:text-base

leading-relaxed
">
        {data.summary}
      </p>

    </div>

    {/* STRENGTHS */}

    <div className="
bg-white/[0.04]
backdrop-blur-2xl
border
border-emerald-500/20
rounded-3xl
p-6
shadow-[0_0_35px_rgba(16,185,129,0.08)]
hover:border-emerald-400/40
transition-all
duration-500
hover:-translate-y-1
">

      <h3 className="text-lg font-semibold text-emerald-400 mb-4">
        Strengths
      </h3>

      <div className="space-y-3">

        {data.strengths?.map((item, i) => (

          <div
            key={i}
            className="
flex
items-start
gap-3

text-white/80

text-sm
sm:text-base
"
          >

            <CheckCircle
              size={18}
              className="text-emerald-400 mt-0.5"
            />

            <p>{item}</p>

          </div>

        ))}

      </div>

    </div>

    {/* IMPROVEMENTS */}

    <div className="
bg-white/[0.04]
backdrop-blur-2xl
border
border-rose-500/20
rounded-3xl
p-6
shadow-[0_0_35px_rgba(244,63,94,0.08)]
hover:border-rose-400/40
transition-all
duration-500
hover:-translate-y-1
">

      <h3 className="text-lg font-semibold text-red-400 mb-4">
        Improvements
      </h3>

      <div className="space-y-3">

        {data.improvements?.map((item, i) => (

          <div
            key={i}
            className="flex items-start gap-3 text-white/80"
          >

            <AlertTriangle
              size={18}
              className="text-red-400 mt-0.5"
            />

            <p>{item}</p>

          </div>

        ))}

      </div>
      </div>

</div>
      
      </div>
      

        )}

      </div>
        </>
      
  );
}