const express = require('express');
const Application = require('../models/Application'); // Import the Application model
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const authenticate = require('../middleware/authenticate'); // Assuming the path to authenticate middleware




// Fetch applications based on logged-in user's email
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userEmail = req.user.email; // Extract email from the authenticated user

    // Fetch applications that match the user's email
    const applications = await Application.find({ email: userEmail });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// ✅ Fetch applications for the logged-in user
router.get("/user-applications", authMiddleware, async (req, res) => {
  try {
    const userEmail = req.query.email; // ✅ Get email from query params

    if (!userEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    // ✅ Find applications where the email matches
    const applications = await Application.find({ email: userEmail }).select(
      "isApproved aptitudeLink interviewLink message"
    );

    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create Application
router.post("/", authMiddleware, async (req, res) => {
  try {
    const application = new Application(req.body);
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get application by email
router.get("/application/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const application = await Application.findOne(
      { email },
      "fullName isApproved"
    ); // Select only fullName and isApproved fields
    if (application) {
      res.status(200).json(application);
    } else {
      res.status(404).json({ message: "No application found for this email." });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
// Get Applications for Logged-in User
router.get("/", authMiddleware, async (req, res) => {
  const applications = await Application.find({ email: req.user.email });
  res.json(applications);
});

// Route to fetch applications for a specific student by email
router.get('/applications/student/:email', async (req, res) => {
  try {
    const applications = await Application.find({ studentEmail: req.params.email })
      .populate('jobId', 'title company') // Populate the job details (title and company)
      .exec();

    if (!applications.length) {
      return res.status(404).json({ message: 'No applications found for this student' });
    }

    res.status(200).json({ applications });
  } catch (error) {
    console.error('Error fetching student applications:', error);
    res.status(500).json({ message: 'Error fetching applications' });
  }
});

// Route to fetch all applications (for admin dashboard)
router.get('/applications', async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('jobId', 'title company') // Populate the job details (title and company)
      .exec();

    res.status(200).json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Error fetching applications' });
  }
});

// Route to approve an application (for admin or company)
router.patch('/applications/approve/:applicationId', async (req, res) => {
  const { message, aptitudeLink, interviewLink } = req.body;
  try {
    // Ensure that all necessary fields are provided
    if (!message || !aptitudeLink || !interviewLink) {
      return res.status(400).json({ error: 'Message, Aptitude Test Link, and Interview Link are required.' });
    }

    const application = await Application.findById(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update application to mark as approved and set additional details
    application.isApproved = true;
    application.message = message;
    application.aptitudeLink = aptitudeLink;
    application.interviewLink = interviewLink;
    application.approvalDate = new Date();

    await application.save();

    res.status(200).json({ message: 'Application approved successfully!' });
  } catch (error) {
    console.error('Error approving application:', error);
    res.status(500).json({ message: 'Error approving application.' });
  }
});

// Get applications for a specific job (for companies)
router.get('/applications/job/:jobId', async (req, res) => {
  const { jobId } = req.params;
  try {
    const applications = await Application.find({ jobId })
      .populate('studentEmail', 'name email') // Populate student details (name and email)
      .exec();

    if (!applications.length) {
      return res.status(404).json({ message: 'No applications found for this job' });
    }

    res.status(200).json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Error fetching applications' });
  }
});

// Get specific application details by application ID
router.get('/application/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const application = await Application.findById(id)
      .populate('jobId', 'title company') // Populate job details (title and company)
      .populate('studentEmail', 'name email') // Populate student details (name and email)
      .exec();

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ application });
  } catch (error) {
    console.error('Error fetching application details:', error);
    res.status(500).json({ message: 'Error fetching application details' });
  }
});

// Route to fetch applications by student email
router.get('/api/applications/student/:email', async (req, res) => {
  const { email } = req.params;

  try {
    // Find applications for the given email and populate jobId details
    const applications = await Application.find({ email })
      .populate('jobId', 'title companyName'); // Populate only title and companyName fields from Job model

    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: 'No applications found for this email.' });
    }

    res.json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Route to get applications for the logged-in student
router.get('/api/applications', authenticate, async (req, res) => {
  try {
    // Fetch applications for the logged-in user based on email
    const applications = await Application.find({ email: req.user.email });
    res.status(200).json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).send({ message: 'Failed to fetch applications' });
  }
});
module.exports = router;
