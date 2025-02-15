const express = require("express");
const Application = require("../models/Application");
const router = express.Router();
const { getApplicationStatus } = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware"); // JWT authentication middleware

// Define route for fetching application status
router.get("/application-status", authMiddleware, getApplicationStatus);

module.exports = router;

// Route to get applicants for a specific job
router.get("/api/applications/:jobId", async (req, res) => {
  const { jobId } = req.params;
  try {
    const applicants = await Application.find({ jobId }).populate("jobId");

    if (!applicants) {
      return res.status(404).json({ message: "No applicants found for this job" });
    }
    res.status(200).json({ applications: applicants });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ message: "Error fetching applicants" });
  }
});

module.exports = router;
