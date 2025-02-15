import React, { useState } from 'react';
import axios from 'axios';

const AddStudentForm = ({ onStudentAdded }) => {
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentCourse, setStudentCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!studentName || !studentEmail || !studentCourse) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');  // Clear any previous errors

    try {
      const response = await axios.post('http://localhost:5001/api/students', {
        name: studentName,
        email: studentEmail,
        course: studentCourse,
      });

      if (response.status === 201) {
        alert('Student added successfully!');
        setStudentName('');
        setStudentEmail('');
        setStudentCourse('');
        onStudentAdded(); // Trigger the parent component to update its state
      } else {
        throw new Error('Failed to add student');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      setError('Failed to add student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-student-form">
      <h2>Add New Student</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Course:</label>
          <input
            type="text"
            value={studentCourse}
            onChange={(e) => setStudentCourse(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Student'}
        </button>
      </form>
    </div>
  );
};

export default AddStudentForm;
