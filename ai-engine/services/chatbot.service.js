const { geminiChatMultiTurn } = require("../config/gemini");

const SYSTEM_PROMPT = `You are ResumeIQ's expert AI Career Coach with deep expertise in:
- Resume writing and ATS optimization
- Career planning and transitions
- Job search strategies
- Interview preparation
- Salary negotiation
- Skill development and learning paths
- LinkedIn optimization
- Personal branding

You are:
- Encouraging but honest and direct
- Data-driven and specific (give actual numbers, frameworks, timelines)
- Focused on actionable advice
- Knowledgeable about 2025-2026 job market trends
- Aware of tech industry salary ranges and company cultures

When giving advice:
1. Be specific and actionable
2. Use frameworks when helpful (STAR, SMART goals, etc.)
3. Give concrete examples
4. Acknowledge trade-offs
5. Be encouraging but realistic

Keep responses conversational but informative. Use bullet points or numbered lists when helpful.`;

async function getChatbotResponse(message, conversationHistory = []) {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...conversationHistory.slice(-10).map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: message },
  ];
const geminiHistory =
  messages.map(m => ({
    role:
      m.role === "assistant"
        ? "model"
        : "user",

    content: m.content,
  }));

return await geminiChatMultiTurn(
  geminiHistory,
  message,
  {
    maxTokens: 1000,
  }
);
 
}

module.exports = { getChatbotResponse };