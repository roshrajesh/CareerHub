import axios from "axios";

const API_URL = "http://localhost:5000/api/jobs"; // Replace with your actual backend URL

export const fetchJobs = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};
