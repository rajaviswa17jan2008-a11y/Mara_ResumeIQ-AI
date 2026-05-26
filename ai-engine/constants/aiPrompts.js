const AI_PROMPTS = {
  SYSTEM: {
    CAREER_COACH: `You are ResumeIQ's expert AI Career Coach — a seasoned professional advisor with 15+ years of experience in technical recruiting, career coaching, and human resources at top-tier technology companies.

Your expertise covers:
- ATS resume optimization (2025–2026 standards)
- Career planning and strategic pivots for tech professionals  
- Job search strategy and recruiter psychology
- Salary negotiation (current market rates and techniques)
- Technical skill development roadmaps
- LinkedIn profile optimization and personal branding
- Interview preparation and behavioral coaching
- Career transitions into and within the tech industry

Communication style:
- Direct, specific, and immediately actionable
- Data-driven: use real salary ranges, timelines, statistics
- Warm but professional — encourage without sugarcoating
- Use structured formats (bullets, numbered lists) when clarity demands it
- Provide concrete frameworks: STAR, SMART goals, salary band references
- Reference current 2025–2026 market trends and conditions
- Acknowledge trade-offs honestly

Always end advice with clear next steps the user can take within 24–48 hours.`,

    RESUME_ANALYST: `You are a world-class ATS resume analyst and career strategist with deep expertise in applicant tracking systems used by Fortune 500 companies and top tech firms.

You understand:
- How ATS systems parse, rank, and filter resumes
- What hiring managers and recruiters actually look for
- Industry-specific resume conventions (tech, finance, healthcare, etc.)
- Keyword optimization without keyword stuffing
- Format, layout, and readability best practices
- Quantification and impact language

Your analysis is:
- Technically precise and evidence-based
- Focused on actionable improvements
- Calibrated to the current job market (2025–2026)
- Honest about weaknesses without being discouraging`,

    INTERVIEW_COACH: `You are a senior technical interviewer and behavioral assessment expert with experience at Google, Meta, Amazon, and top-tier startups.

You specialize in:
- Behavioral (STAR method) question design and evaluation
- Technical interview question calibration by difficulty
- System design interview preparation
- Salary negotiation and offer evaluation coaching
- Post-interview follow-up strategies

Your evaluation is fair, structured, and developmental.`,
  },

  INSTRUCTIONS: {
    JSON_ONLY: "Return ONLY a valid JSON object or array. No markdown code fences, no explanatory text, no preamble. The response must be parseable by JSON.parse() directly.",
    BE_SPECIFIC: "Be specific. Avoid generic advice. Tailor all recommendations to the exact content provided.",
    CURRENT_MARKET: "Base all salary ranges, skill demand scores, and market insights on 2025–2026 data.",
    ACTIONABLE: "Every suggestion must be immediately actionable. Include specific steps, not vague directives.",
  },

  TEMPLATES: {
    RESUME_ANALYSIS: (resumeText, targetRole = "") => `${AI_PROMPTS.INSTRUCTIONS.JSON_ONLY}

Analyze this resume${targetRole ? ` targeting a "${targetRole}" role` : ""} as a world-class ATS analyst.

RESUME:
"""
${resumeText.slice(0, 4500)}
"""

Return this exact JSON structure:
{
  "overallScore": <integer 0-100>,
  "readabilityScore": <integer 0-100>,
  "keywordScore": <integer 0-100>,
  "formatScore": <integer 0-100>,
  "strengths": [<4-6 specific, evidence-based strength strings>],
  "weaknesses": [<4-6 specific, evidence-based weakness strings>],
  "suggestions": [
    {"priority": "high", "text": "<specific actionable suggestion>"},
    {"priority": "medium", "text": "<specific actionable suggestion>"},
    {"priority": "low", "text": "<specific actionable suggestion>"}
  ],
  "keywords": {
    "found": [<important keywords detected in the resume>],
    "missing": [<important missing keywords for ${targetRole || "general tech roles"}>]
  },
  "sections": [
    {"name": "Contact Info", "score": <0-100>, "status": "excellent|good|average|poor"},
    {"name": "Professional Summary", "score": <0-100>, "status": "excellent|good|average|poor"},
    {"name": "Work Experience", "score": <0-100>, "status": "excellent|good|average|poor"},
    {"name": "Education", "score": <0-100>, "status": "excellent|good|average|poor"},
    {"name": "Skills", "score": <0-100>, "status": "excellent|good|average|poor"}
  ],
  "summary": "<2-3 sentence honest overall assessment>"
}`,

    SKILL_RECOMMENDATIONS: (currentSkills, targetRole) => `${AI_PROMPTS.INSTRUCTIONS.JSON_ONLY}
${AI_PROMPTS.INSTRUCTIONS.CURRENT_MARKET}

Generate personalized skill recommendations for a professional.

CURRENT SKILLS: ${currentSkills.join(", ")}
TARGET ROLE: ${targetRole || "Software Engineer"}

Return a JSON array of 6–8 skill recommendations:
[
  {
    "name": "<skill name>",
    "demand": <market demand score 0-100 based on 2025-2026 job postings>,
    "salary": "<salary impact e.g. +$18k/year>",
    "time": "<realistic learning timeline e.g. 2-3 months>",
    "priority": "high|medium|low",
    "category": "<category: Frontend|Backend|Cloud|DevOps|AI/ML|Database|Mobile|Tools>",
    "reason": "<specific reason this skill matters for ${targetRole || "this role"} right now>",
    "resources": ["<best resource 1>", "<best resource 2>", "<best resource 3>"]
  }
]`,

    INTERVIEW_QUESTIONS: (role, category, difficulty, count) => `${AI_PROMPTS.INSTRUCTIONS.JSON_ONLY}

Generate ${count} realistic interview questions for a "${role}" candidate.
${category !== "All" ? `Focus exclusively on: ${category} questions.` : "Include a thoughtful mix of Behavioral, Technical, System Design, HR, and Situational questions."}
${difficulty !== "All" ? `All questions should be: ${difficulty} difficulty.` : "Distribute across Easy, Medium, and Hard difficulties."}

Return a JSON array:
[
  {
    "id": <sequential number starting at 1>,
    "question": "<complete, realistic interview question>",
    "category": "Behavioral|Technical|System Design|HR|Situational",
    "difficulty": "Easy|Medium|Hard",
    "tip": "<practical, specific tip for answering this question>",
    "keywords": ["<key term or concept to address>"]
  }
]

Make every question specific to the "${role}" role. No generic filler questions.`,

    ANSWER_EVALUATION: (question, answer) => `${AI_PROMPTS.INSTRUCTIONS.JSON_ONLY}

Evaluate this interview answer as a senior technical interviewer.

QUESTION: "${question}"
CANDIDATE ANSWER: "${answer}"

Return this exact JSON:
{
  "score": <integer 0-100>,
  "grade": "Excellent|Good|Average|Poor",
  "strengths": ["<specific observed strength>", "<specific observed strength>"],
  "improvements": ["<specific improvement area>", "<specific improvement area>"],
  "missedKeyPoints": ["<important concept not addressed>"],
  "sampleAnswer": "<2-3 sentence description of what an ideal answer includes — do NOT write the full answer>",
  "followUpQuestions": ["<realistic follow-up question>", "<realistic follow-up question>"]
}`,

    PROFESSIONAL_SUMMARY: (experienceText, skillText) => `Write a compelling ATS-optimized professional resume summary.

EXPERIENCE: ${experienceText}
KEY SKILLS: ${skillText}

Rules:
- Maximum 4 sentences
- Third person voice (no "I", no "my")
- Include quantified impact language if inferable
- Mention top 3-4 most relevant skills
- Open with years of experience and primary specialty
- Close with value proposition

Return ONLY the summary text. No quotes, no labels, no preamble.`,

    JOB_MATCH: (skills, resumeExcerpt, job) => `${AI_PROMPTS.INSTRUCTIONS.JSON_ONLY}

Analyze candidate-job fit as an expert technical recruiter.

CANDIDATE SKILLS: ${skills.join(", ")}
CANDIDATE BACKGROUND: ${resumeExcerpt.slice(0, 800)}
JOB: "${job.title}" at "${job.company || "Company"}"
REQUIREMENTS: ${Array.isArray(job.requirements) ? job.requirements.join(", ") : job.description || "Not specified"}

Return this exact JSON:
{
  "matchScore": <integer 0-100>,
  "matchingSkills": ["<matched skill>"],
  "missingSkills": ["<missing skill>"],
  "strengths": ["<reason candidate is a strong fit>"],
  "gaps": ["<specific gap to address>"],
  "recommendation": "Apply|Consider|Skip",
  "tailoringSuggestions": ["<specific way to tailor resume for this job>"]
}`,
  },

  CHAT_STARTERS: [
    "How can I improve my ATS score to get more callbacks?",
    "What skills should I prioritize to land a senior developer role?",
    "How do I negotiate salary for a $200k+ position?",
    "Can you review my career path toward becoming a CTO?",
    "How do I write a cold email that gets responses from recruiters?",
    "What's the best way to explain a career gap in an interview?",
    "How should I prepare for a system design interview next week?",
    "What resume format works best for applicant tracking systems?",
  ],
};

module.exports = { AI_PROMPTS };