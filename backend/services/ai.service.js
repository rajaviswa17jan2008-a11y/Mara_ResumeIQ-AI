const client =
require("../config/openrouter");
 
/**
 * Fallback resume analysis with Gemini
 */
const analyzeResumeWithGemini = async (resumeText, jobDescription = "", targetRole = "") => {
  try {
 
    const prompt = `You are an expert ATS analyzer. Analyze this resume and return ONLY valid JSON.
 
RESUME:
${resumeText.substring(0, 3000)}
${jobDescription ? `\nJOB DESCRIPTION:\n${jobDescription.substring(0, 1500)}` : ""}
${targetRole ? `\nTARGET ROLE: ${targetRole}` : ""}
 
Return this exact JSON structure:
{
  "aiInsights": {
    "summary": "Expert assessment of resume quality",
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2"],
    "careerAdvice": "Actionable career guidance",
    "industryFit": [{"industry": "Technology", "score": 85}],
    "salaryEstimate": {"min": 70000, "max": 110000, "currency": "USD"}
  },
  "suggestions": {
    "critical": ["critical fix 1", "critical fix 2"],
    "improvements": ["improvement 1", "improvement 2"],
    "positive": ["positive 1", "positive 2"]
  },
  "keywords": {
    "found": [{"word": "React", "count": 2, "importance": "high"}],
    "missing": [{"word": "Docker", "importance": "medium", "category": "DevOps"}]
  },
  "skillAnalysis": {
    "presentSkills": [{"name": "JavaScript", "level": "advanced", "demand": "high"}],
    "missingSkills": [{"name": "TypeScript", "importance": "high", "category": "Language", "demand": "very high"}],
    "trendingSkills": [{"name": "AI Integration", "growth": "+200%", "demand": "emerging"}],
    "skillGapScore": 70
  },
  "interviewQuestions": {
    "technical": [{"question": "Sample technical question", "difficulty": "medium", "topic": "Core Skills"}],
    "behavioral": [{"question": "Tell me about yourself", "category": "Introduction"}],
    "roleSpecific": [{"question": "Why this role?", "focus": "Motivation"}]
  },
  "learningRoadmap": [
    {
      "skill": "TypeScript",
      "resources": [{"name": "Official Docs", "url": "https://typescriptlang.org", "type": "documentation", "duration": "2 weeks"}],
      "priority": "high",
      "estimatedTime": "1 month"
    }
  ]
}`;
 
   const completion =
await client.chat.completions.create({

  model:
    "openai/gpt-3.5-turbo",

  temperature: 0.3,

  max_tokens: 2000,

  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],

});

const text =
completion.choices[0]
.message.content;
 
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in Gemini response");
 
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("OpenRouter Analysis Error:", error.message);
    throw new Error(`OpenRouter analysis failed: ${error.message}`);
  }
};
 
/**
 * Chat with Gemini career bot
 */
const chatWithGeminiBot = async (messages, resumeContext = "") => {
  try {
 
    const systemContext = `You are ResumeIQ AI, an expert career coach. Help with resumes, job search, skills, and career development.
${resumeContext ? `User's resume context: ${resumeContext}` : ""}`;
 const completion =
await client.chat.completions.create({

  model:
    "meta-llama/llama-3.1-8b-instruct:free",

  temperature: 0.5,

  max_tokens: 1000,

  messages: [

    {
      role: "system",
      content: systemContext,
    },

    ...messages.map((m) => ({

      role:
        m.role === "assistant"
          ? "assistant"
          : "user",

      content: m.content,

    })),

  ],

});

const text =
completion.choices[0]
.message.content;
 
    return { content: text, tokens: Math.floor(text.length / 4) };
  } catch (error) {
    console.error("OpenRouter Chat Error:", error.message);
    throw new Error(`OpenRouter chat failed: ${error.message}`);
  }
};
 
module.exports = { analyzeResumeWithAI,chatWithAIBot };