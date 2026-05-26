const request = require("supertest");
const path = require("path");
const fs = require("fs");
const app = require("../server");

jest.mock("../middleware/auth.middleware", () => ({
  verifyToken: (req, res, next) => { req.user = { id: "test-user-id", name: "Test User", role: "user", plan: "pro" }; next(); },
  optionalAuth: (req, res, next) => { req.user = { id: "test-user-id", name: "Test User", role: "user", plan: "pro" }; next(); },
  verifyAdmin: (req, res, next) => next(),
  verifyPlan: () => (req, res, next) => next(),
  verifyInternalSecret: (req, res, next) => next(),
}));

const SAMPLE_RESUME_TEXT = `John Doe
john.doe@email.com | +1 (555) 123-4567 | linkedin.com/in/johndoe | github.com/johndoe

PROFESSIONAL SUMMARY
Senior Full Stack Developer with 6+ years of experience building scalable web applications. Led teams of 5+ engineers, delivered projects reducing operational costs by 40%. Expert in React, Node.js, and cloud infrastructure.

WORK EXPERIENCE
Senior Software Engineer — TechCorp Inc. (2021 – Present)
- Architected microservices platform serving 2M+ daily active users
- Optimized database queries, reducing response time by 65%
- Led migration from monolith to Kubernetes, saving $180k annually
- Mentored 4 junior engineers in React and Node.js best practices

Software Developer — StartupXYZ (2019 – 2021)
- Built real-time dashboard using React and WebSockets for 50k users
- Developed REST APIs with Node.js and Express serving 10M requests/day
- Implemented CI/CD pipelines reducing deployment time by 70%

EDUCATION
B.S. Computer Science — State University (2019)
GPA: 3.8/4.0

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, SQL
Frontend: React, Next.js, Redux, Tailwind CSS
Backend: Node.js, Express, FastAPI, GraphQL
Cloud & DevOps: AWS, Docker, Kubernetes, Terraform, GitHub Actions
Databases: PostgreSQL, MongoDB, Redis, Elasticsearch`;

