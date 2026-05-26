const request = require("supertest");
const app = require("../server");

jest.mock("../config/gemini", () => ({
  geminiChat: jest.fn().mockResolvedValue(
    JSON.stringify({
      reply: "Gemini fallback response"
    })
  ),

  geminiChatMultiTurn: jest.fn().mockResolvedValue(
    "Gemini chat response"
  ),
}));

jest.mock("../middleware/auth.middleware", () => ({
  verifyToken: (req, res, next) => { req.user = { id: "test-user", name: "Test", role: "user", plan: "pro" }; next(); },
  optionalAuth: (req, res, next) => { req.user = { id: "test-user", name: "Test", role: "user", plan: "pro" }; next(); },
  verifyAdmin: (req, res, next) => next(),
  verifyPlan: () => (req, res, next) => next(),
  verifyInternalSecret: (req, res, next) => next(),
}));

const VALID_RESUME = `Alexandra Chen — alexandra.chen@email.com | github.com/achen

PROFESSIONAL SUMMARY
Full Stack Engineer with 5 years building production React and Node.js applications. Delivered features used by 500k+ users. Strong background in cloud infrastructure and DevOps practices.

EXPERIENCE
Senior Engineer — FinTech Solutions (2021–Present)
- Developed React dashboard processing $2M daily transactions
- Reduced API response time by 55% through Redis caching layer
- Led team of 6 engineers across 3 product lines

Software Engineer — CloudApps Inc (2019–2021)
- Built Node.js microservices handling 5M requests/day
- Migrated monolith to Docker/Kubernetes, cutting costs by $120k/year
- Implemented GraphQL API reducing frontend data fetching by 40%

EDUCATION
B.S. Software Engineering — Tech University (2019)

SKILLS
JavaScript, TypeScript, React, Next.js, Node.js, Express, GraphQL, Python
PostgreSQL, MongoDB, Redis, Elasticsearch
AWS, Docker, Kubernetes, Terraform, GitHub Actions`;

