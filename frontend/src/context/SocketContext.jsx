import React, { createContext, useContext, useState, useEffect } from "react";

const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [isConnected, setIsConnected] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Low Stock Alert", body: "Amoxicillin inventory is below 15 units.", time: "5m ago", read: false, type: "warning" },
    { id: 2, title: "New Prescription", body: "Dr. Amina signed a new prescription for Hassan Ali.", time: "12m ago", read: false, type: "info" },
    { id: 3, title: "Billing Complete", body: "Invoice #INV-8820 was successfully paid.", time: "1h ago", read: true, type: "success" },
  ]);
  const [activeEmergency, setActiveEmergency] = useState(null);

  // Simulate real-time alerts periodically
  useEffect(() => {
    // Dispatch a mock emergency alert after 25 seconds of session
    const emergencyTimer = setTimeout(() => {
      setActiveEmergency({
        id: "EMG-102",
        message: "CRITICAL: Cardiac Arrest in Room 102 (Patient Jama)",
        location: "Cardiology Ward, Room 102",
        timestamp: new Date().toLocaleTimeString(),
        severity: "CRITICAL"
      });
    }, 15000); // 15 seconds to give user time to see the normal dashboard first!

    return () => clearTimeout(emergencyTimer);
  }, []);

  const triggerEmergencyMock = (message, location) => {
    setActiveEmergency({
      id: `EMG-${Math.floor(Math.random() * 900) + 100}`,
      message: message || "CRITICAL ALERT: Vitals dropped in ICU Ward",
      location: location || "ICU Ward, Room 201",
      timestamp: new Date().toLocaleTimeString(),
      severity: "CRITICAL"
    });
  };

  const resolveEmergency = () => {
    setActiveEmergency(null);
    setNotifications(prev => [
      {
        id: Date.now(),
        title: "Emergency Resolved",
        body: "Critical code acknowledged and responded to.",
        time: "Just now",
        read: false,
        type: "success"
      },
      ...prev
    ]);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (title, body, type = "info") => {
    setNotifications(prev => [
      {
        id: Date.now(),
        title,
        body,
        time: "Just now",
        read: false,
        type
      },
      ...prev
    ]);
  };

  return (
    <SocketContext.Provider value={{
      isConnected,
      notifications,
      activeEmergency,
      resolveEmergency,
      triggerEmergencyMock,
      markAllRead,
      clearNotifications,
      addNotification
    }}>
      {children}
    </SocketContext.Provider>
  );
}
