/**
 * Portfolio Generator Prompt Builder
 * Extracts structured portfolio data from raw resume text via AI.
 * Place this file at: backend/utils/portfolioPrompt.js
 */

/**
 * Builds the AI messages to extract structured portfolio data from a resume.
 * @param {string} resumeText
 * @returns {Array} OpenAI message format
 */
const buildPortfolioExtractionMessages = (resumeText) => {
  const systemPrompt = `
You are an expert resume parser and portfolio content writer. 
Your job is to extract and enrich resume data into a structured portfolio-ready JSON format.

Extract ALL available information from the resume and return ONLY this exact JSON structure:

{
  "personal": {
    "name": "<full name>",
    "title": "<professional title or most recent job title>",
    "tagline": "<a catchy 1-line professional tagline you generate based on their background>",
    "bio": "<a compelling 3-4 sentence professional bio written in first person>",
    "email": "<email if found, else empty string>",
    "phone": "<phone if found, else empty string>",
    "location": "<city, country if found>",
    "website": "<personal website if found>",
    "linkedin": "<linkedin URL or handle if found>",
    "github": "<github URL or handle if found>",
    "twitter": "<twitter handle if found>"
  },

  "skills": {
    "technical": [
      { "name": "<skill name>", "level": <integer 1-100>, "category": "language|framework|tool|database|cloud|other" }
    ],
    "soft": ["<soft skill 1>", "<soft skill 2>"],
    "featured": ["<top 6 skills to prominently display>"]
  },

  "experience": [
    {
      "id": "<unique id like exp_1>",
      "company": "<company name>",
      "role": "<job title>",
      "duration": "<e.g. Jan 2022 – Present>",
      "location": "<city or Remote>",
      "description": "<2-3 sentence summary of role>",
      "achievements": ["<quantified achievement 1>", "<quantified achievement 2>"],
      "technologies": ["<tech used>"],
      "current": <true if current role, false otherwise>
    }
  ],

  "education": [
    {
      "id": "<unique id>",
      "institution": "<university/school name>",
      "degree": "<degree type>",
      "field": "<field of study>",
      "duration": "<e.g. 2018 – 2022>",
      "grade": "<GPA or grade if mentioned>",
      "achievements": ["<relevant achievement or activity>"]
    }
  ],

  "projects": [
    {
      "id": "<unique id like proj_1>",
      "name": "<project name>",
      "description": "<2-3 sentence project description>",
      "impact": "<what impact or results did it have>",
      "technologies": ["<tech stack used>"],
      "liveUrl": "<live URL if mentioned>",
      "githubUrl": "<github URL if mentioned>",
      "featured": <true for top 3 projects>
    }
  ],

  "certifications": [
    {
      "name": "<certification name>",
      "issuer": "<issuing organization>",
      "year": "<year obtained>",
      "url": "<credential URL if mentioned>"
    }
  ],

  "achievements": [
    "<notable achievement or award as a full sentence>"
  ],

  "languages": [
    { "language": "<language name>", "proficiency": "Native|Fluent|Professional|Basic" }
  ],

  "meta": {
    "primaryColor": "<suggest a hex color that fits their industry/personality>",
    "accentColor": "<a complementary accent hex color>",
    "industry": "<detected industry>",
    "experienceLevel": "Junior|Mid|Senior|Lead|Director|Executive",
    "totalYearsExperience": <estimated years as integer>
  }
}

Important rules:
- If data is not available, use empty string "" or empty array []
- Generate the bio and tagline even if not explicitly in the resume (infer from context)
- Always populate the "featured" skills array with exactly 6 skills
- Set "featured: true" for the best 3 projects
- Return ONLY the JSON, nothing else
`.trim();

  return [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `Extract portfolio data from this resume:\n\n---\n${resumeText}\n---`,
    },
  ];
};

/**
 * Builds messages for generating a catchy portfolio "about" section copy.
 * @param {Object} portfolioData - Already extracted portfolio data
 * @returns {Array}
 */
const buildPortfolioCopyMessages = (portfolioData) => {
  return [
    {
      role: "system",
      content:
        "You are an expert personal brand copywriter. " +
        "Write compelling, authentic portfolio copy for each section. " +
        "Return ONLY JSON: { " +
        '"heroHeadline": "...", ' +
        '"heroSubheadline": "...", ' +
        '"aboutParagraph1": "...", ' +
        '"aboutParagraph2": "...", ' +
        '"callToAction": "...", ' +
        '"contactIntro": "..." ' +
        "}",
    },
    {
      role: "user",
      content: `Create portfolio copy for: ${JSON.stringify(portfolioData.personal)}. Skills: ${portfolioData.skills?.featured?.join(", ")}`,
    },
  ];
};

module.exports = {
  buildPortfolioExtractionMessages,
  buildPortfolioCopyMessages,
};