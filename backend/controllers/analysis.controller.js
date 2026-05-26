const {
  generateResumeFeedback,
  generateSkillRecommendations,
  generateProfessionalSummary,
} = require("../services/aiResumeAnalysis.service");

const {
  extractSkillsFromText,
} = require("../services/skillExtractor.service");

const {
  splitSections,
  extractContactInfo,
  extractName,
} = require("../services/resumeParser.service");

const { success } = require("../utils/responseHelper");

const { AppError } = require("../utils/errorHandler");

const asyncHandler = require("../utils/asyncHandler");

exports.getAIFeedback = asyncHandler(async (req, res) => {
  const { resumeText, targetRole = "" } = req.body;

  if (!resumeText) {
    throw new AppError(
      "Resume text required",
      400,
      "INVALID_INPUT"
    );
  }

  const sections = splitSections(resumeText);

  const parsedResume = {
    rawText: resumeText,

    name: extractName(
      resumeText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
    ),

    contact: extractContactInfo(resumeText),

    sections,
  };

  const feedback =
    await generateResumeFeedback(
      parsedResume,
      targetRole
    );

  success(res, {
    analysis: feedback,
  });
});

exports.getSkillRecommendations = asyncHandler(
  async (req, res) => {
    const { resumeText, targetRole = "" } =
      req.body;

    if (!resumeText) {
      throw new AppError(
        "Resume text required",
        400,
        "INVALID_INPUT"
      );
    }

    const skills =
      extractSkillsFromText(resumeText);

    const recommendations =
      await generateSkillRecommendations(
        skills,
        targetRole
      );

    success(res, {
      currentSkills: {
        all: skills.all,
        technical: skills.technical,
        soft: skills.soft,
        count: skills.count,
      },

      recommendations,

      targetRole,
    });
  }
);

exports.generateSummary = asyncHandler(
  async (req, res) => {
    const { experience, skills } = req.body;

    if (!experience?.length) {
      throw new AppError(
        "At least one experience entry required",
        400,
        "INVALID_INPUT"
      );
    }

    const summary =
      await generateProfessionalSummary(
        experience,
        skills
      );

    success(res, {
      summary,
    });
  }
);

exports.fullAnalysis = asyncHandler(
  async (req, res) => {
    const { resumeText, targetRole = "" } =
      req.body;

    if (!resumeText) {
      throw new AppError(
        "Resume text required",
        400,
        "INVALID_INPUT"
      );
    }

    const sections =
      splitSections(resumeText);

    const parsedResume = {
      rawText: resumeText,
      sections,
    };

    const skills =
      extractSkillsFromText(resumeText);

    const [feedback, recommendations] =
      await Promise.all([
        generateResumeFeedback(
          parsedResume,
          targetRole
        ),

        generateSkillRecommendations(
          skills,
          targetRole
        ),
      ]);

    success(res, {
      feedback,

      recommendations,

      skills: {
        all: skills.all,
        count: skills.count,
      },
    });
  }
);