import { useState, useEffect } from 'react';
import './Notification.css';

export default function Notification({ message, type = 'warning', duration = 10000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`notification notification-${type}`}>
      <div className="notification-content">
        <span className="notification-icon">
          {type === 'warning' && '⚠️'}
          {type === 'error' && '❌'}
          {type === 'success' && '✅'}
          {type === 'info' && 'ℹ️'}
        </span>
        <span className="notification-message">{message}</span>
      </div>
      <button
        className="notification-close"
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
      >
        ×
      </button>
    </div>
  );
}
