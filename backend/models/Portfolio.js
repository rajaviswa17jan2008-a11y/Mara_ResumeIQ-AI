const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: {
    type: String,
    default: "My Portfolio",
  },

  template: {
    type: String,
    required: true,
    default: "cyberpunk",
  },

  portfolioData: {
    type: Object,
    required: true,
  },

  isPublic: {
    type: Boolean,
    default: false,
  },

  views: {
    type: Number,
    default: 0,
  },

  slug: {
    type: String,
    unique: true,
    sparse: true,
  },
},
{
  timestamps: true,
}
);

portfolioSchema.index({
  user: 1,
  createdAt: -1,
});

module.exports =
mongoose.model(
  "Portfolio",
  portfolioSchema
);