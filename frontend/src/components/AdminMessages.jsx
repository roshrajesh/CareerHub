import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import axios from "axios";
import "./AdminMessages.css";

const AdminMessages = () => {
  const [studentMessages, setStudentMessages] = useState([]); // Ensure this is an array initially
  const [adminReply, setAdminReply] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  // Fetch messages from the backend (assuming API exists)
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/messages");
        if (Array.isArray(response.data)) {
          setStudentMessages(response.data);
        } else {
          console.error("Received data is not an array");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  // Handle admin reply
  const handleAdminReply = (messageId) => {
    if (adminReply.trim() === "") return;

    setIsReplying(true);

    setTimeout(() => {
      // Simulating the reply, updating the message with the admin's reply
      setStudentMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                adminReply: {
                  text: adminReply,
                  timestamp: new Date().toLocaleTimeString(),
                },
              }
            : msg
        )
      );
      setAdminReply(""); // Clear input field
      setIsReplying(false); // Stop typing indicator
    }, 2000);
  };

  return (
    <div className="admin-container">
      {/* Navbar */}
      <div className="navbar">
        <Link to="/admin" className="navbar-link">
          Admin Dashboard
        </Link>
      </div>

      {/* Admin Header */}
      <div className="admin-header">
        <h2>Admin Messages</h2>
      </div>

      {/* Student Messages */}
      <div className="student-messages">
        {studentMessages.length > 0 ? (
          studentMessages.map((message) => (
            <div key={message.id} className="student-message">
              <div className="message-info">
                <span className="sender">Student</span>
                <span className="timestamp">{message.timestamp}</span>
              </div>
              <p className="message-text">{message.text}</p>

              {/* Admin's Reply */}
              {message.adminReply && (
                <div className="admin-reply">
                  <span className="sender">Admin</span>
                  <span className="timestamp">
                    {message.adminReply.timestamp}
                  </span>
                  <p className="message-text">{message.adminReply.text}</p>
                </div>
              )}

              {/* Admin Reply Input */}
              <div className="admin-reply-input">
                <input
                  type="text"
                  className="admin-input"
                  value={adminReply}
                  onChange={(e) => setAdminReply(e.target.value)}
                  placeholder="Type your reply..."
                />
                <button
                  onClick={() => handleAdminReply(message.id)}
                  className="send-btn"
                >
                  Send Reply
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No messages available.</p>
        )}
      </div>

      {/* Typing Indicator */}
      {isReplying && <div className="typing-indicator show">Admin is typing...</div>}
    </div>
  );
};

export default AdminMessages;
