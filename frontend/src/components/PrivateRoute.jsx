import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, roles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || {}; // Default to an empty object if null

  // Check if token exists
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Check if roles are provided and user's role matches
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default PrivateRoute;
