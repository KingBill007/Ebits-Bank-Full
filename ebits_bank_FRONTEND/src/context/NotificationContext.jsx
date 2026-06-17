import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const NotificationContext = createContext(null);

let nextId = 0;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const timersRef = useRef({});

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  const addNotification = useCallback((message, type = 'info', duration) => {
    const id = nextId++;
    const durations = { success: 4000, error: 8000, warning: 7000, info: 4000 };
    const timeout = duration ?? durations[type] ?? 5000;

    setNotifications(prev => [...prev, { id, message, type }]);

    timersRef.current[id] = setTimeout(() => {
      removeNotification(id);
    }, timeout);

    return id;
  }, [removeNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
}
