import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const JobListings = () => {
  const [jobs, setJobs] = useState([]); // ✅ Initialize as an array
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const navigate = useNavigate();

  // Fetch available jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5001/api/jobs");
        const jobData = response.data.jobs || [];
        setJobs(jobData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        alert("Failed to fetch jobs. Please try again later.");
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApplyNow = (job) => {
    setSelectedJob(job);
    setShowApplyForm(true);
  };

  return (
    <>
      {/* Job Listings */}
      <div className="table-data">
        <div className="order">
          <div className="head">
            <h3>Available Jobs</h3>
          </div>
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

      {/* Registration Form */}
      {showApplyForm && selectedJob && (
        <div className="apply-form-container">
          <h2>Apply for {selectedJob.title}</h2>
          <ApplyForm selectedJob={selectedJob} setShowApplyForm={setShowApplyForm} />
        </div>
      )}
    </>
  );
};

const ApplyForm = ({ selectedJob, setShowApplyForm }) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    formDataToSend.append("jobId", selectedJob._id);

    try {
      const response = await axios.post("http://localhost:5001/api/applications", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        alert("Application submitted successfully!");
        setShowApplyForm(false);
      } else {
        alert("Failed to submit application. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="registration-form">
      {/* Form Fields */}
      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          required
        >
          <option value="" disabled>Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="form-group">
        <label>Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>City</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>State</label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Zip Code</label>
        <input
          type="text"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Highest Qualification</label>
        <input
          type="text"
          name="highestQualification"
          value={formData.highestQualification}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Years of Experience</label>
        <input
          type="text"
          name="yearsOfExperience"
          value={formData.yearsOfExperience}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Resume</label>
        <input
          type="file"
          name="resume"
          onChange={handleFileChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Cover Letter</label>
        <textarea
          name="coverLetter"
          value={formData.coverLetter}
          onChange={handleInputChange}
        ></textarea>
      </div>
      <div className="form-group">
        <label>LinkedIn Profile</label>
        <input
          type="url"
          name="linkedIn"
          value={formData.linkedIn}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Skills</label>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleInputChange}
        />
      </div>

      <button type="submit" className="btn-submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </button>
      <button
        type="button"
        className="btn-cancel"
        onClick={() => setShowApplyForm(false)}
      >
        Cancel
      </button>
    </form>
  );
};

export default JobListings;
