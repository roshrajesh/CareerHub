import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom"; // Updated import
import "./JobManagement.css"; // Custom CSS for styling

function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [editJob, setEditJob] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteJobId, setDeleteJobId] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/jobs");
        setJobs(response.data.jobs || []);
        setFilteredJobs(response.data.jobs || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error.message);
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Handle search query
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query === "") {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(
        jobs.filter(
          (job) =>
            job.title.toLowerCase().includes(query.toLowerCase()) ||
            job.companyName.toLowerCase().includes(query.toLowerCase()) ||
            job.location.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  // Handle filtering by status
  const handleFilter = (status) => {
    if (status === "all") {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(jobs.filter((job) => job.status === status));
    }
  };

  // Handle inline editing of jobs
  const handleEdit = (job) => {
    setEditJob(job);
  };

  const handleSaveEdit = () => {
    const updatedJobs = jobs.map((job) =>
      job._id === editJob._id ? editJob : job
    );
    setJobs(updatedJobs);
    setFilteredJobs(updatedJobs);
    setEditJob(null);
  };

  // Delete job with confirmation modal
  const handleDelete = (jobId) => {
    setDeleteJobId(jobId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/jobs/${deleteJobId}`);
      const updatedJobs = jobs.filter((job) => job._id !== deleteJobId);
      setJobs(updatedJobs);
      setFilteredJobs(updatedJobs);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting job:", error.message);
    }
  };

  // Handle Back Navigation
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="job-management">
      <button onClick={handleBack} className="back-btn">Back</button> {/* Back button */}

      <h1 className="page-title">Job Management</h1>

      {/* Search and Filter Section
      <div className="filter-search">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
          placeholder="Search by job title, company, or location"
        />
        <div className="status-filter">
          <button onClick={() => handleFilter("all")}>All</button>
          <button onClick={() => handleFilter("active")}>Active</button>
          <button onClick={() => handleFilter("inactive")}>Inactive</button>
        </div>
      </div> */}


      {/* Loading Spinner */}
      {loading ? (
        <div className="loading">
          <i className="bx bx-loader-alt bx-spin"></i> Loading jobs...
        </div>
      ) : (
        <div className="job-list">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                className="job-card"
                key={job._id}
                onClick={() => handleEdit(job)}
              >
                <h3 className="job-title">
                  {editJob && editJob._id === job._id ? (
                    <input
                      type="text"
                      value={editJob.title}
                      onChange={(e) =>
                        setEditJob({ ...editJob, title: e.target.value })
                      }
                    />
                  ) : (
                    job.title
                  )}
                </h3>
                <p className="company-name">{job.companyName}</p>
                <p className="location">{job.location}</p>
                <span className={`status ${job.status}`}>
                  {job.status}
                </span>
                <div className="job-actions">
                  <button
                    className="edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(job);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(job._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No jobs available.</p>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editJob && (
        <div className="edit-job-modal">
          <div className="modal-content">
            <h2>Edit Job</h2>
            <input
              type="text"
              value={editJob.title}
              onChange={(e) =>
                setEditJob({ ...editJob, title: e.target.value })
              }
              placeholder="Job Title"
            />
            <textarea
              value={editJob.description}
              onChange={(e) =>
                setEditJob({ ...editJob, description: e.target.value })
              }
              placeholder="Job Description"
            ></textarea>
            <button onClick={handleSaveEdit}>Save Changes</button>
            <button onClick={() => setEditJob(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
        className="delete-modal"
      >
        <h2>Are you sure you want to delete this job?</h2>
        <div className="modal-actions">
          <button onClick={confirmDelete} className="confirm-btn">
            Yes, Delete
          </button>
          <button
            onClick={() => setShowDeleteModal(false)}
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default JobManagement;
