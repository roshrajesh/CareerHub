import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CareerHub.css";

const CareerHub = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/applications"); // Replace with your backend API
        setApplications(response.data.applications || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching applications:", error);
        alert("Failed to fetch applications. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const recruitmentSteps = [
    { key: "applied", label: "Application Submitted" },
    { key: "selected", label: "Shortlisted" },
    { key: "aptitude_passed", label: "Aptitude Test Passed" },
    { key: "interview_scheduled", label: "Interview Scheduled" },
    { key: "offer_received", label: "Offer Received" },
  ];

  return (
    <div className="careerhub-container">
      <aside className="sidebar">
        <h2>CareerHub</h2>
        <h3>Applications Overview</h3>
        <ul>
          {isLoading ? (
            <li>Loading...</li>
          ) : applications.length === 0 ? (
            <li>No applications found</li>
          ) : (
            applications.map((app) => (
              <li
                key={app._id}
                className={selectedApplication?._id === app._id ? "active" : ""}
                onClick={() => setSelectedApplication(app)}
              >
                {app.jobTitle} - {app.companyName}
              </li>
            ))
          )}
        </ul>
      </aside>

      <main className="main-content">
       

        {selectedApplication ? (
          <div className="application-details">
            <h2>{selectedApplication.jobTitle}</h2>
            <p>Company: {selectedApplication.companyName}</p>
            <p>Status: {selectedApplication.status}</p>

            <div className="recruitment-timeline">
              {recruitmentSteps.map((step, index) => (
                <div
                  key={step.key}
                  className={`timeline-step ${
                    recruitmentSteps.findIndex(
                      (s) => s.key === selectedApplication.status
                    ) >= index
                      ? "active"
                      : ""
                  }`}
                >
                  <div className="step-circle"></div>
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>Select an application to view details.</p>
        )}
      </main>
    </div>
  );
};

export default CareerHub;
