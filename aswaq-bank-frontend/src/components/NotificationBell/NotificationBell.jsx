import React from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

export default function NotificationBell() {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  return (
    <button
      type="button"
      className="dash-icon-button"
      onClick={() => navigate('/notifications')}
    >
      <Bell size={18} />

      {unreadCount > 0 && (
        <span className="dash-badge">
          {unreadCount}
        </span>
      )}
    </button>
  );
}