describe("Resume Parsing Routes", () => {
  describe("POST /api/resume/parse-text", () => {
    it("should return 400 for missing resume text", async () => {
      const res = await request(app).post("/api/resume/parse-text").send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 for resume text that is too short", async () => {
      const res = await request(app)
        .post("/api/resume/parse-text")
        .send({ resumeText: "Too short" });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should successfully parse valid resume text", async () => {
      const res = await request(app)
        .post("/api/resume/parse-text")
        .send({ resumeText: SAMPLE_RESUME_TEXT });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
    });

    it("should extract contact information from resume", async () => {
      const res = await request(app)
        .post("/api/resume/parse-text")
        .send({ resumeText: SAMPLE_RESUME_TEXT });

      expect(res.status).toBe(200);
      expect(res.body.data.contact).toBeDefined();
      expect(res.body.data.contact.email).toMatch(/@/);
    });

    it("should extract skills from resume", async () => {
      const res = await request(app)
        .post("/api/resume/parse-text")
        .send({ resumeText: SAMPLE_RESUME_TEXT });

      expect(res.status).toBe(200);
      expect(res.body.data.skills).toBeDefined();
      expect(res.body.data.skills.all).toBeInstanceOf(Array);
      expect(res.body.data.skills.count).toBeGreaterThan(0);
    });

    it("should calculate ATS score", async () => {
      const res = await request(app)
        .post("/api/resume/parse-text")
        .send({ resumeText: SAMPLE_RESUME_TEXT });

      expect(res.status).toBe(200);
      expect(res.body.data.atsScore).toBeDefined();
      expect(res.body.data.atsScore.overall).toBeGreaterThanOrEqual(0);
      expect(res.body.data.atsScore.overall).toBeLessThanOrEqual(100);
    });
  });

  describe("POST /api/resume/analyze", () => {
    it("should return full analysis for valid resume", async () => {
      const res = await request(app)
        .post("/api/resume/analyze")
        .send({ resumeText: SAMPLE_RESUME_TEXT, targetRole: "Senior React Developer" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("atsScore");
      expect(res.body.data).toHaveProperty("skills");
      expect(res.body.data).toHaveProperty("aiFeedback");
    });

    it("should accept targetRole parameter", async () => {
      const res = await request(app)
        .post("/api/resume/analyze")
        .send({ resumeText: SAMPLE_RESUME_TEXT, targetRole: "DevOps Engineer" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should reject missing resume text", async () => {
      const res = await request(app)
        .post("/api/resume/analyze")
        .send({ targetRole: "Developer" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("Health Check", () => {
    it("should return health status", async () => {
      const res = await request(app).get("/health");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.service).toBe("ResumeIQ AI Engine");
    });
  });
});

describe("ATS Scorer Unit Tests", () => {
  const { calculateATSScore } = require("../services/atsScorer.service");
  const { splitSections } = require("../services/resumeParser.service");

  it("should return a score between 0 and 100", () => {
    const sections = splitSections(SAMPLE_RESUME_TEXT);
    const result = calculateATSScore({ rawText: SAMPLE_RESUME_TEXT, sections });
    expect(result.overall).toBeGreaterThanOrEqual(0);
    expect(result.overall).toBeLessThanOrEqual(100);
  });

  it("should identify action verbs in resume", () => {
    const { scoreActionVerbs } = require("../services/atsScorer.service");
    const result = scoreActionVerbs(SAMPLE_RESUME_TEXT);
    expect(result.found.length).toBeGreaterThan(0);
    expect(result.score).toBeGreaterThan(0);
  });

  it("should detect quantified achievements", () => {
    const { scoreQuantifiedAchievements } = require("../services/atsScorer.service");
    const result = scoreQuantifiedAchievements(SAMPLE_RESUME_TEXT);
    expect(result.count).toBeGreaterThan(0);
  });

  it("should identify section presence", () => {
    const sections = splitSections(SAMPLE_RESUME_TEXT);
    const { scoreSectionPresence } = require("../services/atsScorer.service");
    const result = scoreSectionPresence(sections);
    expect(result.score).toBeGreaterThan(0);
    expect(result.present).toBeInstanceOf(Array);
  });

  it("should produce breakdown with all required fields", () => {
    const sections = splitSections(SAMPLE_RESUME_TEXT);
    const result = calculateATSScore({ rawText: SAMPLE_RESUME_TEXT, sections });
    expect(result.breakdown).toHaveProperty("actionVerbs");
    expect(result.breakdown).toHaveProperty("quantifiedAchievements");
    expect(result.breakdown).toHaveProperty("sectionPresence");
    expect(result.breakdown).toHaveProperty("readability");
    expect(result.breakdown).toHaveProperty("format");
  });
});

describe("Skill Extractor Unit Tests", () => {
  const { extractSkillsFromText, getSkillGaps } = require("../services/skillExtractor.service");

  it("should extract React from resume", () => {
    const result = extractSkillsFromText(SAMPLE_RESUME_TEXT);
    const allLower = result.all.map((s) => s.toLowerCase());
    expect(allLower).toContain("react");
  });

  it("should extract backend skills", () => {
    const result = extractSkillsFromText(SAMPLE_RESUME_TEXT);
    expect(result.technical.backend.length).toBeGreaterThan(0);
  });

  it("should extract cloud skills", () => {
    const result = extractSkillsFromText(SAMPLE_RESUME_TEXT);
    expect(result.technical.cloud.length).toBeGreaterThan(0);
  });

  it("should return total skill count", () => {
    const result = extractSkillsFromText(SAMPLE_RESUME_TEXT);
    expect(result.count).toBeGreaterThan(5);
  });

  it("should calculate skill gaps for a target role", () => {
    const skills = extractSkillsFromText(SAMPLE_RESUME_TEXT);
    const gaps = getSkillGaps(skills, "devops engineer");
    expect(gaps).toHaveProperty("gaps");
    expect(gaps).toHaveProperty("coverage");
    expect(gaps.coverage).toBeGreaterThanOrEqual(0);
    expect(gaps.coverage).toBeLessThanOrEqual(100);
  });
});

afterAll(async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
});