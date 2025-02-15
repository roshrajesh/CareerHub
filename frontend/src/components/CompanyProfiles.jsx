import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./companyProfile.css";

// Set base URL for Axios
axios.defaults.baseURL = "http://localhost:5001"; // Ensure backend CORS is configured properly

const CompanyProfiles = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [communicationData, setCommunicationData] = useState({
    message: "",
    aptitudeLink: "",
    interviewLink: "",
  });

  // Fetch jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/api/jobs"); // Adjust this endpoint if necessary
        setJobs(response.data.jobs || []);
      } catch (error) {
        console.error("Error fetching jobs:", error.response || error.message);
        alert("Failed to fetch jobs. Please try again later.");
      }
    };

    fetchJobs();
  }, []);

  // Fetch applicants for a specific job
  const fetchApplicants = async (jobId) => {
    try {
      const response = await axios.get(`/api/applications/${jobId}`); // Ensure this endpoint matches your backend
      setApplications(response.data.applications || []);
      setSelectedJob(jobId);
    } catch (error) {
      console.error("Error fetching applicants:", error.response || error.message);
      alert("No applicants.");
    }
  };

  // Approve an application
  const handleApproveApplication = async () => {
    const { message, aptitudeLink, interviewLink } = communicationData;

    // Validation: Ensure all required fields are filled
    if (!message || !aptitudeLink || !interviewLink) {
      alert("Please fill all communication details before submitting.");
      return;
    }

    try {
      const response = await axios.patch(
        `/api/applications/approve/${selectedApplicationId}`,
        {
          message,
          aptitudeLink,
          interviewLink,
        }
      );

      alert("Application approved and communication sent!");
      setApplications(
        applications.filter((app) => app._id !== selectedApplicationId)
      );
      setShowModal(false);
      setCommunicationData({ message: "", aptitudeLink: "", interviewLink: "" });

      console.log(response.data.application); // Optional: log approved application
    } catch (error) {
      console.error("Error approving application:", error.response || error.message);
      alert("Failed to approve application. Please try again.");
    }
  };

  // Reject an application
  const handleRejectApplication = async (applicationId) => {
    if (!applicationId) {
      alert("Application ID not found.");
      return;
    }
  
    try {
      const response = await axios.patch(`/api/applications/reject/${applicationId}`);
  
      if (response.status === 200 || response.status === 204) {
        alert("Application rejected!");
  
        // Update state using the latest applications list
        setApplications((prevApplications) =>
          prevApplications.filter((app) => app._id !== applicationId)
        );
      } else {
        alert("Failed to reject application. Please try again.");
      }
    } catch (error) {
      console.error("Error rejecting application:", error.response || error.message);
      alert("Failed to reject application. Please try again.");
    }
  };
  

  // Open modal for approving an application
  const openModal = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setCommunicationData({ message: "", aptitudeLink: "", interviewLink: "" });
  };

  // Filter jobs based on search term
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="company-profile">
      <aside className="sidebar">
        <h2>Navigation</h2>
        <ul>
          <li>
            <Link to="/compny">Back to Dashboard</Link>
          </li>
        </ul>
      </aside>

      <main className="profile-main">
        <header className="profile-header">
          <h1>Company Profile</h1>
          <input
            type="text"
            placeholder="Search Jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
        </header>

        {/* Job Listing Section */}
        <div className="job-listing">
          <h2>Job Openings</h2>
          {filteredJobs.length === 0 ? (
            <p>No jobs found.</p>
          ) : (
            <div className="jobs-grid">
              {filteredJobs.map((job) => (
                <div key={job._id} className="job-card">
                  <h3>{job.title}</h3>
                  <p>{job.description}</p>
                  <div className="job-actions">
                    <button onClick={() => fetchApplicants(job._id)}>
                      View Applicants
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Applicants Section */}
        {selectedJob && (
          <div className="applicants-section">
            <h3>Applicants for Job ID: {selectedJob}</h3>
            {applications.length === 0 ? (
              <p>No applicants found.</p>
            ) : (
              <ul className="applicants-list">
                {applications.map((application) => (
                  <li key={application._id} className="applicant-card">
                    <h4>{application.fullName}</h4>
                    <p>Email: {application.email}</p>
                    <p>Phone: {application.phone}</p>
                    <p>Date of Birth: {new Date(application.dob).toLocaleDateString()}</p>
                    <p>Gender: {application.gender}</p>
                    <p>Address: {application.address}</p>
                    <p>City: {application.city}</p>
                    <p>State: {application.state}</p>
                    <p>Zip Code: {application.zipCode}</p>
                    <p>Highest Qualification: {application.highestQualification}</p>
                    <p>Years of Experience: {application.yearsOfExperience}</p>
                    <p>Cover Letter: {application.coverLetter}</p>
                    <p>
                      Resume:{" "}
                      <a
                        href={`/uploads/${application.resume}`}
                        download={application.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download Resume
                      </a>
                    </p>
                    <p>
                      LinkedIn:{" "}
                      <a
                        href={application.linkedIn || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {application.linkedIn || "Not provided"}
                      </a>
                    </p>
                    <p>Skills: {application.skills || "Not provided"}</p>
                    <div className="applicant-actions">
                      <button
                        onClick={() => openModal(application._id)}
                        className="btn-approve"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectApplication(application._id)}
                        className="btn-reject"
                      >
                        Reject
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Communication Modal */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Provide Communication Details</h3>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  value={communicationData.message}
                  onChange={(e) =>
                    setCommunicationData({
                      ...communicationData,
                      message: e.target.value,
                    })
                  }
                ></textarea>
              </div>
              <div className="form-group">
                <label>Aptitude Test Link</label>
                <input
                  type="url"
                  value={communicationData.aptitudeLink}
                  onChange={(e) =>
                    setCommunicationData({
                      ...communicationData,
                      aptitudeLink: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Interview Link</label>
                <input
                  type="url"
                  value={communicationData.interviewLink}
                  onChange={(e) =>
                    setCommunicationData({
                      ...communicationData,
                      interviewLink: e.target.value,
                    })
                  }
                />
              </div>
              <div className="modal-actions">
                <button onClick={handleApproveApplication}>Submit</button>
                <button onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CompanyProfiles;
