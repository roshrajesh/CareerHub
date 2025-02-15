const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path if needed

const authMiddleware = async (req, res, next) => {
  const token = req.header('x-auth-token'); // The token should be sent in the headers

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token and get user id
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // JWT_SECRET should be in your .env file
    req.user = decoded.user;
    
    // Check if user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


// Middleware to verify the token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided. Access denied.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token is not valid' });
    }
    req.user = user; // Attach the user information to the request object
    next();
  });
};

// Middleware to verify if the user is an Admin
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin };


module.exports = authMiddleware;
