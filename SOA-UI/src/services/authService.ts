import type { AuthResponse } from '@/models/auth/response/authResponse';
import api from '../lib/axios';
import type { LoginRequest } from '@/models/auth/request/loginRequest';
import type { ForgotPasswordRequest } from '@/models/auth/request/forgotPasswordRequest';
import type { RegisterRequest } from '@/models/auth/request/registerRequest';
import type { ResetPasswordRequest } from '@/models/auth/request/resetPasswordRequest';
import type { RefreshTokenResponse } from '@/models/auth/response/refreshTokenResponse';
import type { ApiResponse } from '@/models/common/api';
import type { User } from '@/models/user/entity/user';

export const authService = {
  // User login
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    const { data } = response.data;

    // Store tokens in localStorage
    if (data.tokens) {
      localStorage.setItem('accessToken', data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.tokens.refreshToken);
    }

    return data;
  },

  // User registration
  register: async (
    userData: RegisterRequest
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // User logout
  logout: async (): Promise<ApiResponse<void>> => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } finally {
      // Always clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  // Get user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Refresh access token
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post('/auth/refresh', { refreshToken });
    const { data } = response.data;

    // Update access token
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }

    return data;
  },

  // Forgot password
  forgotPassword: async (
    emailData: ForgotPasswordRequest
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post('/auth/forgot-password', emailData);
    return response.data;
  },

  // Reset password
  resetPassword: async (
    resetData: ResetPasswordRequest
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post('/auth/reset-password', resetData);
    return response.data;
  },

  // Verify email
  verifyEmail: async (
    token: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  // Resend verification email
  resendVerification: async (
    email: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },
};

// Keep backward compatibility
export const authApi = authService;
