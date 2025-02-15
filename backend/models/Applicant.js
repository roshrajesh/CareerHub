const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true }, // Reference to Job model
});

const Applicant = mongoose.model('Applicant', applicantSchema);

module.exports = Applicant;
