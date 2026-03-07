import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Instance Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('cathy-auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  response => response.data,
  error => {
    // Handle 401 - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('cathy-auth-token');
      window.location.href = '/admin-login';
    }
    return Promise.reject(error);
  }
);

export default api;
