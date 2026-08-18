import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback
} from 'react';
import api from '../services/api';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = useCallback(async () => {
    try {
      const res = await api.get('/notifications');

      const data = Array.isArray(res.data) ? res.data : [];

      setNotifications(data);

      const unread = data.filter(
        (notification) => !notification.read
      ).length;

      setUnreadCount(unread);

    } catch (error) {
      console.error(
        'Erreur récupération notifications :',
        error
      );
    }
  }, []);

  useEffect(() => {
    loadNotifications();

    // Actualiser automatiquement le nombre
    const interval = setInterval(() => {
      loadNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, [loadNotifications]);

  const markAsRead = useCallback(async (id) => {
    try {
      const res = await api.patch(
        `/notifications/${id}/read`
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? res.data
            : notification
        )
      );

      setUnreadCount((prev) =>
        Math.max(0, prev - 1)
      );

      return res.data;

    } catch (error) {
      console.error(
        'Erreur marquage notification :',
        error
      );

      return null;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.patch('/notifications/read-all');

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          read: true
        }))
      );

      setUnreadCount(0);

    } catch (error) {
      console.error(
        'Erreur marquage notifications :',
        error
      );
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loadNotifications,
        markAsRead,
        markAllAsRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotifications doit être utilisé dans NotificationProvider'
    );
  }

  return context;
}