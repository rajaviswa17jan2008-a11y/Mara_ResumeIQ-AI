const ai =
require("../config/gemini");
const MODELS =
require("../config/aiModels");
const { buildChatSystemPrompt } = require("../utils/promptBuilder");
const { logger } = require("../utils/logger");

async function getChatbotResponse(
  message,
  conversationHistory = [],
  userContext = {}
) {

  const systemPrompt =
    buildChatSystemPrompt(userContext);

  const messages = [
    {
  role: "system",
  content: `
${systemPrompt}

Rules:
- Give short and clean answers.
- Avoid long paragraphs.
- Use emojis.
- Use bold headings.
- Use bullet points.
- Show only important points.
- Keep answers mobile friendly.
- Maximum 5 bullet points.
- Use spacing between sections.

Example:

🚀 **Skills to Learn**
• React.js
• Node.js
• MongoDB

💡 **Tips**
• Build projects
• Practice interviews
`,
},

    ...conversationHistory
      .slice(-5)
      .filter(m => m.role && m.content)
      .map(m => ({
        role:
          m.role === "assistant"
            ? "model"
            : "user",

        content: m.content,
      })),

    {
      role: "user",
      content: message,
    },
  ];

  try {
   const response =
await ai.models.generateContent({
  model: MODELS.CHATBOT,
  contents: messages
    .map(m => `${m.role}: ${m.content}`)
    .join("\n\n"),
});

return response.text;
   
  } catch (err) {

  console.log(
    "FULL GEMINI ERROR:",
    err
  );

  logger.error(
    "Gemini chat failed:",
    err.message
  );

  throw new Error(
    "AI service temporarily unavailable."
  );
}
}

async function streamChatbotResponse(
  message,
  conversationHistory = [],
  userContext = {},
  onChunk
) {

  try {

    const reply =
      await getChatbotResponse(
        message,
        conversationHistory,
        userContext
      );

    if (onChunk) {
      onChunk(reply);
    }

    return reply;

  } catch (err) {

    logger.error(
  "Gemini stream failed:",
  err.message
);

    throw err;
  }
}

module.exports = {
  getChatbotResponse,
  streamChatbotResponse,
};