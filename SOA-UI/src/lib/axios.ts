import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import {
  SessionStorageKey,
  getSessionStorage,
  removeSessionStorage,
} from './sessionStorage';

// Tạo axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - gắn token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = getSessionStorage(SessionStorageKey.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý lỗi và redirect
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const { response } = error;

    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - xóa token và redirect về login
          removeSessionStorage(SessionStorageKey.ACCESS_TOKEN);
          window.location.href = '/login';
          break;

        case 403:
          // Forbidden - redirect về trang 403
          window.location.href = '/403';
          break;

        case 404:
          // Not Found - redirect về trang 404
          window.location.href = '/404';
          break;

        case 500:
          // Internal Server Error - redirect về trang error
          window.location.href = '/error';
          break;

        default:
          // Các lỗi khác - có thể log hoặc xử lý tùy ý
          console.error('API Error:', error);
          break;
      }
    } else {
      // Network error hoặc timeout
      console.error('Network Error:', error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
