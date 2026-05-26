const mongoose = require("mongoose");
 
const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, default: "New Chat" },
    messages: [
      {
        role: { type: String, enum: ["user", "assistant"], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        tokens: { type: Number, default: 0 },
      },
    ],
    context: { type: String, default: "career" },
    resumeContext: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
    },
    totalTokens: { type: Number, default: 0 },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);
 
chatSchema.index({ user: 1, createdAt: -1 });
 
module.exports = mongoose.model("Chat", chatSchema);
 