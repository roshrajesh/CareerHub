import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Container,
    Grid,
    Paper,
    Button,
    Avatar,
} from "@mui/material";
import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineContent, TimelineConnector } from "@mui/lab";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./about.module.css";

const About = () => {
    return (
        <>
            {/* Navbar */}
            <AppBar position="sticky" style={{ background: "#0d253f" }}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        style={{
                            flexGrow: 1,
                            fontFamily: "'Roboto', sans-serif",
                            fontWeight: "bold",
                            fontSize: "1.8rem",
                            color: "#fff",
                        }}
                    >
                        CareerHub
                    </Typography>
                    <Link to="/" className={styles.nav_link}>
                        Home
                    </Link>
                   
                    <Link to="/contact" className={styles.nav_link}>
                        Contact
                    </Link>
                  
                    <Link to="/login" className={styles.nav_link}>
                        Login
                    </Link>
                </Toolbar>
            </AppBar>

            {/* Hero Section with Animation */}
            <Box
                className={styles.hero_section}
                sx={{
                    padding: "100px 0",
                    background: "#1d3557",
                    textAlign: "center",
                    position: "relative",
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                >
                    <Container maxWidth="lg">
                        <Typography
                            variant="h2"
                            className={styles.hero_title}
                            sx={{ color: "#fff", fontWeight: "bold", marginBottom: "20px" }}
                        >
                            Welcome to CareerHub
                        </Typography>
                        <Typography
                            variant="body1"
                            className={styles.hero_subtitle}
                            sx={{ color: "#b0c4de", fontSize: "1.2rem", marginBottom: "30px" }}
                        >
                            Connecting Students, Companies, and Administrators Seamlessly.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                backgroundColor: "#ff8c00",
                                color: "#fff",
                                '&:hover': {
                                    backgroundColor: "#e07b00",
                                },
                            }}
                        >
                            Learn More
                        </Button>
                    </Container>
                </motion.div>
            </Box>

            {/* Our Journey */}
            <Container maxWidth="lg" className={styles.section_container} sx={{ padding: "50px 0" }}>
                <Typography
                    variant="h4"
                    className={styles.section_title}
                    sx={{ marginBottom: "30px", fontWeight: "bold", textAlign: "center" }}
                >
                    Our Journey
                </Typography>
                <Timeline position="alternate">
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot color="primary" />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography variant="h6" component="span">
                                Founded in 2020
                            </Typography>
                            <Typography>CareerHub started as a small project to simplify campus placements.</Typography>
                        </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot color="secondary" />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography variant="h6" component="span">
                                Expanded Services in 2022
                            </Typography>
                            <Typography>We introduced advanced analytics and multi-role support.</Typography>
                        </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot color="success" />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography variant="h6" component="span">
                                Empowering the Future
                            </Typography>
                            <Typography>Today, CareerHub is trusted by thousands of students and companies worldwide.</Typography>
                        </TimelineContent>
                    </TimelineItem>
                </Timeline>
            </Container>

            {/* Testimonials Section */}
            <Box
      className={styles.testimonials_section}
      sx={{ padding: "50px 0", background: "#f8f9fa" }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          className={styles.section_title}
          sx={{
            marginBottom: "50px",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            color: "#333",
          }}
        >
          What People Are Saying
        </Typography>
        <Grid container spacing={4}>
          {/* Testimonial Card 1 */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Paper
                elevation={5}
                sx={{
                  padding: "25px",
                  borderRadius: "15px",
                  textAlign: "center",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 15px 45px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Avatar
                  alt="Student"
                  src="/student.jpg"
                  sx={{
                    width: 70,
                    height: 70,
                    margin: "0 auto 15px",
                    borderRadius: "50%",
                    border: "3px solid #007BFF",
                  }}
                />
                <Typography variant="body1" sx={{ fontStyle: "italic", color: "#555" }}>
                  "CareerHub helped me land my dream job! The platform is intuitive and user-friendly."
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", marginTop: "15px", fontWeight: "bold", color: "#007BFF" }}
                >
                  - Priya Sharma, Student
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          {/* Testimonial Card 2 */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper
                elevation={5}
                sx={{
                  padding: "25px",
                  borderRadius: "15px",
                  textAlign: "center",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 15px 45px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Avatar
                  alt="Employer"
                  src="/employer.jpg"
                  sx={{
                    width: 70,
                    height: 70,
                    margin: "0 auto 15px",
                    borderRadius: "50%",
                    border: "3px solid #28a745",
                  }}
                />
                <Typography variant="body1" sx={{ fontStyle: "italic", color: "#555" }}>
                  "As an employer, CareerHub has streamlined our recruitment process immensely."
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", marginTop: "15px", fontWeight: "bold", color: "#28a745" }}
                >
                  - John Doe, HR Manager
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          {/* Testimonial Card 3 */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Paper
                elevation={5}
                sx={{
                  padding: "25px",
                  borderRadius: "15px",
                  textAlign: "center",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 15px 45px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Avatar
                  alt="Admin"
                  src="/admin.jpg"
                  sx={{
                    width: 70,
                    height: 70,
                    margin: "0 auto 15px",
                    borderRadius: "50%",
                    border: "3px solid #ffc107",
                  }}
                />
                <Typography variant="body1" sx={{ fontStyle: "italic", color: "#555" }}>
                  "The admin tools are a game-changer. Managing placements has never been this easy."
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", marginTop: "15px", fontWeight: "bold", color: "#ffc107" }}
                >
                  - Ramesh Gupta, Administrator
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
            {/* Footer */}
            <Box
                className={styles.footer}
                sx={{ padding: "20px 0", background: "#0d253f", color: "#fff" }}
            >
                <Container maxWidth="lg" sx={{ textAlign: "center" }}>
                    <Typography variant="body2">
                        © {new Date().getFullYear()} CareerHub. All rights reserved. | Empowering Futures
                    </Typography>
                </Container>
            </Box>
        </>
    );
};

export default About;
