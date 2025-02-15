// jobroutes.js
const express = require('express');
const router = express.Router();
const { createJob, getJobs, updateJob, deleteJob } = require('./job');
const { getApplicationsForJob } = require('./applicationController');   // Assuming this is your controller

router.post('/jobs', createJob);  // POST request to create job
router.get('/jobs', getJobs);     // GET request to get all jobs
router.put('/jobs/:id', updateJob);  // PUT request to update a specific job
router.delete('/jobs/:id', deleteJob); // DELETE request to delete a specific job


// Define the route for fetching applicants for a specific job
router.get('/applications/:jobId', getApplicationsForJob);  

module.exports = router;
