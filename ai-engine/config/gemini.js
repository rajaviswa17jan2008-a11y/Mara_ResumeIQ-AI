const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

async function geminiChat(prompt) {

  try {

    const model =
      genAI.getGenerativeModel({
        model: "gemini-pro",
      });

    const result =
      await model.generateContent(prompt);

    const response =
      await result.response;

    return response.text();

  } catch (err) {

    console.log(
      "Gemini Full Error:",
      err
    );

    throw err;
  }
}

module.exports = {
  geminiChat,
};