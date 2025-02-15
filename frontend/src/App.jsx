import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import JobStatusPage from "./components/JobStatusPage";
import Login from "./components/Login";
import StatsPage from "./components/StatsPage";
import AnalyticsPage from "./components/AnalyticsPage";
import AddStudentForm from "./components/AddStudentForm";
import ManageApplications from "./components/ManageApplications";
import Applications from "./components/Applications";

import Report from "./components/Report";
import Notifications from "./components/Notifications";
import JobManagement from "./components/JobManagement";
import CompanyProfiles from "./components/CompanyProfiles";
import Projects from "./components/Projects";
import CareerHub from "./components/CareerHub";
import Contact from "./components/Contact";
import CompanyDashboard from "./components/CompanyDashboard";
import ChatPage from "./components/ChatPage";
import AdminDashboard from "./components/AdminDashboard";
import AdminMessages from "./components/AdminMessages";


import ProfilePage from "./components/ProfilePage";
import About from "./components/About";
import Home from "./components/Home";
import Register from "./components/Register";
import StudentDashboard from "./components/StudentDashboard"
import StudentForm from "./components/StudentForm";
import ApprovedApplications from "./components/ApprovedApplications";


import StudentDashboardPage from "./components/pages/StudentDashboardPage";
import Analytics from "./components/Analytics";
import AdminChatPage from "./components/AdminChatPage";
import AdminManageUsers from "./components/AdminManageUsers";
import AdminChat from "./components/Adminchat";
import ForgotPassword from "./components/ForgotPassword";

const handleLogin = async (email, password) => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);

      if (data.role === 'Student') {
        navigate('/student-dashboard');
      } else if (data.role === 'Company') {
        navigate('/company-dashboard');
      } else if (data.role === 'Admin') {
        navigate('/admin-dashboard');
      }
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred");
  }
};

function App() {
  const user = localStorage.getItem("token");

  return (
    
      <Routes>
        {/* <Route path="/" element={user ? <Main/> : <Navigate to="/login" />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About/>} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/student" element={<StudentDashboard/>} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/job" element={<JobStatusPage />} />
        <Route path="/compny" element={<CompanyDashboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/careerhub" element={<CareerHub />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/company-profile" element={<CompanyProfiles />} />
        <Route path="/job-management" element={<JobManagement />} />
        <Route path="/report" element={<Report />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/admimsg" element={<AdminMessages />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/manage-applications" element={<ManageApplications />} />
        <Route path="/add-student-form" element={<AddStudentForm />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/statistics" element={<StatsPage />} />
        <Route path="/pro" element={<Projects/>} />
        <Route path="/student/:id" element={<StudentDashboard />} /> 
        <Route path="/form" element={<StudentForm/>} />
        <Route path="/approved" element={<ApprovedApplications/>}/>
        <Route path="/jobstatus/:id" element={<JobStatusPage />} />
        <Route path="/anal" element={<Analytics />} />
  <Route path="/adminchat" element={<AdminChat/>}/>
      <Route path="/adminchat" element={<AdminChatPage/>} /> 
        <Route path="/dashboard" element={<StudentDashboardPage/>}/>
        <Route path="/manageuser" element={<AdminManageUsers/>}/>

        <Route path="/forgot" element={<ForgotPassword/>}/>

      </Routes>
  
  );
}

export default App;
