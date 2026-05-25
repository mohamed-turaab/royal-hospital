import axios from "axios";

function resolveBaseURL() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "royal-hospital-lake.vercel.app") {
      return "https://royal-hospital-backend.vercel.app/api";
    }
  }

  return "/api";
}

const baseURL = resolveBaseURL();

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
