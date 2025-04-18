"use client"; // Required for using React hooks in Next.js

import React from "react";
import "../../dashboard/dashboard.css";

interface CustomModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ visible, title, message, onClose }) => {
  if (!visible) return null; // Don't render the modal if it's not visible

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="modal-button-gold" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;