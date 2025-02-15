const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skills: [String],
  resume: String,
  applications: [
    {
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
      status: { type: String, default: 'Applied' }
    }
  ]
});

module.exports = mongoose.model('Student', studentSchema);
