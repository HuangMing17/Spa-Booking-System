import React from "react";
import { CheckCircleOutlined } from "@ant-design/icons";
import "./SuccessNotification.css";

const SuccessNotification = ({ visible, message, onClose }) => {
  if (!visible) return null;

  return (
    <div className="success-notification-overlay" onClick={onClose}>
      <div
        className="success-notification-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="success-notification-content">
          <div className="success-icon">
            <CheckCircleOutlined />
          </div>
          <h3 className="success-title">Thành công!</h3>
          <p className="success-message">{message}</p>
          <div className="success-animation">
            <div className="confetti"></div>
            <div className="confetti"></div>
            <div className="confetti"></div>
            <div className="confetti"></div>
            <div className="confetti"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessNotification;
