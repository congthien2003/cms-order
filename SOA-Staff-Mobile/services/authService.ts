import api from "@/lib/api";
import tokenService from "@/utils/tokenService";
import { ApiResponse } from "@/models/common";
import {
	LoginRequest,
	LoginResponse,
	RefreshTokenRequest,
	RefreshTokenResponse,
	User,
} from "@/models/auth";

class AuthService {
	private apiRoute = {
		LOGIN: "/auth/login",
		LOGOUT: "/auth/logout",
		REFRESH_TOKEN: "/auth/refresh-token",
		GET_ME: "/auth/me",
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
			// Store tokens and user data
			await tokenService.setTokens(
				response.data.accessToken,
				response.data.refreshToken,
			);
			await tokenService.setUser(response.data.user);
		}

		return response;
	}

	/**
	 * Logout and clear tokens
	 */
	async logout(): Promise<void> {
		try {
			await api.post(this.apiRoute.LOGOUT);
		} catch (error) {
			console.error("Logout API error:", error);
		} finally {
			await tokenService.clearAll();
		}
	}

	/**
	 * Refresh access token
	 */
	async refreshToken(): Promise<ApiResponse<RefreshTokenResponse> | null> {
		const refreshToken = await tokenService.getRefreshToken();
		if (!refreshToken) {
			return null;
		}

		const data: RefreshTokenRequest = { refreshToken };
		const response = await api.post<ApiResponse<RefreshTokenResponse>>(
			this.apiRoute.REFRESH_TOKEN,
			data,
		);

		if (response.isSuccess && response.data) {
			await tokenService.setTokens(
				response.data.accessToken,
				response.data.refreshToken,
			);
		}

		return response;
	}

	/**
	 * Get current user profile
	 */
	async getMe(): Promise<ApiResponse<User>> {
		return api.get<ApiResponse<User>>(this.apiRoute.GET_ME);
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
