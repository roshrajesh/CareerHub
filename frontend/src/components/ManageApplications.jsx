import React, { useEffect, useState } from "react";
import axios from "axios";
import "./manageApplications.css"; // Your modern CSS

function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Fetch applications and jobs on component mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/applications");
        setApplications(response.data.applications || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching applications:", error);
        alert("Failed to fetch applications. Please try again later.");
        setIsLoading(false);
      }
    };

    const fetchJobs = async () => {
      try {
        const response = await axios.get("/api/jobs");
        setJobs(response.data.jobs || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        alert("Failed to fetch jobs. Please try again later.");
      }
    };

    fetchApplications();
    fetchJobs();
  }, []);

  // Search handler
  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Job filter change handler
  const handleJobChange = (e) => {
    setSelectedJob(e.target.value);
  };

  // Status filter change handler
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  // Handle application status update (approve/reject)
  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await axios.put(`/api/applications/${applicationId}`, { status });
      setApplications(
        applications.map((app) =>
          app._id === applicationId ? { ...app, status } : app
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  // Filter applications based on search query, job selection, and status
  const filteredApplications = applications
    .filter((app) => {
      const fullName = app.fullName.toLowerCase();
      const email = app.email.toLowerCase();
      const search = searchQuery.trim();
      return (
        (fullName.includes(search) || email.includes(search)) &&
        (selectedJob ? app.jobId === selectedJob : true) &&
        (selectedStatus ? app.status === selectedStatus : true)
      );
    });

  return (
    <div className="manage-applications-container">
      <header>
        <h1>Manage Applications</h1>
      </header>

      {/* Search & Filters Section */}
      <div className="filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Name or Email"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="filter-selects">
          <select onChange={handleJobChange} value={selectedJob}>
            <option value="">Select Job</option>
            {jobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title}
              </option>
            ))}
          </select>

          <select onChange={handleStatusChange} value={selectedStatus}>
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="applications-table">
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : filteredApplications.length === 0 ? (
          <div className="no-results">No applications found.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Job Title</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((application) => (
                <tr key={application._id}>
                  <td>{application.fullName}</td>
                  <td>{application.jobTitle}</td>
                  <td className={`status ${application.status.toLowerCase()}`}>
                    {application.status}
                  </td>
                  <td>
                    <button
                      className="status-btn"
                      onClick={() =>
                        handleStatusUpdate(application._id, "Accepted")
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="status-btn"
                      onClick={() =>
                        handleStatusUpdate(application._id, "Rejected")
                      }
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ManageApplications;
