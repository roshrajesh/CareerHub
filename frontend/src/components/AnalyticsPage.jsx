import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import "./analyticspage.css";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const AnalyticsPage = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appResponse = await axios.get("/api/applications");
        const jobResponse = await axios.get("/api/jobs");
        setApplications(appResponse.data.applications || []);
        setJobs(jobResponse.data.jobs || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <p className="loading-text">Loading data...</p>;
  }

  // Count application statuses
  const approvedApplications = applications.filter((app) => app.isApproved).length;
  const rejectedApplications = applications.length - approvedApplications;

  // Count job statuses
  const jobStatuses = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  // Chart Data
  const applicationChartData = {
    labels: ["Approved", "Rejected"],
    datasets: [
      {
        label: "Applications Status",
        data: [approvedApplications, rejectedApplications],
        backgroundColor: ["#4CAF50", "#FF5722"],
      },
    ],
  };

  const jobStatusChartData = {
    labels: Object.keys(jobStatuses),
    datasets: [
      {
        label: "Job Statuses",
        data: Object.values(jobStatuses),
        backgroundColor: ["#2196F3", "#FFEB3B", "#9C27B0"],
      },
    ],
  };

  return (
    <div className="analytics-page">
      {/* Back Button */}
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back
        </button>
      </div>

      {/* Page Heading */}
      <h1 className="dashboard-heading">Admin Review Dashboard</h1>

      {/* Charts Section */}
      <div className="charts-container">
        {applications.length > 0 ? (
          <div className="chart-card">
            <h2>Application Status</h2>
            <Bar data={applicationChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        ) : (
          <p className="no-data">No application data available.</p>
        )}

        {jobs.length > 0 ? (
          <div className="chart-card">
            <h2>Job Status Distribution</h2>
            <Pie data={jobStatusChartData} options={{ responsive: true }} />
          </div>
        ) : (
          <p className="no-data">No job status data available.</p>
        )}
      </div>

      {/* Applications Table */}
      <div className="applications-list">
        <h2>Applications</h2>
        {applications.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application._id}>
                  <td>{application.fullName}</td>
                  <td>{application.email}</td>
                  <td className={application.isApproved ? "approved" : "rejected"}>
                    {application.isApproved ? "Approved" : "Rejected"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">No applications found.</p>
        )}
      </div>

      {/* Job Listings */}
      <div className="job-list">
        <h2>Job Listings</h2>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div className="job-card" key={job._id}>
              <h3>{job.title}</h3>
              <p>{job.companyName}</p>
              <p>{job.location}</p>
              <span className={`status ${job.status.toLowerCase()}`}>{job.status}</span>
            </div>
          ))
        ) : (
          <p className="no-data">No jobs available.</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
