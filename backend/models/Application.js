const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  highestQualification: {
    type: String,
    required: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
  },
  resume: {
    type: String,
    required: true,
  },
  coverLetter: {
    type: String,
    required: true,
  },
  linkedIn: {
    type: String,
    required: true,
  },
  skills: {
    type: String,
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  aptitudeLink: {
    type: String,
  },
  interviewLink: {
    type: String,
  },
  message: {
    type: String,
  },
  approvalDate: {
    type: Date,
  },
});

module.exports = mongoose.model("Application", applicationSchema);
