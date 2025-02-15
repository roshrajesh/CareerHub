// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); // Import the Contact model

// GET route to fetch all contact messages (for admin)
router.get('/messages', async (req, res) => {
  try {
    const messages = await Contact.find();
    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages.' });
  }
});

// POST route for submitting a response to a message
router.post('/respond/:id', async (req, res) => {
  const { id } = req.params;
  const { response } = req.body;

  if (!response) {
    return res.status(400).json({ message: 'Response cannot be empty.' });
  }

  try {
    const message = await Contact.findById(id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    message.response = response; // Update the response
    await message.save(); // Save the updated message
    res.status(200).json({ message: 'Response sent successfully!' });
  } catch (error) {
    console.error('Error updating response:', error);
    res.status(500).json({ message: 'Failed to send response.' });
  }
});

module.exports = router;
