import axios from "axios";

const apiEndpoint = "http://localhost:5000/api/auth/login";

/**
 * Handles user login by sending email, password, and role to the backend.
 * @param {Object} data - User credentials (email, password, role).
 * @returns {Promise} - Resolves with server response or rejects with an error.
 */
export const login = async (data) => {
  return await axios.post(apiEndpoint, data);
};
