// models/contact.js
const mongoose = require('mongoose');

// Define the schema for the contact message
const contactSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  response: { type: String, default: null }, // Admin's response to the message
}, {
  timestamps: true,  // Adding timestamps for createdAt and updatedAt
});

// Create the model from the schema
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
