const mongoose = require("mongoose");
 
const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: { type: String, required: true },
    fileType: { type: String, enum: ["pdf", "docx"], required: true },
    fileSize: { type: Number, required: true },
    cloudinary: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    parsedData: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      summary: { type: String, default: "" },
      skills: [{ type: String }],
      atsScore: {
  type: Number,
  default: 0
},

feedback: {
  type: Object,
  default: {}
},

recommendations: {
  type: Array,
  default: []
},
      education: [
        {
          degree: String,
          institution: String,
          year: String,
          gpa: String,
        },
      ],
      experience: [
        {
          title: String,
          company: String,
          duration: String,
          description: String,
          technologies: [String],
        },
      ],
      projects: [
        {
          name: String,
          description: String,
          technologies: [String],
          url: String,
        },
      ],
      certifications: [
        {
          name: String,
          issuer: String,
          year: String,
        },
      ],
      languages: [String],
      links: {
        linkedin: String,
        github: String,
        portfolio: String,
      },
    },
    rawText: { type: String, default: "" },
    status: {
      type: String,
      enum: ["uploaded", "parsing", "parsed", "analyzed", "error"],
      default: "uploaded",
    },
    isActive: { type: Boolean, default: true },
    analysisCount: { type: Number, default: 0 },
    lastAnalyzedAt: { type: Date },
    tags: [{ type: String }],
    title: { type: String, default: "My Resume" },
    version: { type: Number, default: 1 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
 
resumeSchema.virtual("analyses", {
  ref: "Analysis",
  localField: "_id",
  foreignField: "resume",
});
 
resumeSchema.index({ user: 1, createdAt: -1 });
resumeSchema.index({ status: 1 });
 
module.exports = mongoose.model("Resume", resumeSchema);
 