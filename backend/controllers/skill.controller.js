const { generateSkillRecommendations } = require("../services/aiResumeAnalysis.service");
const { extractSkillsFromText, getSkillGaps, rankSkillsByDemand } = require("../services/skillExtractor.service");
const { success } = require("../utils/responseHelper");
const { AppError } = require("../utils/errorHandler");

const asyncHandler = require("../utils/asyncHandler");

exports.extractSkills = asyncHandler(async (req, res) => {
  const { resumeText } = req.body;
  if (!resumeText) throw new AppError("Resume text required", 400, "INVALID_INPUT");

  const skills = extractSkillsFromText(resumeText);
  const ranked = rankSkillsByDemand(skills.all);

  success(res, {
    extracted: { all: skills.all, technical: skills.technical, soft: skills.soft, count: skills.count },
    ranked,
  });
});

exports.getRecommendations = asyncHandler(async (req, res) => {
  const { resumeText, targetRole = "", currentSkills = [] } = req.body;

  let skills;
  if (resumeText) {
    skills = extractSkillsFromText(resumeText);
  } else if (currentSkills.length > 0) {
    skills = { all: currentSkills, count: currentSkills.length, technical: {}, soft: [] };
  } else {
    throw new AppError("Either resumeText or currentSkills required", 400, "INVALID_INPUT");
  }

  const [recommendations, gaps] = await Promise.all([
    generateSkillRecommendations(skills, targetRole),
    Promise.resolve(getSkillGaps(skills, targetRole)),
  ]);

  success(res, {
    currentSkills: { all: skills.all, count: skills.count },
    recommendations,
    gaps,
    targetRole,
  });
});

exports.getSkillGapAnalysis = asyncHandler(async (req, res) => {
  const { resumeText, targetRole } = req.body;
  if (!resumeText) throw new AppError("Resume text required", 400, "INVALID_INPUT");
  if (!targetRole) throw new AppError("Target role required", 400, "INVALID_INPUT");

  const skills = extractSkillsFromText(resumeText);
  const gaps = getSkillGaps(skills, targetRole);
  const ranked = rankSkillsByDemand(gaps.gaps);

  success(res, {
    currentSkills: skills.all,
    targetRole,
    gaps: gaps.gaps,
    requirements: gaps.requirements,
    coverage: gaps.coverage,
    rankedGaps: ranked,
    matchedRole: gaps.matchedRole,
  });
});