// src/components/ApplyForm.jsx
import React, { useState } from 'react';
import axios from '../api/axios';

const Form = () => {
  const [formData, setFormData] = useState({
    jobId: '',
    resume: null,
    coverLetter: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      resume: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('jobId', formData.jobId);
    formDataToSubmit.append('resume', formData.resume);
    formDataToSubmit.append('coverLetter', formData.coverLetter);

    try {
      const response = await axios.post('/apply', formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Application submitted', response.data);
    } catch (error) {
      console.error('Error submitting application', error);
    }
  };

  return (
    <div className="apply-form">
      <h2>Apply for Job</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="jobId">Job ID:</label>
          <input
            type="text"
            id="jobId"
            name="jobId"
            value={formData.jobId}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="resume">Resume:</label>
          <input
            type="file"
            id="resume"
            name="resume"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label htmlFor="coverLetter">Cover Letter:</label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
};

export default Form;
