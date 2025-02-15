import React from "react";
import { Link } from "react-router-dom";
import dashboardImage from "../components/student.jpg";
import companyImage from "../components/company.jpg";
import analyticsImage from "../components/report.jpg";
import "../components/Home.css";
import logo from '../components/logo.png'
const Home = () => {
  return (
    <>
     {/* Navbar */}
<div className="navbar">
  <div className="logo-container">
    <img src={logo} alt="CareerHub Logo" />
    <h1>CareerHub</h1>
  </div>
  <div className="nav-container">
  <Link to="/">Home</Link>
  <Link to="/about">About</Link>
  <Link to="/contact">Contact</Link>
  <Link to="/login">Login</Link>
</div>

</div>


      {/* Hero Section */}
      <div className="hero">
        <h1>Welcome to CareerHub</h1>
        <p>Your one-stop solution for placement management and career guidance.</p>
        <button>Get Started</button>
      </div>

      {/* Features Section */}
      <div className="features">
        <h2>Our Features</h2>
        <div className="card-container">
          <div className="card">
            <img src={dashboardImage} alt="Student Dashboard" />
            <h3>Student Dashboard</h3>
            <p>
              Track your application progress, view job opportunities, and get
              personalized recommendations.
            </p>
          </div>
          <div className="card">
            <img src={companyImage} alt="Company Management" />
            <h3>Company Management</h3>
            <p>
              Seamlessly manage company jobs, registrations, and  interviews.
            </p>
          </div>
          <div className="card">
            <img src={analyticsImage} alt="Analytics & Reports" />
            <h3>Analytics & Reports</h3>
            <p>
              Gain insights into placement statistics and improve decision-making
              with detailed reports.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <p>&copy; 2025 CareerHub. All rights reserved.</p>
      </div>
    </>
  );
};

export default Home;