import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [isConnected, setIsConnected] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [activeEmergency, setActiveEmergency] = useState(null);

  // Fetch real notifications from the API
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get("/notifications");
      const data = Array.isArray(res.data) ? res.data : [];
      // Transform to match UI format
      setNotifications(
        data.map((n) => ({
          id: n._id,
          title: n.title,
          body: n.body,
          time: timeAgo(new Date(n.createdAt)),
          read: n.read,
          type: n.type,
          link: n.link,
        }))
      );
    } catch (err) {
      // If not logged in or error, keep empty
      setNotifications([]);
    }
  }, []);

  // Poll every 20 seconds for new notifications
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const triggerEmergencyMock = (message, location) => {
    setActiveEmergency({
      id: `EMG-${Math.floor(Math.random() * 900) + 100}`,
      message: message || "CRITICAL ALERT: Vitals dropped in ICU Ward",
      location: location || "ICU Ward, Room 201",
      timestamp: new Date().toLocaleTimeString(),
      severity: "CRITICAL",
    });
  };

  const resolveEmergency = () => {
    setActiveEmergency(null);
    addNotification("Emergency Resolved", "Critical code acknowledged and responded to.", "success");
  };

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const clearNotifications = async () => {
    try {
      await api.delete("/notifications/clear");
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  const markOneRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Add a local notification (used after resolving emergencies, etc.)
  const addNotification = (title, body, type = "info") => {
    setNotifications((prev) => [
      {
        id: Date.now(),
        title,
        body,
        time: "Just now",
        read: false,
        type,
      },
      ...prev,
    ]);
  };

  return (
    <SocketContext.Provider
      value={{
        isConnected,
        notifications,
        activeEmergency,
        resolveEmergency,
        triggerEmergencyMock,
        markAllRead,
        markOneRead,
        clearNotifications,
        addNotification,
        fetchNotifications,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

// Helper: show relative time
function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
