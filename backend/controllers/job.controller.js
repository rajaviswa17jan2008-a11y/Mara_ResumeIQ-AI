const { matchJobsToResume, generateJobMatchAnalysis } = require("../services/jobMatcher.service");
const { extractSkillsFromText } = require("../services/skillExtractor.service");
const { success } = require("../utils/responseHelper");
const { AppError } = require("../utils/errorHandler");
const asyncHandler = require("../utils/asyncHandler");

exports.matchJobs = asyncHandler(async (req, res) => {
  const { resumeText, jobs = [] } = req.body;
  if (!resumeText) throw new AppError("Resume text required", 400, "INVALID_INPUT");
  if (!Array.isArray(jobs)) throw new AppError("Jobs must be an array", 400, "INVALID_INPUT");

  const skills = extractSkillsFromText(resumeText);

  if (jobs.length === 0) {
    return success(res, { jobs: [], skills: skills.all, message: "No jobs provided for matching" });
  }

  const matched = await matchJobsToResume(skills, resumeText, jobs);
  success(res, { jobs: matched, skills: skills.all, totalMatched: matched.length });
});

exports.analyzeJobMatch = asyncHandler(async (req, res) => {
  const { resume, job } = req.body;
  if (!resume) throw new AppError("Resume data required", 400, "INVALID_INPUT");
  if (!job) throw new AppError("Job data required", 400, "INVALID_INPUT");

  const analysis = await generateJobMatchAnalysis(resume, job);
  success(res, analysis);
});

exports.batchMatchAnalysis = asyncHandler(async (req, res) => {
  const { resumeText, jobs = [] } = req.body;
  if (!resumeText) throw new AppError("Resume text required", 400, "INVALID_INPUT");
  if (!jobs.length) throw new AppError("At least one job required", 400, "INVALID_INPUT");

  const skills = extractSkillsFromText(resumeText);
  const resume = { rawText: resumeText, skills: skills.all };

  const analyses = await Promise.allSettled(
    jobs.slice(0, 5).map(job => generateJobMatchAnalysis(resume, job))
  );

  const results = analyses.map((r, i) => ({
    job: jobs[i],
    analysis: r.status === "fulfilled" ? r.value : { error: "Analysis failed" },
  }));

  success(res, { results, skills: skills.all });
});