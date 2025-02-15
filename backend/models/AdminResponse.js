const mongoose = require('mongoose');

const AdminResponseSchema = new mongoose.Schema({
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContactMessage', // This is the reference to the contact message model
    required: true
  },
  response: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const AdminResponse = mongoose.model('AdminResponse', AdminResponseSchema);
module.exports = AdminResponse;
