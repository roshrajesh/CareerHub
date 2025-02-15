const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./models/User');  // Assuming the User schema is in './models/User'

const router = express.Router();
const Application = require("../models/Application"); // Import Application model
const authMiddleware = require("../middleware/authMiddleware"); // Ensure authentication

router.get("/user", authMiddleware, async (req, res) => {
  try {
    const userEmail = req.user.email; // Extract authenticated user's email

    // Fetch the application details where email matches
    const application = await Application.findOne({ email: userEmail });

    if (!application) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Format response to use application.fieldName structure
    res.json({
      application: {
        fullName: application.fullName,
        email: application.email,
        phone: application.phone,
        dob: application.dob,
        gender: application.gender,
        address: application.address,
        city: application.city,
        state: application.state,
        zipCode: application.zipCode,
        highestQualification: application.highestQualification,
        yearsOfExperience: application.yearsOfExperience,
        resume: application.resume,
        coverLetter: application.coverLetter,
        linkedIn: application.linkedIn,
        skills: application.skills,
      }
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided. Access denied." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token is not valid" });
    }

    req.user = user; // Attach the decoded user to the request object
    next();
  });
};

// Middleware to check if the user is an admin
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next();
};

// Route to handle login
router.post("/login", async (req, res) => {
  console.log("Login request received:", req.body); // Debugging

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    console.log("User not found");
    return res.status(401).json({ message: "Invalid email or password." });
  }

  // Check if the password matches the stored password (plaintext)
  if (user.password !== password) {
    console.log("Password does not match");
    return res.status(401).json({ message: "Invalid email or password." });
  }

  // Create a JWT token
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

  // Send response with the token and user data
  res.status(200).json({
    token,
    user: {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    },
  });
});

module.exports = router;
