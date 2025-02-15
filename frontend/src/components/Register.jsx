import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./sign.module.css";
import { AppBar, Toolbar, Typography, Button, Snackbar, Alert } from "@mui/material";

const Register = () => {
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  // Handling form input changes
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  // Handling form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message
    setSuccessMessage(""); // Reset success message

    // Form validation for empty fields
    if (!data.firstname || !data.lastname || !data.email || !data.password || !data.role) {
      setError("All fields are required.");
      return;
    }

    try {
      const url = "http://localhost:5001/api/register";  // Adjust URL if needed
      const { data: res } = await axios.post(url, data);
      
      // Success message and redirect to login page
      setSuccessMessage(res.message || "Registration successful! Redirecting...");
      setSnackbarMessage("Registration successful! Redirecting...");
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate("/login"); // Navigate to login after success
      }, 2000);
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message || "Something went wrong");
      } else {
        setError("Unable to connect to the server");
      }
    }
  };

  return (
    <>
      <AppBar position="static" style={{ background: "#1a1a2e" }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            CareerHub
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        </Toolbar>
      </AppBar>

      <div className={styles.signup_container}>
        <div className={styles.signup_form_container}>
          <div className={styles.left}>
            <h1>Welcome Back</h1>
            <Link to="/login">
              <button type="button" className={styles.white_btn}>
                Sign in
              </button>
            </Link>
          </div>

          <div className={styles.right}>
            <form className={styles.form_container} onSubmit={handleSubmit}>
              <h1>Create Account</h1>
              
              {/* Form Fields */}
              <input
                type="text"
                placeholder="First Name"
                name="firstname"
                onChange={handleChange}
                value={data.firstname}
                required
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Last Name"
                name="lastname"
                onChange={handleChange}
                value={data.lastname}
                required
                className={styles.input}
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
                className={styles.input}
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={data.password}
                required
                className={styles.input}
              />
              
              {/* Role Selection */}
              <select
                name="role"
                onChange={handleChange}
                value={data.role}
                required
                className={styles.select}
              >
                <option value="">Select Role</option>
                <option value="Student">Student</option>
                <option value="Company">Company</option>
                {/* <option value="Admin">Admin</option> */}
              </select>

              {/* Display Error or Success Messages */}
              {error && <div className={styles.error_msg}>{error}</div>}
              {successMessage && <div className={styles.success_msg}>{successMessage}</div>}
              
              {/* Submit Button */}
              <button type="submit" className={styles.green_btn}>
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Register;
