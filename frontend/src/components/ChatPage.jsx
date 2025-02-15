import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./ChatPage.css";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (userMessage.trim() === "") return;

    setMessages([
      ...messages,
      { text: userMessage, sender: "student", timestamp: new Date().toLocaleTimeString() },
    ]);
    setUserMessage("");

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "This is an admin response.", sender: "admin", timestamp: new Date().toLocaleTimeString() },
      ]);
    }, 2000);
  };

  return (
    <div className="chat-container">
      {/* Navbar */}
      <div className="navbar">
        <Link to="/student" className="navbar-link">Back to Student Page</Link>
      </div>

      {/* Chat Header */}
      <div className="chat-header">
        <h2>CareerChat</h2>
      </div>

      {/* Chat Messages */}
      <div className="chat-box">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${message.sender === "student" ? "student-msg" : "admin-msg"}`}
          >
            <div className="message-info">
              <span className="sender">{message.sender}</span>
              <span className="timestamp">{message.timestamp}</span>
            </div>
            <p className="message-text">{message.text}</p>
          </div>
        ))}
        {isTyping && <div className="typing-indicator show">Admin is typing...</div>}
      </div>

      {/* Chat Input */}
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage} className="send-btn">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
