
import { useState, useCallback, useEffect} from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, X, CheckCircle, AlertCircle, Sparkles, Cpu } from "lucide-react";
import { resumeAPI } from "../services/api";
import { ArrowLeft } from "lucide-react";


const ACCEPTED = { "application/pdf": [".pdf"], "application/msword": [".doc"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] };

export default function ResumeUploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploadState, setUploadState] = useState("idle"); // idle | uploading | processing | done | error
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");
  

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) return setError("Invalid file type. Please upload PDF or DOCX.");
    setError("");
    setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: ACCEPTED, maxFiles: 1, maxSize: 10 * 1024 * 1024
  });

  const handleUpload = async () => {
    localStorage.removeItem("activeResume");
localStorage.removeItem("resumeData");
localStorage.removeItem("analysisData");
    if (!file) return;
    setUploadState("uploading");
    setProgress(20);

    const formData = new FormData();
    formData.append("resume", file);
   try {

setUploadState(
  "processing"
);


const res =
  await resumeAPI.uploadResume(
    formData
);

  console.log(
    "UPLOAD RESPONSE:",
    res.data
  );
 // const analysis = res.data?.data?.resume || {}; console.log( "FINAL ANALYSIS:", analysis ); localStorage.setItem( "activeResume", JSON.stringify({ rawText: analysis.rawText || "", atsScore: analysis.atsScore || 0, feedback: analysis.feedback || {}, skills: analysis.skills?.length > 0 ? analysis.skills : analysis.keywords || [], recommendations: analysis.recommendations || [], jobs: analysis.jobs || [], targetRole: analysis.targetRole || "Software Engineer" }) );
  //const uploadedResumeId =
  //res.data?.data?.resume?._id;

   //if (uploadedResumeId) {
  

const analysis =
  res.data?.resume ||

  {};
console.log(
  "FINAL ANALYSIS:",
  analysis
);
console.log(
  "ATS:",
  analysis?.atsScore
);

console.log(
  "FEEDBACK:",
  analysis?.feedback
);

console.log(
  "SUMMARY:",
  analysis?.feedback?.summary
);

console.log(
  "STRENGTHS:",
  analysis?.feedback?.strengths
);

console.log(
  "IMPROVEMENTS:",
  analysis?.feedback?.improvements
);

localStorage.setItem(
  "activeResume",
  JSON.stringify({
    rawText: analysis.rawText || "",

    atsScore: analysis.atsScore || 0,

    feedback: analysis.feedback || {},

    summaryFeedback:
      analysis.feedback?.summary || "",

    strengths:
      analysis.feedback?.strengths || [],

    improvementTips:
      analysis.feedback?.improvements || [],

    skills:
      analysis.skills || [],

    recommendations:
      analysis.recommendations || [],

    jobs:
      JSON.parse(
        localStorage.getItem("recommendedJobs")
      ) || [],

    targetRole:
      analysis.targetRole || ""
  })
);
      
   

  setProgress(100);
setProgress(96);

await new Promise(resolve =>
  setTimeout(resolve, 1200)
);

  setUploadState(
    "done"
  );

  setTimeout(() => {

    navigate(
  "/analysis"
);

  }, 1500);

}
  catch (e) {

  console.error(
  "UPLOAD ERROR:",
  e
);
    setProgress(0);

  setError(

    e.response?.data?.message ||

    "Upload failed."

  );

  setUploadState(
    "error"
  );

}
  };


  const processingSteps = ["Extracting text content", "Parsing sections", "Analyzing skills", "Calculating ATS score", "Generating insights"];

    // useEffect(() => {

 // if (savedResume) {

    //setStoredResume(
      //JSON.parse(savedResume)
    //);

  //}

//}, []);
useEffect(() => {
  let interval;

  if (uploadState === "processing") {

    interval = setInterval(() => {

      setProgress((prev) => {

        if (prev >= 95) {
          return prev;
        }

        return prev + Math.random() * 8;
      });

    }, 700);

  }

  return () => clearInterval(interval);

}, [uploadState]);
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
  <div className="fixed inset-0 overflow-hidden -z-10">
    <motion.div
  animate={{
    scale: [1, 1.2, 1],
    opacity: [0.4, 0.7, 0.4],
  }}
  transition={{
    duration: 6,
    repeat: Infinity,
  }}
  className="
absolute
top-1/2
left-1/2
-translate-x-1/2
-translate-y-1/2
w-[700px]
h-[700px]
rounded-full
bg-purple-500/10
blur-[180px]
"
/>
    <div className="
absolute
top-1/2
left-1/2
-translate-x-1/2
-translate-y-1/2
w-[500px]
h-[500px]
bg-cyan-500/10
blur-[160px]
rounded-full
animate-pulse
" />

    <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full animate-pulse" />

    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full animate-pulse" />

  </div>

  <div className="
min-h-screen
relative
overflow-hidden
text-white
p-6

bg-[#020617]

before:absolute
before:inset-0
before:pointer-events-none
before:z-0

before:bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_25%),linear-gradient(to_bottom_right,#020617,#000000,#0f172a)]

after:absolute
after:inset-0
after:pointer-events-none
after:z-0

after:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]

after:bg-[size:40px_40px]
">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <div className="text-center mb-14">

<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/5 mb-6">

<span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />

<span className="text-cyan-400 text-xs font-mono tracking-widest uppercase">

AI Resume Engine v2.0

