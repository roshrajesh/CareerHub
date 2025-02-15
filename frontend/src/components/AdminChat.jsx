import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";

const AdminChat = () => {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch messages from the server
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/chat");
        setMessages(response.data); // Assuming API returns an array with fullname & email
      } catch (error) {
        setError("Failed to fetch messages.");
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Auto-refresh every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Open Gmail with a pre-filled reply
  const handleEmailReply = (email, message) => {
    const subject = encodeURIComponent("Response to your query");
    const body = encodeURIComponent(`Hello,\n\nRegarding your message: "${message}"\n\n[Your reply here]\n\nBest Regards,\nAdmin`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <>
      <AppBar position="sticky" style={{ background: "#0d253f" }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, color: "#fff" }}>
            Admin Chat
          </Typography>
          <Link to="/admin" style={{ color: "white", textDecoration: "none", marginLeft: "20px" }}>
            Dashboard
          </Link>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" style={{ marginTop: "20px" }}>
        <Paper style={{ padding: "20px" }}>
          <Typography variant="h4" gutterBottom>
            Messages
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <Box>
            {messages.length > 0 ? (
              messages.map((msg) => (
                <Paper key={msg._id} style={{ padding: "15px", marginBottom: "10px" }}>
                  <Typography variant="subtitle1">
                    <strong>From:</strong> {msg.fullname} ({msg.email})
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Message:</strong> {msg.message}
                  </Typography>
                  {msg.response && (
                    <Typography variant="subtitle2" color="primary">
                      <strong>Admin:</strong> {msg.response}
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => handleEmailReply(msg.email, msg.message)}
                    style={{ marginTop: "10px", marginRight: "10px" }}
                  >
                    Reply via Email
                  </Button>
                </Paper>
              ))
            ) : (
              <Typography>No messages found.</Typography>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default AdminChat;
