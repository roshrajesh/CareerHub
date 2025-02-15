const express = require('express');
const Job = require('../models/Job'); // Import the Job model

const router = express.Router();

// Fetch all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json({ jobs });
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

// Add a new job
router.post('/', async (req, res) => {
  const { title, description, requiredSkills, status } = req.body;

  if (!title || !description || !requiredSkills || !status) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newJob = new Job({ title, description, requiredSkills, status });
    await newJob.save();
    res.status(201).json({ message: 'Job created successfully', newJob });
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(500).json({ message: 'Failed to create job' });
  }
});

// Edit a job
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, requiredSkills, status } = req.body;

  try {
    const updatedJob = await Job.findByIdAndUpdate(id, {
      title,
      description,
      requiredSkills,
      status,
    }, { new: true });

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job updated successfully', updatedJob });
  } catch (err) {
    console.error('Error updating job:', err);
    res.status(500).json({ message: 'Failed to update job' });
  }
});

// Delete a job
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error('Error deleting job:', err);
    res.status(500).json({ message: 'Failed to delete job' });
  }
});

module.exports = router;
