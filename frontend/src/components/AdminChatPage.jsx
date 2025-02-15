import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./adminpage.css"; // Style as needed

const AdminChatPage = () => {
  const [chats, setChats] = useState([]); // To hold active chats
  const [selectedChat, setSelectedChat] = useState(null);
  const [adminMessage, setAdminMessage] = useState("");

  useEffect(() => {
    // Fetch active chats from the backend (API call to get chats)
    fetch("/api/chats")
      .then((response) => response.json())
      .then((data) => setChats(data))
      .catch((error) => console.error("Error fetching chats:", error));
  }, []);

  const handleSendMessage = () => {
    if (adminMessage.trim() === "" || !selectedChat) return;

    // Send the admin message to the backend (API call)
    fetch(`/api/chats/${selectedChat.id}/send`, {
      method: "POST",
      body: JSON.stringify({ message: adminMessage }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the chat with the new message
        setSelectedChat(data);
        setAdminMessage(""); // Clear input after sending
      })
      .catch((error) => console.error("Error sending message:", error));
  };

  return (
    <div className="admin-chat-container">
      <div className="navbar">
        <Link to="/admin" className="navbar-link">Back to Admin Dashboard</Link>
      </div>
      <div className="chat-list">
        <h2>Active Chats</h2>
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="chat-item"
            onClick={() => setSelectedChat(chat)}
          >
            <p>Chat with Student {chat.studentName}</p>
          </div>
        ))}
      </div>
      {selectedChat && (
        <div className="chat-detail">
          <h3>Conversation with {selectedChat.studentName}</h3>
          <div className="messages">
            {selectedChat.messages.map((message, index) => (
              <div key={index} className={message.sender === "student" ? "student-msg" : "admin-msg"}>
                <p>{message.text}</p>
              </div>
            ))}
          </div>
          <textarea
            value={adminMessage}
            onChange={(e) => setAdminMessage(e.target.value)}
            placeholder="Type your response..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default AdminChatPage;
