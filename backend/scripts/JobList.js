import React, { useState, useEffect } from "react";
import axios from "axios";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/jobs");
        setJobs(response.data);
      } catch (err) {
        console.error(err);
        setError("Error fetching jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h3>Available Jobs</h3>
      <ul>
        {jobs.map((job) => (
          <li key={job._id}>
            <h4>{job.jobTitle}</h4>
            <p>{job.companyName}</p>
            <p>{job.location}</p>
            <p>{job.jobDescription}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobList;
