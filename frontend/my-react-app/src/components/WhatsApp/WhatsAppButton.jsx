import React, { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import "./WhatsAppButton.css";

const WhatsAppButton = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="whatsapp-container">
      {chatOpen && (
        <div className="whatsapp-chatbox">
          <p>Hi there! How can we help you?</p>
          <a
            href="https://wa.me/+254718315313"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-chat-link"
          >
            Start Chat
          </a>
        </div>
      )}
      <div
        className="whatsapp-button"
        onClick={() => setChatOpen(!chatOpen)}
      >
        <FaWhatsapp size={40} color="white" />
      </div>
    </div>
  );
};

export default WhatsAppButton;
