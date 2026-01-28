import type { LoginResponse } from '@/models/auth/response/authResponse';
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
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/v1/authentication/login', credentials);
    const { data } = response.data;

    return data;
  },

  // User registration
  register: async (
    userData: RegisterRequest
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post('/authentication/register', userData);
    return response.data;
  },

  // User logout
  logout: async (): Promise<ApiResponse<void>> => {
    try {
      const response = await api.post('/authentication/logout');
      return response.data;
    } finally {
      // Always clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  // Get user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/v1/authentication/profile');
    return response.data;
  },

  // Refresh access token
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post('/v1/authentication/refresh', {
      refreshToken,
    });
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
    const response = await api.post(
      '/v1/authentication/forgot-password',
      emailData
    );
    return response.data;
  },

  // Reset password
  resetPassword: async (
    resetData: ResetPasswordRequest
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post(
      '/v1/authentication/reset-password',
      resetData
    );
    return response.data;
  },

  // Verify email
  verifyEmail: async (
    token: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post('/v1/authentication/verify-email', {
      token,
    });
    return response.data;
  },

  // Resend verification email
  resendVerification: async (
    email: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post('/v1/authentication/resend-verification', {
      email,
    });
    return response.data;
  },
};

// Keep backward compatibility
export const authApi = authService;
