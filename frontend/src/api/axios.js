import axios from "axios";
// Create API client. Use local backend during dev; allow override with VITE_API_URL.
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000/api" : "https://freelance-web-app.vercel.app"),
  timeout: 8000,
});

// Simple health check helper that pings /diag with a short timeout
export async function healthCheck(timeout = 2500) {
  return API.get('/diag', { timeout });
}

// Automatically attach JWT from localStorage to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});





export default API;
