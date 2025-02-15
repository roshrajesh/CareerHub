import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import { AppBar, Toolbar, Typography, Button, Snackbar, Alert } from "@mui/material";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  // Handle form input change
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  // Handle Sign-In click
  const handleSignInClick = async (event) => {
    event.preventDefault(); // Prevent form submission
    
    try {
      const url = "http://localhost:5001/api/login"; // Ensure this matches your backend route
      const { data: res } = await axios.post(url, data);

      // Save the JWT token to localStorage
      localStorage.setItem("token", res.token);

      // Display success message
      setSnackbarMessage("Login successful!");
      setSuccess(true);

      // Store the role of the user for further navigation
      const userRole = res.user.role; // Assuming `role` is part of the response

      // Navigate based on the user's role fetched from the response
      if (userRole === "Student") {
        navigate("/student"); // Navigate to Student Dashboard
      } else if (userRole === "Company") {
        navigate("/compny"); // Navigate to Company Dashboard
      } else if (userRole === "Admin") {
        navigate("/admin"); // Navigate to Admin Dashboard
      } else {
        setErrorSnackbar("Access denied for this role.");
      }
    } catch (error) {
      console.error("Login error:", error.response || error);

      // Improved error handling for 404 errors
      if (error.response && error.response.status === 404) {
        setErrorSnackbar("Backend route not found. Please check the server.");
      } else if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setErrorSnackbar(error.response.data.message); // Display the error message from the backend
      } else {
        setErrorSnackbar("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="static" style={{ background: "#1a1a2e" }}>
        <Toolbar>
          <Typography
            variant="h6"
            style={{
              flexGrow: 1,
              fontFamily: "'Roboto', sans-serif",
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            CareerHub
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
          <Button color="inherit" component={Link} to="/contact">
            Contact
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        </Toolbar>
      </AppBar>

      <div className={styles.login_container}>
        <div className={styles.login_form_container}>
          <div className={styles.left}>
            <form className={styles.form_container} onSubmit={handleSignInClick}>
              <h1>Login to Your CareerHub</h1>
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
              {error && <div className={styles.error_msg}>{error}</div>}
              <button type="submit" className={styles.green_btn}>
                Sign In
              </button>
              <div className={styles.forgot_password}>
                <Link to="/forgot" className={styles.link}>
                  Forgot Password?
                </Link>
              </div>
            </form>
          </div>
          <div className={styles.right}>
            <h1>New Here?</h1>
            <Link to="/register">
              <button type="button" className={styles.white_btn}>
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={errorSnackbar !== ""}
        autoHideDuration={3000}
        onClose={() => setErrorSnackbar("")}
      >
        <Alert
          onClose={() => setErrorSnackbar("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorSnackbar}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
