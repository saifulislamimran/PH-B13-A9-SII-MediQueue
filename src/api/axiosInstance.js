import axios from 'axios';
import { getStoredToken, removeStoredToken } from '../utils/token';

// Create a configured Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://mediqueue-server.vercel.app/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT token into Authorization header of every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally (e.g. 401/403 session expirations)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      // 401 Unauthorized or 403 Forbidden indicates expired session or invalid token
      if (status === 401 || status === 403) {
        removeStoredToken();
        // Redirect to login page to re-authenticate
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
