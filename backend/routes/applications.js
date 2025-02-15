const express = require("express");
const multer = require("multer");
const Application = require("../models/Application");

// Route to get all applications
router.get('/applications', async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('job', 'jobTitle') // Populating the job field with only the jobTitle
      .select('fullName email status job') // Selecting relevant fields
      .sort({ createdAt: -1 }); // Sorting applications by creation date (most recent first)

    // Respond with the fetched applications
    res.json({ applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ data: 'Error fetching applications.' }); // Improved error message
  }
});

// Fetch approved applications for a specific student
router.get("/applications/student/:email", async (req, res) => {
  const { email } = req.params;

  try {
    // Find applications submitted by the student that are approved
    const approvedApplications = await Application.find({ 
      email: email, 
      isApproved: true 
    });

    res.status(200).json({ approvedApplications });
  } catch (error) {
    console.error("Error fetching approved applications:", error);
    res.status(500).json({ error: "Failed to fetch approved applications." });
  }
});



// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// POST endpoint to handle job application submission
router.post("/", upload.single("resume"), async (req, res) => {
  try {
    const { body, file } = req;

    // Log data to verify
    console.log("Form data:", body);
    console.log("Uploaded file:", file);

    // Create a new application document
    const newApplication = new Application({
      jobId: body.jobId,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      dob: body.dob,
      gender: body.gender,
      address: body.address,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      highestQualification: body.highestQualification,
      yearsOfExperience: body.yearsOfExperience,
      resume: file.path, // File path from Multer
      coverLetter: body.coverLetter,
      linkedIn: body.linkedIn,
      skills: body.skills,
    });

    // Save the application to the database
    await newApplication.save();

    res.status(201).json({ message: "Application submitted successfully!" });
  } catch (error) {
    console.error("Error saving application:", error);
    res.status(500).json({ error: "Failed to save application" });
  }
});
// GET all applications
router.get('/', async (req, res) => {
  try {
    // Fetch all applications from the database
    const applications = await Application.find().populate('jobId', 'jobTitle companyName'); // Populate job data if needed
    res.json({ applications });
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ message: 'Error fetching applications' });
  }
});
// Get all applications
router.get('/applications', async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('jobId', 'title companyName') // This should populate job details
      .exec();
    res.json(applications); // Send the applications data to the client
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
