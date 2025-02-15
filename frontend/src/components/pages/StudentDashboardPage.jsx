import React, { useState, useEffect } from "react";

const StudentDashboardPage = () => {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);

  // Assuming you have a way to get the token, e.g. from localStorage or state
  const token = localStorage.getItem("token"); // Replace with your token logic

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!token) {
        setError("No token found, please log in.");
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/dashboard', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Check if the response is okay
        if (!response.ok) {
          const responseText = await response.text();
          setError(`Error: ${response.statusText} - ${responseText}`);
          return;
        }

        const data = await response.json(); // Parse the JSON response
        setStudent(data); // Set the student data if successful
      } catch (error) {
        console.error("Error fetching student data:", error);
        setError("Something went wrong while fetching student data");
      }
    };

    fetchStudentData();
  }, [token]); // Ensure the effect re-runs when the token changes

  // Render error or loading state
  if (error) {
    return <div>{error}</div>;
  }

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Welcome, {student.firstname}!</h2>
      <p>Email: {student.email}</p>
      <p>Role: {student.role}</p>
      {/* Display other student-specific details here */}
    </div>
  );
};

export default StudentDashboardPage;
