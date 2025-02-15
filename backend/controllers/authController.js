const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = 'your_secret_key'; // Replace with your actual secret key

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Authenticate user (verify email and password)
    const user = await User.findOne({ email });
    if (!user || !user.isPasswordValid(password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT payload
    const payload = {
      id: user._id,
      role: user.role,
    };

    // Sign token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    // Send token and user info in response
    res.json({ token, user: payload });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
