import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const icons = {
  success: FaCheckCircle,
  error: FaExclamationCircle,
  warning: FaExclamationTriangle,
  info: FaInfoCircle,
};

function NotificationBanner() {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="notificationContainer">
      {notifications.map(n => {
        const Icon = icons[n.type] || FaInfoCircle;
        return (
          <div
            key={n.id}
            className={`notificationItem notification${n.type.charAt(0).toUpperCase() + n.type.slice(1)}`}
            onClick={() => removeNotification(n.id)}
          >
            <Icon className="notificationIcon" />
            <span className="notificationMessage">{n.message}</span>
            <FaTimes className="notificationClose" />
          </div>
        );
      })}
    </div>
  );
}

export default NotificationBanner;
