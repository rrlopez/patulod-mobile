import axios from 'axios';
import { getToken } from '../api';

const getBaseUrl = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('EXPO_PUBLIC_API_URL is not defined');
  }
  return apiUrl;
};

// Create axios instance
export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data, config } = error.response;
      const url = config?.url || '';
      
      // Don't log 404 for active booking endpoint (expected when no active booking)
      if (status === 404 && url.includes('/bookings/active')) {
        // Silent - this is expected
        return Promise.reject(error);
      }
      
      console.error('API Error:', status, data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);
