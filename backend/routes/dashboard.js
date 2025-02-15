const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Adjust this path according to your directory structure
const router = express.Router();

// Middleware to authenticate the JWT token
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Get student details
// Example route in your backend
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
      const student = await User.findById(req.user.id);
      if (!student) {
        return res.status(404).json({ msg: 'Student not found' });
      }
      res.json({
        firstname: student.firstname,
        lastname: student.lastname,
        email: student.email,
        role: student.role,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  });
  
module.exports = router;