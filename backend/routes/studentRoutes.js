const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User'); // Assuming User schema is in './models/User'
const router = express.Router();

// Get student details (this route is protected)
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    // Fetch the user (student) details using the ID from the JWT payload
    const student = await User.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    // Send student details as the response
    res.json({
      firstname: student.firstname,
      lastname: student.lastname,
      email: student.email,
      role: student.role,
      // Add any other data you want to show on the dashboard
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});


// Get student profile
router.get('/:id', async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.json(student);
});

// Update student profile
router.put('/:id', async (req, res) => {
  const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedStudent);
});

// Apply to a job
router.post('/:id/apply', async (req, res) => {
  const student = await Student.findById(req.params.id);
  const job = await Job.findById(req.body.jobId);

  student.applications.push({ jobId: job._id, status: 'Applied' });
  await student.save();
  res.json(student);
});

// Get all job applications for the student
router.get('/:id/applications', async (req, res) => {
  const student = await Student.findById(req.params.id).populate('applications.jobId');
  res.json(student.applications);
});


module.exports = router;
