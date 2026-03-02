import axios from 'axios';
import { isTokenExpired } from '@/lib/auth/token';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      if (isTokenExpired(token)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (!window.location.pathname.startsWith('/auth')) {
          window.location.href = '/auth/login';
        }
        return config;
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    const data = response.data;

    // Expect standardized backend response
    if (data && typeof data.success !== 'undefined') {
      if (!data.success) {
        return Promise.reject(
          new Error(data.error?.message || 'Request failed')
        );
      }

      // unwrap data
      response.data = data.data;
    }

    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (!window.location.pathname.startsWith('/auth')) {
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(
      new Error(
        error.response?.data?.error?.message ||
        error.message ||
        'Request failed'
      )
    );
  }
);
