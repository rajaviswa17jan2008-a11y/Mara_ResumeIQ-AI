const {
  getChatbotResponse,
} = require(
  "../services/chatbot.service"
);

const sendMessage =
async (req, res) => {

  try {

    const {
      message,
      history,
      userContext,
    } = req.body;

    const reply =
    await getChatbotResponse(

      message,

      history || [],

      userContext || {}

    );

    res.json({

      success: true,

      reply,

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      error: err.message,

    });

  }

};

module.exports = {
  sendMessage,
};