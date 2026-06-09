// frontend/pages/ResumeImprovementPage.jsx
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import ResumeScoreCard from "../components/ResumeImprovement/ResumeScoreCard";
import ATSIssuesCard from "../components/ResumeImprovement/ATSIssuesCard";
import MissingKeywords from "../components/ResumeImprovement/MissingKeywords";
import GrammarSuggestions from "../components/ResumeImprovement/GrammarSuggestions";
import AIImprovementTips from "../components/ResumeImprovement/AIImprovementTips";
import ImprovementLoader from "../components/ResumeImprovement/ImprovementLoader";
import { analyzeResume } from "../services/resumeImprovementAPI";
import "../styles/resumeImprovement.css";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResumeImprovementPage() {
   const navigate = useNavigate()
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
console.log("CURRENT ANALYSIS =", analysisData);
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setAnalysisData(null);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "application/msword": [".doc"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] },
    maxFiles: 1,
  });

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
     const response = await analyzeResume(file, jobTitle);

console.log("FULL API RESPONSE =", response);

// IMPORTANT
const finalData =
  response?.data?.data ||
  response?.data ||
  response;

console.log("FINAL ANALYSIS DATA =", finalData);

setAnalysisData(finalData);
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-x-hidden">
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
      
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#00f0ff]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#bf00ff]/5 blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full bg-[#00ff9f]/3 blur-[100px]" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#00f0ff 1px, transparent 1px), linear-gradient(90deg, #00f0ff 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
      </div>
         
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
            <span className="text-[#00f0ff] text-xs font-mono tracking-widest uppercase">AI Resume Engine v2.0</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
            <span className="text-white">Resume </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#bf00ff] to-[#00ff9f]">Intelligence</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
            Upload your resume. Our AI analyzes ATS compatibility, grammar, missing keywords, and delivers actionable improvement insights.
          </p>
        </motion.div>

        {/* Upload + Job Title Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Dropzone */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="lg:col-span-2">
            <div
              {...getRootProps()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-10 text-center group
                ${isDragActive ? "border-[#00f0ff] bg-[#00f0ff]/10 shadow-[0_0_40px_#00f0ff30]" : file ? "border-[#00ff9f]/60 bg-[#00ff9f]/5" : "border-[#ffffff15] bg-[#ffffff03] hover:border-[#bf00ff]/50 hover:bg-[#bf00ff]/5 hover:shadow-[0_0_30px_#bf00ff20]"}
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                {file ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-[#00ff9f]/10 border border-[#00ff9f]/40 flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#00ff9f]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <p className="text-[#00ff9f] font-semibold text-lg">{file.name}</p>
                      <p className="text-gray-500 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB • Ready for analysis</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setFile(null); setAnalysisData(null); }} className="text-xs text-gray-500 hover:text-red-400 transition-colors border border-gray-700 hover:border-red-400/50 px-3 py-1 rounded-full">Remove</button>
                  </>
                ) : (
                  <>
                    <div className={`w-16 h-16 rounded-full border flex items-center justify-center transition-all duration-300 ${isDragActive ? "border-[#00f0ff] bg-[#00f0ff]/10" : "border-[#ffffff20] bg-[#ffffff05] group-hover:border-[#bf00ff]/50"}`}>
                      <svg className={`w-8 h-8 transition-colors duration-300 ${isDragActive ? "text-[#00f0ff]" : "text-gray-500 group-hover:text-[#bf00ff]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg">{isDragActive ? "Drop your resume here..." : "Drag & drop your resume"}</p>
                      <p className="text-gray-500 text-sm mt-1">Supports PDF, DOC, DOCX • Max 10MB</p>
                    </div>
                    <span className="text-xs text-gray-600 border border-gray-700 px-3 py-1 rounded-full">or click to browse</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Job Title + Analyze */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2 block">Target Job Title (Optional)</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior React Developer"
                className="w-full bg-[#ffffff05] border border-[#ffffff15] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#00f0ff]/50 focus:shadow-[0_0_20px_#00f0ff15] transition-all duration-300"
              />
              <p className="text-gray-600 text-xs mt-2">Adding a target role improves keyword analysis accuracy.</p>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className={`relative w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 overflow-hidden
                ${!file || loading ? "opacity-40 cursor-not-allowed bg-gray-800 text-gray-500 border border-gray-700" : "bg-gradient-to-r from-[#00f0ff] to-[#bf00ff] text-black hover:shadow-[0_0_40px_#00f0ff50] hover:scale-[1.02] active:scale-[0.98]"}
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Analyzing...
                </span>
              ) : "⚡ Analyze Resume"}
            </button>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[["98%", "ATS Pass Rate"], ["2.3s", "Avg Speed"], ["50+", "Checks"]].map(([val, label]) => (
                <div key={label} className="text-center bg-[#ffffff03] border border-[#ffffff08] rounded-xl py-3">
                  <p className="text-[#00f0ff] font-bold text-lg">{val}</p>
                  <p className="text-gray-600 text-[10px] mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-8 p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-400 text-sm flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading */}
        <AnimatePresence>{loading && <ImprovementLoader />}</AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {analysisData && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-8">
              {/* Score + ATS row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1, duration: 0.5 }}
>
  <ResumeScoreCard
    score={analysisData.overallScore}
    weakSections={analysisData.weakSections}
  />
</motion.div>
                <div className="lg:col-span-2">
                  <motion.div
  initial={{ opacity: 0, x: 30 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.2, duration: 0.5 }}
>
  <ATSIssuesCard issues={analysisData.atsIssues} />
</motion.div>
                </div>
              </div>
              {/* Keywords + Grammar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3, duration: 0.5 }}
>
  <MissingKeywords
    keywords={analysisData.missingKeywords}
  />
</motion.div>
               <motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4, duration: 0.5 }}
>
  <GrammarSuggestions
    suggestions={analysisData.grammarSuggestions}
  />
</motion.div>
              </div>
              {/* AI Tips */}
             <motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5, duration: 0.6 }}
>
  <AIImprovementTips
    tips={analysisData.improvementTips}
  />
</motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}