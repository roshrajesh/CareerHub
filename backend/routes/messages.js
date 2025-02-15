// routes/messages.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/contacts'); // Adjust the path accordingly

// Route to fetch all messages
router.get('/api/messages', async (req, res) => {
  try {
    const messages = await Contact.find(); // Fetch all messages from the DB
    res.json(messages); // Send them to the front end
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Route to update the response
router.patch('/api/messages/:id', async (req, res) => {
  const { id } = req.params;
  const { response } = req.body; // Expecting the response to be sent in the request body

  try {
    const message = await Contact.findByIdAndUpdate(id, { response }, { new: true });
    res.json(message); // Return the updated message
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

module.exports = router;
