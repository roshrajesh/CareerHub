import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [student, setStudent] = useState(null);
  const [jobListings, setJobListings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch student profile and job listings when component mounts
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentResponse = await axios.get('/api/student/profile');
        setStudent(studentResponse.data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    const fetchJobListings = async () => {
      try {
        const jobsResponse = await axios.get('/api/jobs');
        setJobListings(jobsResponse.data);
      } catch (error) {
        console.error('Error fetching job listings:', error);
      }
    };

    const fetchApplications = async () => {
      try {
        if (student) {
          const applicationsResponse = await axios.get(`/api/applications/${student._id}`);
          setApplications(applicationsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchStudentData();
    fetchJobListings();
  }, [student]);

  // Handle job application submission
  const handleJobApply = async (jobId) => {
    try {
      const response = await axios.post('/api/applications', {
        studentId: student._id,
        jobId,
      });
      setApplications([...applications, response.data]);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for job:', error);
    }
  };

  if (loading || !student) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Welcome, {student.fullName}</h1>

      {/* Job Listings */}
      <section>
        <h2>Job Listings</h2>
        <div className="job-listings">
          {jobListings.map((job) => (
            <div key={job._id} className="job-item">
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <button onClick={() => handleJobApply(job._id)}>Apply</button>
            </div>
          ))}
        </div>
      </section>

      {/* My Applications */}
      <section>
        <h2>My Applications</h2>
        <table>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app.job.title}</td>
                <td>{app.status}</td>
                <td>
                  {app.status === 'Interview Scheduled' && (
                    <button
                      onClick={() => alert(`Interview Date: ${app.interviewDate}`)}
                    >
                      View Interview Date
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Update Profile */}
      <section>
        <h2>Update Profile</h2>
        <form onSubmit={handleProfileUpdate}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={student.email}
              onChange={(e) => setStudent({ ...student, email: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="skills">Skills</label>
            <input
              type="text"
              id="skills"
              value={student.skills}
              onChange={(e) => setStudent({ ...student, skills: e.target.value })}
            />
          </div>
          <button type="submit">Save</button>
        </form>
      </section>
    </div>
  );
};

export default Dashboard;
