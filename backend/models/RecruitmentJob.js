const mongoose = require("mongoose");

// Recruitment Job Schema
const recruitmentJobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  companyName: { type: String, required: true },
  description: { type: String, required: true },
  aptitudeLink: { type: String, default: null },
  interviewLink: { type: String, default: null },
  status: { type: String, default: "pending" }, // "pending", "approved", or "rejected"
  message: { type: String, default: null }, // Message from the admin (optional)
});

// Recruitment Job Model
const RecruitmentJob = mongoose.model("RecruitmentJob", recruitmentJobSchema);

module.exports = RecruitmentJob;
