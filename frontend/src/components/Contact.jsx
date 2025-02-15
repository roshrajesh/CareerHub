import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import styles from "./contact.module.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const [adminResponses, setAdminResponses] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [messageId, setMessageId] = useState(null); // Store message ID to fetch responses
  const [isLoading, setIsLoading] = useState(false);

  // Fetch admin responses when messageId is available
  useEffect(() => {
    if (messageId) {
      const fetchResponses = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5001/api/contact/responses/${messageId}`
          );
          setAdminResponses(response.data); // Store the admin responses in state
        } catch (error) {
          console.error("Error fetching responses:", error);
          setError("Failed to fetch responses.");
        }
      };

      fetchResponses();
    }
  }, [messageId]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, message } = formData;

    if (!fullName || !email || !message) {
      setError("All fields are required.");
      setSuccess("");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post("http://localhost:5001/api/contact", {
        fullName,
        email,
        message,
      });

      if (response.status === 200 || response.status === 201) {
        setMessageId(response.data.messageId);
        setSuccess(response.data.message);
        setError("");
        setFormData({ fullName: "", email: "", message: "" });
      } else {
        setError("Failed to send the message. Please try again.");
        setSuccess("");
      }
    } catch (error) {
      console.error("Error sending message:", error);

      if (error.response) {
        setError(`Error: ${error.response.data.message || "Failed to send the message"}`);
      } else if (error.request) {
        setError("No response from the server. Please try again.");
      } else {
        setError(`Error: ${error.message}`);
      }
      setSuccess("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="sticky" style={{ background: "#0d253f" }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, color: "#fff" }}>
            CareerHub
          </Typography>
          <Link to="/" className={styles.nav_link}>
            Home
          </Link>
          <Link to="/about" className={styles.nav_link}>
            About
          </Link>
          <Link to="/login" className={styles.nav_link}>
            Login
          </Link>
        </Toolbar>
      </AppBar>

      {/* Contact Section */}
      <Box sx={{ padding: "100px 0", textAlign: "center" }} className={styles.contact_section}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              className={styles.contact_title}
            >
              Get in Touch
            </Typography>
            <Typography
              variant="body1"
              className={styles.contact_subtitle}
            >
              Have a question or feedback? We'd love to hear from you!
            </Typography>
          </motion.div>

          <Grid container spacing={4} className={styles.contact_grid}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Paper elevation={5} className={styles.contact_form_paper}>
                  <form onSubmit={handleSubmit} className={styles.contact_form}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="fullName"
                      variant="outlined"
                      value={formData.fullName}
                      onChange={handleChange}
                      sx={{ marginBottom: "20px" }}
                    />
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      variant="outlined"
                      value={formData.email}
                      onChange={handleChange}
                      sx={{ marginBottom: "20px" }}
                    />
                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      variant="outlined"
                      multiline
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      sx={{ marginBottom: "20px" }}
                    />
                    <Button
                      variant="contained"
                      size="large"
                      type="submit"
                      className={styles.contact_submit_button}
                    >
                      {isLoading ? (
                        <CircularProgress size={24} sx={{ color: "#fff" }} />
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                  {error && (
                    <Alert severity="error" sx={{ marginTop: "20px" }}>
                      {error}
                    </Alert>
                  )}
                  {success && (
                    <Alert severity="success" sx={{ marginTop: "20px" }}>
                      {success}
                    </Alert>
                  )}
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box className={styles.footer}>
        <Typography variant="body2" align="center">
          © 2025 CareerHub. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default Contact;
