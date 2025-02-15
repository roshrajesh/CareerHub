const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const router = express.Router();

// Middleware to authenticate and authorize the user
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from 'Authorization' header
    if (!token) {
      return res.status(403).json({ message: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Assuming JWT_SECRET is stored in environment variables

    // Check if the user has an admin role
    const user = await User.findById(decoded.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. You are not authorized to view this data." });
    }

    // Attach user data to request for future use in route handlers
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(403).json({ message: "Invalid token or token expired." });
  }
};

// Route to fetch all users with authentication and authorization check
router.get("/api/users", authenticateAdmin, async (req, res) => {
  try {
    const users = await User.find().select("firstname email role"); // Select specific fields
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users. Please try again later." });
  }
});

module.exports = router;
