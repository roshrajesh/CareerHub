const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming this is the path to your User model

// Middleware to authenticate the user based on JWT token
const authenticate = async (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token

  // If no token is provided, respond with 401 Unauthorized
  if (!token) {
    return res.status(401).send({ message: 'Authorization token required' });
  }

  try {
    // Verify the token using the secret key (replace 'your_jwt_secret' with your actual secret)
    const decoded = jwt.verify(token, 'your_jwt_secret'); // 'your_jwt_secret' should be replaced with your JWT secret key

    // Find the user by the decoded email from the token
    const user = await User.findOne({ email: decoded.email });
    
    // If user not found, respond with 404 Not Found
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Attach the user object to the request (req.user) for later use in route handlers
    req.user = user;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    // Handle any errors (e.g., invalid token or expired token)
    console.error('Error in authentication:', error);
    res.status(401).send({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
