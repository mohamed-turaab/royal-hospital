import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("user");
    if (!cached) return null;
    try {
      return JSON.parse(cached);
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem("user");
      setLoading(false);
      return;
    }
    const cachedUser = localStorage.getItem("user");
    if (cachedUser && !user) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
    api
      .get("/auth/me")
      .then((res) => {
        if (res.data && res.data.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      })
      .catch((err) => {
        console.error("Auth check failed:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const toggleTheme = () =>
    setTheme((current) => (current === "dark" ? "light" : "dark"));

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, register, logout, loading, theme, toggleTheme }}
    >
      {children}
    </AuthContext.Provider>
  );
}
