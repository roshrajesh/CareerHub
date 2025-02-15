const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
  firstname: { 
    type: String, 
    required: [true, 'First name is required'], 
    trim: true 
  },
  lastname: { 
    type: String, 
    required: [true, 'Last name is required'], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    lowercase: true, 
    trim: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please fill a valid email address']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password should be at least 6 characters long']
  },
  role: { 
    type: String, 
    enum: ['Admin', 'Company', 'Student'], // Allowed roles
    default: 'Student'
  },
  
});

// Export the model
module.exports = mongoose.model('User', UserSchema);
