import React, { useEffect, useState } from "react";
import axios from "axios";

function Report() {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get("/api/analytics");
        setAnalyticsData(response.data);
      } catch (error) {
        console.error("Error fetching analytics:", error.message);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="analytics">
      <h1>Analytics</h1>
      {/* Display analytics charts or tables */}
      {analyticsData ? (
        <div>
          <p>Applications per company: {analyticsData.applicationsPerCompany}</p>
          <p>Jobs posted: {analyticsData.jobPosts}</p>
          {/* Add more analytics data visualization */}
        </div>
      ) : (
        <p>Loading analytics...</p>
      )}
    </div>
  );
}

export default Report;
