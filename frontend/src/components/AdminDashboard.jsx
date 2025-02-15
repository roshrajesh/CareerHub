import React, { useState, useEffect } from "react";
import axios from "axios";
import "./stylee.css";


axios.defaults.baseURL = "http://localhost:5001"; // Backend URL

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching from: ", axios.defaults.baseURL + "/api/applications"); // Log the URL
        const response = await axios.get("/api/applications");
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

  const handleApproveApplication = async (applicationId) => {
    try {
      const response = await axios.put(`/api/applications/approve/${applicationId}`);
      if (response.status === 200) {
        alert("Application approved successfully!");
        setApplications(
          applications.map((app) =>
            app._id === applicationId ? { ...app, isApproved: true } : app
          )
        );
      }
    } catch (error) {
      console.error("Error approving application:", error);
      alert("Failed to approve application. Please try again.");
    }
  };

  const handleRejectApplication = async (applicationId) => {
    try {
      const response = await axios.put(`/api/applications/reject/${applicationId}`);
      if (response.status === 200) {
        alert("Application rejected successfully!");
        setApplications(
          applications.filter((app) => app._id !== applicationId)
        );
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      alert("Failed to reject application. Please try again.");
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div id="admin-dashboard">
      <section id="sidebar">
        <a href="#" className="brand">
          <i className="bx bxs-briefcase"></i>
          <span className="text">CareerHub</span>
        </a>
        <ul className="side-menu">
          <li>
            <a href="/admin" className="active">
              <i className="bx bxs-dashboard"></i>
              <span className="text">Dashboard</span>
            </a>
          </li>

          <li>
            <a href="/job-management">
              <i className="bx bxs-briefcase-alt"></i>
              <span className="text">Job Management</span>
            </a>
          </li>
          <li>
            <a href="/manageuser">
              <i className="bx bxs-briefcase-alt"></i>
              <span className="text">Users List</span>
            </a>
          </li>
          <li>
            <a href="/analytics">
              <i className="bx bxs-briefcase-alt"></i>
              <span className="text">Analytics</span>
            </a>
          </li>
          <li>
  <a href="/adminchat">
    <i className="bx bxs-message-dots"></i>
    <span className="text">Messages</span>
  </a>
</li>

          <li>
            <a href="/">
              <i className="bx bxs-log-out-circle"></i>
              <span className="text">Logout</span>
            </a>
          </li>

        </ul>
      </section>

      <section id="content">
        <main>
          <div className="head-title">
            <h1>Admin Dashboard</h1>
          </div>

          <div className="table-data">
            <h2>Applications</h2>
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
          </div>
        </main>
      </section>
    </div>
  );
};

export default AdminDashboard;
