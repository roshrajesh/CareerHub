import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";
import "boxicons/css/boxicons.min.css";
import avatar from "./avatar.png"
axios.defaults.baseURL = "http://localhost:5001"; // Backend URL

const StudentDashboard = () => {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [availableJobs, setAvailableJobs] = useState(0);
  const [applicationsSubmitted, setApplicationsSubmitted] = useState(0);
  const [applicationsApproved, setApplicationsApproved] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    highestQualification: "",
    yearsOfExperience: "",
    resume: null,
    coverLetter: "",
    linkedIn: "",
    skills: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const userResponse = await axios.get("/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const applicationsResponse = await axios.get(
          `/api/applications?userID=${userResponse.data.userID}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(userResponse.data);
        setApplications(applicationsResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 403) {
          setError("You are not authorized to view this page.");
        } else {
          setError("An error occurred. Please try again.");
        }
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/jobs");
        setJobs(response.data.jobs || []);
        setAvailableJobs(response.data.jobs?.length || 0);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApplyNow = (job) => {
    setSelectedJob(job);
    setShowApplyForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    formDataToSend.append("jobId", selectedJob._id);

    try {
      const response = await axios.post("/api/applications", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        alert("Application submitted successfully!");
        setApplicationsSubmitted((prev) => prev + 1);
        setShowApplyForm(false);
      } else {
        alert("Failed to submit application.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {user && (
        <div className="profile-section bg-white shadow-md rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <img
              src={avatar}
              alt="Avatar"
              className="avatar"
            />
            <div>
              <h1 className="text-2xl font-bold">Welcome, {user.firstname}!</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      <section id="sidebar">
        <a href="#" className="brand">
          <i className="bx bxs-school"></i>
          <span className="text">CareerHub</span>
        </a>
        <ul className="side-menu">
          <li>
            <Link to="#" onClick={() => setShowApplyForm(false)}>
              <i className="bx bxs-dashboard"></i>
              <span className="text">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/job">
              <i className="bx bxs-notepad"></i>
              <span className="text">Job Status</span>
            </Link>
          </li>
          <li>
            <Link to="/profile">
              <i className="bx bxs-user"></i>
              <span className="text">Profile</span>
            </Link>
          </li>
         
        </ul>
        <ul className="side-menu">
          <li>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Logout
            </button>
          </li>
        </ul>
      </section>

      <section id="content">
        <main>
          <h1>Student Dashboard</h1>

          <ul className="box-info">
            <li>
              <i className="bx bxs-briefcase"></i>
              <span className="text">
                <h3>{availableJobs}</h3>
                <p>Available Jobs</p>
              </span>
            </li>
            <li>
              <i className="bx bxs-file-plus"></i>
              <span className="text">
                <h3>{applicationsSubmitted}</h3>
                <p>Applications Submitted</p>
              </span>
            </li>
            <li>
              <i className="bx bxs-check-circle"></i>
              <span className="text">
                <h3>{applicationsApproved}</h3>
                <p>Applications Approved</p>
              </span>
            </li>
          </ul>

          <div className="table-data">
            <div className="order">
              <h3>Available Jobs</h3>
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Description</th>
                    <th>Action</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="4">Loading jobs...</td>
                    </tr>
                  ) : jobs.length === 0 ? (
                    <tr>
                      <td colSpan="4">No jobs available</td>
                    </tr>
                  ) : (
                    jobs.map((job) => (
                      <tr key={job._id}>
                        <td>{job.title}</td>
                        <td>{job.description || "No description available"}</td>
                        <td>
                          <button onClick={() => handleApplyNow(job)} className="btn-apply">
                            Apply Now
                          </button>
                        </td>
                        <td>{job.status || "Open"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {showApplyForm && selectedJob && (
            <div className="apply-form-container">
              <h2>Apply for {selectedJob.title}</h2>
              <form onSubmit={handleSubmit} className="registration-form">
                
                
                {Object.keys(formData).map(
                  (key) =>
                    key !== "resume" && (
                      <div className="form-group" key={key}>
                        <label>{key}</label>
                        <input
                          type={key === "dob" ? "date" : "text"}
                          name={key}
                          value={formData[key]}
                          onChange={handleInputChange}
                          
                        />
                      </div>
                      
                    )
                    
                )}
                
                <div className="form-group">
                  <label>Resume</label>
                  <input type="file" name="resume" onChange={handleFileChange} />
                </div>

                <button type="submit" className="btn-submit">Submit Application</button>
                <button type="button" className="btn-cancel" onClick={() => setShowApplyForm(false)}>
                  Cancel
                </button>
              </form>
            </div>
          )}
        </main>
      </section>
    </>
  );
};

export default StudentDashboard;
