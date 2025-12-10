export interface AuthResponse {
	user: {
		id: string;
		email: string;
		name: string;
		role: string;
	};
	tokens: {
		accessToken: string;
		refreshToken: string;
		expiresIn: number;
	};
}
