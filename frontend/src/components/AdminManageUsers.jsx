import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Snackbar, Alert, AppBar, Toolbar, Typography, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Box, Container, CircularProgress 
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]); // To hold the users fetched from the backend
  const [error, setError] = useState(""); // To handle error message
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  // Fetch user profile data and users
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from local storage
        if (!token) {
          navigate("/login"); // Redirect to login if no token is found
          return;
        }

        // Fetch users data (ensure URL is correct based on your backend)
        const userResponse = await axios.get("http://localhost:5001/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(userResponse.data); // Store the fetched users in state
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <>
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ background: "#1a1a2e" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", color: "#f5f5f5" }}>
            CareerHub - Admin Dashboard
          </Typography>
          <Button color="inherit" component={Link} to="/admin" sx={{ fontWeight: "bold", transition: "0.3s", '&:hover': { backgroundColor: "#12122b" } }}>
            Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333", mb: 1 }}>
            Registered Users
          </Typography>
          <Typography variant="body1" sx={{ color: "#666" }}>
            List of all registered users in the system.
          </Typography>
        </Box>

        {/* Error Snackbar */}
        {error && (
          <Snackbar open={true} autoHideDuration={3000} onClose={() => setError("")}>
            <Alert onClose={() => setError("")} severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          </Snackbar>
        )}

        {/* Loading State */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <CircularProgress sx={{ color: "#1a1a2e" }} />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1a1a2e" }}>
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold", fontSize: "16px" }}>First Name</TableCell>
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold", fontSize: "16px" }}>Email</TableCell>
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold", fontSize: "16px" }}>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Display users */}
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user._id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" }, "&:hover": { backgroundColor: "#e8f4ff" } }}>
                      <TableCell align="center" sx={{ fontWeight: "500", color: "#333" }}>{user.firstname}</TableCell>
                      <TableCell align="center" sx={{ color: "#555" }}>{user.email}</TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "inline-block",
                            padding: "5px 10px",
                            borderRadius: "12px",
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#fff",
                            backgroundColor: user.role === "Admin" ? "#d32f2f" : "#388e3c",
                          }}
                        >
                          {user.role}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ fontWeight: "500", color: "#777", padding: "20px" }}>
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </>
  );
};

export default AdminManageUsers;
