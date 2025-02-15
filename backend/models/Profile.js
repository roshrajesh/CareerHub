const mongoose = require('mongoose');

// Define a Profile model (MongoDB)
const profileSchema = new mongoose.Schema({
    avatar: String,
    name: String,
    location: String,
    role: String,
    phone: String,
    email: String,
    linkedin: String,
    github: String,
    skills: [String],
    bio: String,
    experience: [
      {
        company: String,
        role: String,
        duration: String,
      },
    ],
  });
const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
