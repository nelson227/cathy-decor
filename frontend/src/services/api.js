import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Instance Axios
const api = axios.create({
  baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('cathy-auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Ne pas forcer le Content-Type pour FormData
    if (!(config.data instanceof FormData) && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  error => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  response => {
    console.log('✅ [API] Response received:', response.status, response.data);
    return response.data;
  },
  error => {
    console.error('❌ [API] Response error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    });
    
    // Handle 401 - redirect to login
    if (error.response?.status === 401) {
      console.log('❌ [API] 401 Unauthorized - clearing token and redirecting');
      localStorage.removeItem('cathy-auth-token');
      localStorage.removeItem('cathy-auth-user');
      window.location.href = '/admin-login';
    }
    return Promise.reject(error);
  }
);

export default api;
