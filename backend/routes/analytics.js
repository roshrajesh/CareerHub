const express = require("express");
const router = express.Router();
const JobApplication = require("../models/JobApplication"); // Job applications schema
const Job = require("../models/Job");
const User = require("../models/User");

// Get analytics data
router.get("/analytics", async (req, res) => {
  try {
    const totalApplications = await JobApplication.countDocuments();
    const totalApplicants = await JobApplication.distinct("applicantId").count();
    const totalJobs = await Job.countDocuments();
    
    // Applications per job
    const applicationsPerJob = await JobApplication.aggregate([
      { $group: { _id: "$jobId", count: { $sum: 1 } } }
    ]);

    // Most active applicants
    const mostActiveApplicants = await JobApplication.aggregate([
      { $group: { _id: "$applicantId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Approval/rejection rates
    const approvalRate = await JobApplication.aggregate([
      { 
        $group: { 
          _id: "$status", 
          count: { $sum: 1 } 
        } 
      }
    ]);

    res.json({
      totalApplications,
      totalApplicants,
      totalJobs,
      applicationsPerJob,
      mostActiveApplicants,
      approvalRate
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
