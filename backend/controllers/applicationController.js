// applicationController.js
const Application = require('../models/Application');  // Assuming you have an Application model





const getApplicationStatus = async (req, res) => {
  try {
    const userEmail = req.user.email; // Retrieved from authenticated user session

    // Find the application by the logged-in user's email
    const application = await Application.findOne(
      { email: userEmail },
      "isApproved aptitudeLink interviewLink"
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({
      status: application.isApproved ? "Approved" : "Rejected",
      aptitudeLink: application.aptitudeLink || "Not available",
      interviewLink: application.interviewLink || "Not available",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { getApplicationStatus };

// Function to fetch applicants for a specific job
const getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Find all applications for the given job ID
    const applications = await Application.find({ job: jobId });

    if (!applications) {
      return res.status(404).json({ message: 'No applicants found for this job' });
    }

    res.status(200).json({ applications });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ message: 'Failed to fetch applicants. Please try again later.' });
  }
};


exports.getApplicationsByStudentId = async (req, res) => {
  try {
    const studentId = req.params.userId; // Get the userId from the route parameter
    const applications = await Application.find({ studentId: studentId });

    if (!applications.length) {
      return res.status(404).json({ message: 'No applications found for this student' });
    }

    res.status(200).json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

module.exports = { getApplicationsForJob };
