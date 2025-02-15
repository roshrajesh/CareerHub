const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Application = require('./models/Application');
const cors = require('cors');


const app = express();

// Setup Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save the file
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique file name
  }
});
const upload = multer({ storage });

// Connect to MongoDB
mongoose.connect('mongodb+srv://placement:dUVmdI40hvFvbSXN@cluster0.bdj3q.mongodb.netcareerhub/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON bodies
app.use(express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Application Submission Route
app.post('/api/applications', upload.single('resume'), async (req, res) => {
  try {
    const { jobId, fullName, email, phone, dob, gender, address, city, state, zipCode, highestQualification, yearsOfExperience, coverLetter, linkedIn, skills } = req.body;
    
    const applicationData = {
      jobId,
      fullName,
      email,
      phone,
      dob,
      gender,
      address,
      city,
      state,
      zipCode,
      highestQualification,
      yearsOfExperience,
      resume: req.file.path, // Store the file path for the resume
      coverLetter,
      linkedIn,
      skills
    };
    
    const application = new Application(applicationData);
    await application.save();
    
    res.status(201).json({ message: 'Application submitted successfully!' });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({ message: 'Failed to submit application.' });
  }
});

// Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
