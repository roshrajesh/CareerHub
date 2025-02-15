import React, { useState, useEffect } from "react";
import axios from "axios";

const ApprovedApplications = () => {
  const [approvedApplications, setApprovedApplications] = useState([]);

  // Fetch approved applications from the database
  useEffect(() => {
    const fetchApprovedApplications = async () => {
      try {
        const response = await axios.get("/api/applications/approved"); // API endpoint for approved applications
        setApprovedApplications(response.data.applications || []);
      } catch (error) {
        console.error("Error fetching approved applications:", error.response || error.message);
        alert("Failed to fetch approved applications. Please try again later.");
      }
    };

    fetchApprovedApplications();
  }, []);

  return (
    <div className="approved-applications">
      <header className="header">
        <h1>Approved Applications</h1>
      </header>

      <main className="main-content">
        {approvedApplications.length === 0 ? (
          <p>No approved applications found.</p>
        ) : (
          <div className="approved-applications-list">
            {approvedApplications.map((application) => (
              <div key={application._id} className="application-card">
                <h3>{application.fullName}</h3>
                <p>Email: {application.email}</p>
                <p>Phone: {application.phone}</p>
                <p>Gender: {application.gender}</p>
                <p>Qualification: {application.highestQualification}</p>
                <p>Experience: {application.yearsOfExperience}</p>
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
                <p>Message: {application.message}</p>
                <p>Aptitude Test: {application.aptitudeLink}</p>
                <p>Interview Link: {application.interviewLink}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ApprovedApplications;
