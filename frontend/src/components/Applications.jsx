import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Applications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Make sure to use the correct URL for your backend API
    axios.get('/api/applications')
      .then(response => {
        setApplications(response.data); // Set applications state with the fetched data
      })
      .catch(error => {
        console.error('Error fetching applications:', error);
      });
  }, []); // Empty dependency array to only run on mount

  return (
    <div className="applications-container">
      <h2>Job Applications</h2>
      {applications.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Job Title</th>
              <th>Company</th>
              <th>Email</th>
              <th>Approval Status</th>
              <th>Links</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(application => (
              <tr key={application._id}>
                <td>{application.fullName}</td>
                <td>{application.jobId?.title}</td>
                <td>{application.jobId?.companyName}</td>
                <td>{application.email}</td>
                <td>{application.isApproved ? 'Approved' : 'Pending'}</td>
                <td>
                  {application.aptitudeLink && (
                    <a href={application.aptitudeLink} target="_blank" rel="noopener noreferrer">
                      Aptitude Test
                    </a>
                  )}
                  <br />
                  {application.interviewLink && (
                    <a href={application.interviewLink} target="_blank" rel="noopener noreferrer">
                      Interview Link
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No applications found.</p>
      )}
    </div>
  );
};

export default Applications;