</span>

</div>

<h1 className="text-5xl md:text-6xl font-extrabold mb-4">

<span className="text-white">Resume </span>

<span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">

Intelligence

</span>

</h1>

<p className="text-gray-400 text-lg max-w-2xl mx-auto">

Upload your resume. Our AI analyzes ATS compatibility, grammar, missing keywords and delivers improvement insights.

</p>

</div>
          </div>
          

          <div className="
mt-10
max-w-4xl
mx-auto
">

  <AnimatePresence mode="wait">
            {(
  uploadState === "idle" ||
  uploadState === "error"
) && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div
              {...getRootProps()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-10 text-center group
                ${isDragActive ? "border-[#00f0ff] bg-[#00f0ff]/10 shadow-[0_0_40px_#00f0ff30]" :  file? "border-white/10 bg-white/[0.03]" : "border-[#ffffff15] bg-[#ffffff03] hover:border-[#bf00ff]/50 hover:bg-[#bf00ff]/5 hover:shadow-[0_0_30px_#bf00ff20]"}
              `}
            >
 
                  <input {...getInputProps()} />
                  <motion.div animate={{ y: isDragActive ? -8 : 0 }} transition={{ type: "spring", stiffness: 300 }}>
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
                      <Upload size={48} className={`transition-colors ${isDragActive ? "text-indigo-400" : "text-white/40"}`} />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">
                      {isDragActive ? "Drop it here!" : "Drag & drop your resume"}
                    </h3>
                    <p className="text-white/40 text-sm mb-4">or click to browse files</p>
                    <p className="text-white/25 text-xs">PDF, DOC, DOCX • Max 10MB</p>
                  </motion.div>
                  {isDragActive && (
                    <div className="absolute inset-0 rounded-2xl bg-indigo-500/5 border-2 border-indigo-400 pointer-events-none" />
                  )}
                </div>

                {file && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                           className="
mt-4
max-w-4xl
mx-auto
bg-white/[0.04]
border
border-white/10
rounded-xl
p-4
flex
items-center
gap-4
" >
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                      <FileText size={18} className="text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{file.name}</p>
                      <p className="text-white/40 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button onClick={() => setFile(null)} className="text-white/30 hover:text-white/60 transition-colors">
                      <X size={18} />
                    </button>
                  </motion.div>
                )}

                {error && (
                  <div className="mt-4 flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                    <AlertCircle size={16} />{error}
                  </div>
                )}

                <motion.button
                  onClick={handleUpload} disabled={!file}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className="
group
relative

mt-8

w-full
md:w-[450px]

mx-auto
block

overflow-hidden
rounded-2xl
py-5

bg-gradient-to-r
from-cyan-500
via-blue-500
to-purple-600

text-white
font-bold
text-lg

">
                  <Sparkles size={18} /> ⚡ Analyze Resume
                </motion.button>
              </motion.div>
            )}

            {(uploadState === "uploading" || uploadState === "processing") && (
              <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-10 text-center">
                <div className="relative w-28 h-28 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin" />
                  <div className="absolute inset-3 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Cpu size={28} className="text-indigo-400 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {uploadState === "uploading" ? "Uploading..." : "AI Processing..."}
                </h3>
                <div className="w-full bg-white/5 rounded-full h-1.5 mt-6 mb-4">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-white/40 text-sm">{progress}%</p>
                <p className="text-cyan-300 text-sm mt-3 animate-pulse">
  {processingSteps[
    Math.min(
      Math.floor(progress / 20),
      processingSteps.length - 1
    )
  ]}
</p>
                <div className="mt-6 space-y-2">
                  {processingSteps.map((s, i) => {

  const active = progress >= (i + 1) * 18;

  return (
                    <div key={s} className={`
flex
items-center
gap-3
text-sm
transition-all
duration-500

${active
  ? "text-cyan-300"
  : "text-white/20"}
`}>
                      <div
  className={`
  w-2
  h-2
  rounded-full

  ${active
    ? "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
    : "bg-white/20"}
  `}
/>
                      {s}
                    </div>
                    );
})}
                </div>
              </motion.div>
            )}

            {uploadState === "done" && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white/[0.03] border border-emerald-500/30 rounded-2xl p-10 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={36} className="text-emerald-400" />
                </motion.div>
                <h3 className="text-white font-semibold text-lg">Analysis Complete!</h3>
                <p className="text-white/50 text-sm mt-2">Redirecting to your results...</p>
              </motion.div>
            )}
          </AnimatePresence>
          </div>

          {/* Tips */}
          <div className="
mt-8
max-w-3xl
mx-auto

grid
grid-cols-1
md:grid-cols-3

gap-4
">
            {[
              { title: "ATS Score", desc: "Get your applicant tracking score" },
              { title: "Skill Map", desc: "Discover your skill profile" },
              { title: "Job Match", desc: "Find matching opportunities" },
            ].map(t => (
              <div key={t.title} className="

group

relative
overflow-hidden

bg-white/[0.04]
backdrop-blur-2xl

border
border-cyan-400/10

rounded-2xl
p-4

transition-all
duration-500

hover:-translate-y-2
hover:border-cyan-400/30

hover:shadow-[0_0_60px_rgba(6,182,212,0.12)]

" >
                <p className="text-white text-sm font-medium">{t.title}</p>
                <p className="text-white/40 text-xs mt-1">{t.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
    </>
   
  );
}