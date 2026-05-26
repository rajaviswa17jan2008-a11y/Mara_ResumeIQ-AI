const client =
require("../config/openrouter");
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
      .slice(-12)
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
  const completion =
await client.chat.completions.create({

  model:
    "openai/gpt-3.5-turbo",

  temperature: 0.3,

  max_tokens: 350,

  messages: messages.map(m => ({

    role:
      m.role === "model"
        ? "assistant"
        : m.role,

    content: m.content,

  })),

});

return completion
  .choices[0]
  .message.content;
   
  } catch (err) {

    logger.error(
      "OpenRouter chat failed:",
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
      "OpenRouter stream failed:",
      err.message
    );

    throw err;
  }
}

module.exports = {
  getChatbotResponse,
  streamChatbotResponse,
};