describe("Analysis Routes — AI Feedback", () => {
  describe("POST /api/analysis/feedback", () => {
    it("should return AI feedback for valid resume text", async () => {
      const res = await request(app)
        .post("/api/analysis/feedback")
        .send({ resumeText: VALID_RESUME });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("overallScore");
      expect(res.body.data.overallScore).toBeGreaterThanOrEqual(0);
      expect(res.body.data.overallScore).toBeLessThanOrEqual(100);
    });

    it("should include required feedback fields", async () => {
      const res = await request(app)
        .post("/api/analysis/feedback")
        .send({ resumeText: VALID_RESUME });

      expect(res.status).toBe(200);
      const { data } = res.body;
      expect(data).toHaveProperty("strengths");
      expect(data).toHaveProperty("weaknesses");
      expect(data).toHaveProperty("suggestions");
      expect(data).toHaveProperty("keywords");
      expect(data).toHaveProperty("sections");
    });

    it("should return 400 for missing resume text", async () => {
      const res = await request(app).post("/api/analysis/feedback").send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 for too-short resume text", async () => {
      const res = await request(app)
        .post("/api/analysis/feedback")
        .send({ resumeText: "Short text" });
      expect(res.status).toBe(400);
    });

    it("should accept optional targetRole", async () => {
      const res = await request(app)
        .post("/api/analysis/feedback")
        .send({ resumeText: VALID_RESUME, targetRole: "Senior DevOps Engineer" });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("POST /api/analysis/skills", () => {
    it("should return skill recommendations for valid input", async () => {
      const res = await request(app)
        .post("/api/analysis/skills")
        .send({ resumeText: VALID_RESUME, targetRole: "Senior Developer" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("currentSkills");
      expect(res.body.data).toHaveProperty("recommendations");
    });

    it("should include current skills in response", async () => {
      const res = await request(app)
        .post("/api/analysis/skills")
        .send({ resumeText: VALID_RESUME });

      expect(res.status).toBe(200);
      expect(res.body.data.currentSkills.all).toBeInstanceOf(Array);
      expect(res.body.data.currentSkills.count).toBeGreaterThan(0);
    });

    it("should return 400 when resumeText is missing", async () => {
      const res = await request(app).post("/api/analysis/skills").send({});
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/analysis/summary", () => {
    it("should generate a professional summary", async () => {
      const res = await request(app).post("/api/analysis/summary").send({
        experience: [
          { title: "Senior Engineer", company: "TechCorp", startDate: "2021-01", endDate: "Present" },
          { title: "Software Developer", company: "StartupXYZ", startDate: "2019-01", endDate: "2021-01" },
        ],
        skills: { technical: "React, Node.js, AWS, Docker", soft: "Leadership, Communication" },
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("summary");
      expect(typeof res.body.data.summary).toBe("string");
      expect(res.body.data.summary.length).toBeGreaterThan(20);
    });

    it("should return 400 for empty experience array", async () => {
      const res = await request(app)
        .post("/api/analysis/summary")
        .send({ experience: [], skills: {} });
      expect(res.status).toBe(400);
    });

    it("should return 400 when experience is missing", async () => {
      const res = await request(app).post("/api/analysis/summary").send({ skills: {} });
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/analysis/full", () => {
    it("should return full combined analysis", async () => {
      const res = await request(app)
        .post("/api/analysis/full")
        .send({ resumeText: VALID_RESUME, targetRole: "Full Stack Developer" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("feedback");
      expect(res.body.data).toHaveProperty("recommendations");
      expect(res.body.data).toHaveProperty("skills");
    });
  });
});

describe("Interview Routes", () => {
  describe("POST /api/interview/generate", () => {
    it("should generate interview questions", async () => {
      const res = await request(app)
        .post("/api/interview/generate")
        .send({ role: "Senior React Developer", count: 5 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.questions).toBeInstanceOf(Array);
    });

    it("should return 400 for missing role", async () => {
      const res = await request(app).post("/api/interview/generate").send({ count: 5 });
      expect(res.status).toBe(400);
    });

    it("should accept category and difficulty filters", async () => {
      const res = await request(app)
        .post("/api/interview/generate")
        .send({ role: "Backend Engineer", category: "Technical", difficulty: "Hard", count: 3 });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("meta");
    });
  });

  describe("POST /api/interview/evaluate", () => {
    it("should evaluate an interview answer", async () => {
      const res = await request(app).post("/api/interview/evaluate").send({
        question: "Tell me about a time you led a complex technical project.",
        answer: "In my previous role at TechCorp, I led the migration of our monolithic application to microservices. I coordinated with 5 engineers, set up bi-weekly sprints, and delivered the project 2 weeks ahead of schedule, reducing deployment time by 70% and saving the company $120k annually.",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("score");
      expect(res.body.data).toHaveProperty("grade");
      expect(res.body.data).toHaveProperty("strengths");
      expect(res.body.data).toHaveProperty("improvements");
    });

    it("should return 400 for too-short answer", async () => {
      const res = await request(app).post("/api/interview/evaluate").send({
        question: "Tell me about yourself.",
        answer: "I am a developer.",
      });
      expect(res.status).toBe(400);
    });

    it("should return 400 for missing question", async () => {
      const res = await request(app).post("/api/interview/evaluate").send({
        answer: "This is a detailed answer about my experience and how I handled various challenges in my career.",
      });
      expect(res.status).toBe(400);
    });
  });
});

describe("Chatbot Routes", () => {
  describe("POST /api/chatbot", () => {
    it("should return a chat response", async () => {
      const res = await request(app).post("/api/chatbot").send({
        message: "How can I improve my resume to get more callbacks?",
        history: [],
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("reply");
      expect(typeof res.body.data.reply).toBe("string");
      expect(res.body.data.reply.length).toBeGreaterThan(0);
    });

    it("should return 400 for empty message", async () => {
      const res = await request(app).post("/api/chatbot").send({ message: "", history: [] });
      expect(res.status).toBe(400);
    });

    it("should return 400 for missing message", async () => {
      const res = await request(app).post("/api/chatbot").send({ history: [] });
      expect(res.status).toBe(400);
    });

    it("should accept conversation history", async () => {
      const res = await request(app).post("/api/chatbot").send({
        message: "What skills should I focus on next?",
        history: [
          { role: "user", content: "I am a React developer with 3 years experience." },
          { role: "assistant", content: "That is great! React experience is highly valuable in the current market." },
        ],
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should return 400 for message exceeding 2000 characters", async () => {
      const res = await request(app).post("/api/chatbot").send({
        message: "a".repeat(2001),
      });
      expect(res.status).toBe(400);
    });
  });
});

describe("Skill Routes", () => {
  describe("POST /api/skills/extract", () => {
    it("should extract skills from resume text", async () => {
      const res = await request(app)
        .post("/api/skills/extract")
        .send({ resumeText: VALID_RESUME });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.extracted.all).toBeInstanceOf(Array);
      expect(res.body.data.extracted.count).toBeGreaterThan(0);
    });

    it("should return ranked skills", async () => {
      const res = await request(app)
        .post("/api/skills/extract")
        .send({ resumeText: VALID_RESUME });

      expect(res.body.data.ranked).toBeInstanceOf(Array);
      if (res.body.data.ranked.length > 1) {
        expect(res.body.data.ranked[0].demand).toBeGreaterThanOrEqual(res.body.data.ranked[1].demand);
      }
    });
  });

  describe("POST /api/skills/gap-analysis", () => {
    it("should return skill gap analysis", async () => {
      const res = await request(app).post("/api/skills/gap-analysis").send({
        resumeText: VALID_RESUME,
        targetRole: "DevOps Engineer",
      });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("gaps");
      expect(res.body.data).toHaveProperty("coverage");
      expect(res.body.data).toHaveProperty("currentSkills");
    });

    it("should return 400 when targetRole is missing", async () => {
      const res = await request(app).post("/api/skills/gap-analysis").send({ resumeText: VALID_RESUME });
      expect(res.status).toBe(400);
    });
  });
});

describe("Token Counter Utility", () => {
  const { estimateTokens, truncateToTokenLimit, estimateCost, buildTokenReport } = require("../helpers/tokenCounter");

  it("should estimate tokens for a string", () => {
    const tokens = estimateTokens("Hello world, this is a test sentence.");
    expect(tokens).toBeGreaterThan(0);
  });

  it("should return 0 for empty string", () => {
    expect(estimateTokens("")).toBe(0);
    expect(estimateTokens(null)).toBe(0);
  });

  it("should truncate text to token limit", () => {
    const longText = "word ".repeat(2000);
    const truncated = truncateToTokenLimit(longText, 500);
    const tokens = estimateTokens(truncated);
    expect(tokens).toBeLessThanOrEqual(600); // some buffer
  });

  it("should not truncate text within limit", () => {
    const shortText = "This is a short resume text.";
    const result = truncateToTokenLimit(shortText, 1000);
    expect(result).toBe(shortText);
  });

  it("should estimate cost correctly", () => {
    const cost = estimateCost(1000, "gpt-4-turbo-preview", "input");
    expect(cost).toBeCloseTo(0.01, 5);
  });

  it("should build a token report", () => {
    const messages = [
      { role: "user", content: "Hello, help me with my resume." },
      { role: "assistant", content: "Sure! Please share your resume text." },
    ];
    const report = buildTokenReport(messages, "gpt-4-turbo-preview");
    expect(report).toHaveProperty("estimatedInputTokens");
    expect(report).toHaveProperty("contextLimit");
    expect(report).toHaveProperty("utilizationPercent");
    expect(report.willExceedLimit).toBe(false);
  });
});

describe("Response Formatter Utility", () => {
  const {
    formatAIAnalysisResponse,
    formatSkillRecommendations,
    formatInterviewQuestions,
    formatAnswerEvaluation,
    clamp,
  } = require("../helpers/responseFormatter");

  it("should format valid AI analysis response", () => {
    const raw = { overallScore: 85, readabilityScore: 78, keywordScore: 82, formatScore: 90, strengths: ["Good"], weaknesses: ["Needs improvement"], suggestions: [{ priority: "high", text: "Add summary" }], keywords: { found: ["React"], missing: ["K8s"] }, sections: [{ name: "Experience", score: 88, status: "good" }], summary: "Good resume." };
    const formatted = formatAIAnalysisResponse(raw);
    expect(formatted.overallScore).toBe(85);
    expect(formatted.strengths).toBeInstanceOf(Array);
  });

  it("should return defaults for null input", () => {
    const formatted = formatAIAnalysisResponse(null);
    expect(formatted.overallScore).toBe(0);
    expect(formatted.strengths).toBeInstanceOf(Array);
  });

  it("should clamp values correctly", () => {
    expect(clamp(150, 0, 100)).toBe(100);
    expect(clamp(-10, 0, 100)).toBe(0);
    expect(clamp(50, 0, 100)).toBe(50);
  });

  it("should format skill recommendations array", () => {
    const raw = [{ name: "Docker", demand: 89, salary: "+$10k", time: "1 month", priority: "high", category: "DevOps", reason: "Critical skill", resources: ["Docker Docs"] }];
    const formatted = formatSkillRecommendations(raw);
    expect(formatted).toHaveLength(1);
    expect(formatted[0].name).toBe("Docker");
  });

  it("should return empty array for non-array input", () => {
    expect(formatSkillRecommendations(null)).toEqual([]);
    expect(formatInterviewQuestions("invalid")).toEqual([]);
  });

  it("should format answer evaluation with defaults for missing fields", () => {
    const formatted = formatAnswerEvaluation({ score: 75 });
    expect(formatted.score).toBe(75);
    expect(formatted.grade).toBe("Average");
    expect(formatted.strengths).toBeInstanceOf(Array);
  });
});

afterAll(async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
});