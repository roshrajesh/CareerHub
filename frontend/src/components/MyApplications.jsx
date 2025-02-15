import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyApplications.css"; // Style file for layout and design

axios.defaults.baseURL = "http://localhost:5001"; // Ensure backend CORS is configured properly

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  // Fetch applications for the logged-in student
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get("/api/student/applications");
        setApplications(response.data.applications || []);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setError("Failed to fetch applications. Please try again later.");
      }
    };
    fetchApplications();
  }, []);

  // Fetch students data for admin
  const fetchStudents = async () => {
    try {
      const response = await axios.get("/admin/students");
      setStudents(response.data.students);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to fetch student data. Please try again later.");
    }
  };

  useEffect(() => {
    // Admin fetches students data only once
    fetchStudents();
  }, []);

  return (
    <div className="my-applications">
      <header className="applications-header">
        <h1>My Applications</h1>
      </header>

      {/* Error message */}
      {error && <div className="error-message">{error}</div>}

      {/* Applications Listing */}
      <div className="applications-list">
        {applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <div className="applications-grid">
            {applications.map((application) => (
              <div key={application._id} className="application-card">
                <h3>{application.jobTitle}</h3>
                <p>Company: {application.company}</p>
                <p>Status: {application.isApproved ? "Approved" : "Pending"}</p>
                {application.isApproved && (
                  <>
                    <p>Message: {application.message}</p>
                    <p>
                      Aptitude Test:{" "}
                      <a
                        href={application.aptitudeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Take the Test
                      </a>
                    </p>
                    <p>
                      Interview Link:{" "}
                      <a
                        href={application.interviewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Join the Interview
                      </a>
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin view of students */}
      <div className="admin-view">
        <h2>Students Overview</h2>
        {students.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <div className="students-grid">
            {students.map((student) => (
              <div key={student._id} className="student-card">
                <h3>{student.firstname} {student.lastname}</h3>
                <p>Email: {student.email}</p>
                <p>Role: {student.role}</p>
                <div>
                  <h4>Applications</h4>
                  {student.applications.length === 0 ? (
                    <p>No applications yet.</p>
                  ) : (
                    student.applications.map((application) => (
                      <div key={application._id}>
                        <p>{application.jobTitle} - {application.status}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
