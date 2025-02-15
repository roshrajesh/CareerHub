// React - Example of adding job and applying as student

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

const StatsPage = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalApplications: 0,
    jobs: [],
  });

  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Add job to the backend
  const handleJobAdded = async (newJob) => {
    try {
      const response = await axios.post('http://localhost:5000/api/add-job', newJob);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error adding job:", error);
    }
  };

  // Apply as student
  const handleStudentApplied = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/apply-student');
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error applying student:", error);
    }
  };

  return (
    <div className="stats-page-wrapper">
      <div className="stats-page-container">
        <h2>User & Company Stats</h2>

        <div className="stats-summary">
          <div>
            <span>{stats.totalStudents}</span>
            <p>Total Students</p>
          </div>
          <div>
            <span>{stats.totalCompanies}</span>
            <p>Total Companies</p>
          </div>
          <div>
            <span>{stats.totalApplications}</span>
            <p>Total Applications</p>
          </div>
        </div>

        {Array.isArray(stats.jobs) && stats.jobs.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {stats.jobs.map((job, index) => (
                <tr key={index}>
                  <td>{job.title}</td>
                  <td>{job.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No jobs available</p>
        )}

        <div>
          <button onClick={() => handleJobAdded({ title: "New Job", description: "Job description here" })}>
            Add Job
          </button>
          <button onClick={handleStudentApplied}>Apply as Student</button>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
