import axios from 'axios';
import { getAppParams } from '@/lib/app-params';

const { apiBaseUrl } = getAppParams();

export const base44Client = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
base44Client.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
base44Client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      console.warn('Unauthorized request - authentication required');
    } else if (error.response?.status === 403) {
      console.warn('Forbidden - user not registered or insufficient permissions');
    }
    return Promise.reject(error);
  }
);
