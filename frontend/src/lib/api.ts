
import axios from 'axios';

// Debug log to check if the environment variable is being loaded
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Temporarily disable withCredentials to see if it's causing CORS issues
  // withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log(`[API] ${config.method?.toUpperCase()} ${fullUrl}`, config.params || '');
    return config;
  },
  (error) => {
    console.error('[API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('[API] Request timeout:', error.config.url);
      error.message = 'Request timeout. Please check your connection and try again.';
    } else if (!error.response) {
      // Network error
      console.error('[API] Network Error:', error.message);
      if (error.message === 'Network Error') {
        error.message = 'Cannot connect to the server. Please check your connection and try again.';
      }
    } else {
      // HTTP error
      console.error(
        `[API] Error ${error.response.status} (${error.config.url}):`,
        error.response.data
      );
    }
    return Promise.reject(error);
  }
);

export default api;
