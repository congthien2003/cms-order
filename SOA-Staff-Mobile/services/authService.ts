import api from "@/lib/api";
import tokenService from "@/utils/tokenService";
import { ApiResponse } from "@/models/common";
import { LoginRequest, LoginResponse, User } from "@/models/auth";

class AuthService {
  /**
   * API routes matching AuthenticationController
   * Controller: api/v{v:apiVersion}/authentication
   */
  private apiRoute = {
    LOGIN: "/v1/authentication/login",
    REGISTER: "/v1/authentication/register",
    PING: "/v1/authentication/ping",
    PROFILE: "/v1/authentication/profile",
  };

  /**
   * Login with email and password
   */
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post<ApiResponse<LoginResponse>>(
      this.apiRoute.LOGIN,
      data,
    );

    if (response.isSuccess && response.data) {
      // Store token and user data
      await tokenService.setTokens(response.data.accessToken);
      await tokenService.setUser(response.data.user);
    }

    return response;
  }

  /**
   * Logout and clear tokens
   */
  async logout(): Promise<void> {
    try {
      // API doesn't have a dedicated logout endpoint yet
      // Just clear local tokens
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      await tokenService.clearAll();
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    return api.get<ApiResponse<User>>(this.apiRoute.PROFILE);
  }

  /**
   * Ping to verify authentication
   */
  async ping(): Promise<boolean> {
    try {
      await api.get(this.apiRoute.PING);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    return tokenService.isAuthenticated();
  }

  /**
   * Get stored user data
   */
  async getStoredUser(): Promise<User | null> {
    return tokenService.getUser<User>();
  }
}

export default new AuthService();
