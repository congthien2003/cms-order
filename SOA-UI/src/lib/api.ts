import apiClient from './axios';
import type { AxiosResponse } from 'axios';

// Helper functions để sử dụng API dễ dàng hơn
export const api = {
  // GET request
  get: <T = any>(url: string, config?: any): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config);
  },

  // POST request
  post: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config);
  },

  // PUT request
  put: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config);
  },

  // PATCH request
  patch: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> => {
    return apiClient.patch<T>(url, data, config);
  },

  // DELETE request
  delete: <T = any>(url: string, config?: any): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config);
  },
};

// Export axios instance để sử dụng trực tiếp nếu cần
export { default as apiClient } from './axios';
