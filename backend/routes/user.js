// routes/user.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth"); // Ensure authentication is handled here
// server.js or routes/user.js (adjust according to your project structure)
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Assuming you have a User model

const bcrypt = require("bcryptjs");



router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, "your_secret_key", {
      expiresIn: "1h",
    });

    // Send token in the response
    res.json({ token, user: { email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;

router.get("/student", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Get the user's ID from the JWT payload

    // Fetch user data (jobs, applications)
    const jobs = await Job.find({ userId });
    const applicationsSubmitted = await Application.countDocuments({ userId });
    const applicationsApproved = await Application.countDocuments({ userId, status: 'approved' });

    res.json({
      jobs,
      applicationsSubmitted,
      applicationsApproved,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Middleware to verify the JWT token
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from Authorization header
  if (!token) return res.status(403).json({ message: 'Access denied, token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the JWT token
    req.user = decoded; // Attach the decoded user data to request
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Route to fetch user data
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Assuming your token has user.id
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user); // Return user data
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;
