import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./stylee.css";

axios.defaults.baseURL = "http://localhost:5001"; // Backend URL

const CompanyDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requiredSkills: "",
    status: "Active",
  });
  const [editingJob, setEditingJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/jobs");
        console.log("Fetched jobs:", response.data.jobs); // Debug log
        setJobs(response.data.jobs || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        alert("Failed to fetch jobs. Please try again later.");
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Fetch applicants for a specific job
  const fetchApplicants = async (jobId) => {
    try {
      const response = await axios.get(`/api/applications/${jobId}`);
      setApplications(response.data.applications || []);
      setSelectedJob(jobId);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      alert("Failed to fetch applicants. Please try again later.");
    }
  };

  // Handle delete job
  const handleDeleteJob = async (jobId) => {
    const confirmation = window.confirm("Are you sure you want to delete this job?");
    if (!confirmation) return; // If the user cancels, do nothing
    
    try {
      const response = await axios.delete(`/api/jobs/${jobId}`);
      if (response.status === 200) {
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId)); // Update the state by filtering out the deleted job
        alert("Job deleted successfully!");
      } else {
        alert("Failed to delete the job. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job. Please try again later.");
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for adding/updating a job
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.title || !formData.description || !formData.requiredSkills) {
      return alert("Please fill out all required fields.");
    }

    try {
      if (editingJob) {
        // Update existing job
        const response = await axios.put(`/api/jobs/${editingJob._id}`, formData);

        // Directly update the job in the state
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === editingJob._id ? response.data.updatedJob : job
          )
        );
        alert("Job updated successfully!");
      } else {
        // Add new job
        const response = await axios.post("/api/jobs", formData);
        setJobs([...jobs, response.data.newJob]);
        alert("Job added successfully!");
      }
      // Reset form and editing state
      setFormData({
        title: "",
        description: "",
        requiredSkills: "",
        status: "Active",
      });
      setEditingJob(null);
    } catch (error) {
      console.error("Error saving job:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to save job. Please try again later.");
    }
  };

  // Handle edit button click
  const handleEditJob = (job) => {
    setEditingJob(job); // Set the editing state to the selected job
    setFormData({
      title: job.title,
      description: job.description,
      requiredSkills: job.requiredSkills,
      status: job.status,
    });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div id="company-dashboard">
      <section id="sidebar">
        <a href="#" className="brand">
          <i className="bx bxs-briefcase"></i>
          <span className="text">CareerHub</span>
        </a>
        <ul className="side-menu">
          <li>
            <Link to="/compny" className="active">
              <i className="bx bxs-dashboard"></i>
              <span className="text">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/company-profile">
              <i className="bx bxs-user"></i>
              <span className="text">Company Profile</span>
            </Link>
          </li>
          <li>
            <Link to="/">
              <i className="bx bxs-log-out-circle"></i>
              <span className="text">Logout</span>
            </Link>
          </li>
        </ul>
      </section>

      <section id="content">
        <main>
          <div className="head-title">
            <h1>Company Dashboard</h1>
          </div>

          <div className="dashboard-summary">
            <div className="card">
              <i className="bx bxs-briefcase"></i>
              <h3>{jobs.length} Jobs</h3>
              <p>Total job postings</p>
            </div>
           
          </div>

          <div className="form-container">
            <h2>{editingJob ? "Edit Job" : "Add New Job"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Job Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Required Skills</label>
                <input
                  type="text"
                  name="requiredSkills"
                  value={formData.requiredSkills}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <button type="submit">Save</button>
            </form>
          </div>

          <div className="table-data">
            <h2>Job Openings</h2>
            <table>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, index) => {
                  if (!job || !job.title) {
                    console.warn(`Invalid job data at index ${index}:`, job);
                    return null;
                  }
                  return (
                    <tr key={job._id}>
                      <td>{job.title}</td>
                      <td>{job.description}</td>
                      <td>
                        <button
                          className="btn-approve"
                          onClick={() => handleEditJob(job)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteJob(job._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {selectedJob && (
            <div>
              <h3>Applicants for Job ID: {selectedJob}</h3>
              {/* Applicants list here */}
            </div>
          )}
        </main>
      </section>
    </div>
  );
};

export default CompanyDashboard;
