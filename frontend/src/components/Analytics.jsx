import React, { useEffect, useState } from 'react';

const Analytics = () => {
  const [data, setData] = useState([]); // Ensure initial state is an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/analytics") // Adjust API URL as needed
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch analytics data");
        }
        return res.json();
      })
      .then((responseData) => {
        setData(responseData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Analytics Data</h2>
      {data.length === 0 ? (
        <p>No data available</p>
      ) : (
        data.map((item) => (
          <div key={item.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "5px" }}>
            <h3>{item.name}</h3>
            <p>Applications: {item.applications}</p>
            <p>Approved: {item.approved}</p>
            <p>Rejected: {item.rejected}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Analytics;
