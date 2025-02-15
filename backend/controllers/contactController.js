// controllers/contactController.js
const Contact = require('../models/contacts');

// Get all contact messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact messages', error });
  }
};

// Get a single contact message by ID
exports.getMessageById = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching message', error });
  }
};

// Update the response to a contact message
exports.updateResponse = async (req, res) => {
  try {
    const { response } = req.body;
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { response },
      { new: true } // Return the updated message
    );
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error updating response', error });
  }
};

// Delete a contact message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error });
  }
};
