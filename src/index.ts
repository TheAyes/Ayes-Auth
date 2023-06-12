import jwt, {JsonWebTokenError, SignOptions} from "jsonwebtoken";

type AuthBaseType = {
	status?: number;
	error?: string;
};

const isJsonWebTokenError = (error: unknown): error is JsonWebTokenError => {
	return error instanceof Object && "message" in error && typeof error.message === "string";
};

type GenerateTokenResult = AuthBaseType & {
	accessToken?: string;
	refreshToken?: string;
};
export const generateToken = (
	accessTokenOptions: {
		payload: { [key: string]: any };
		secret: string;
		options?: SignOptions;
	},
	refreshTokenOptions?: {
		payload: { [key: string]: any };
		secret: string;
		options?: SignOptions;
	}
): GenerateTokenResult => {
	try {
		const accessToken = jwt.sign(accessTokenOptions.payload, accessTokenOptions.secret, accessTokenOptions.options);
		let refreshToken;
		if (refreshTokenOptions) {
			refreshToken = jwt.sign(
				refreshTokenOptions.payload,
				refreshTokenOptions.secret,
				refreshTokenOptions.options
			);
		}

		return {
			accessToken: accessToken,
			refreshToken: refreshToken,
			status: 200,
		};
	} catch (error: unknown) {
		if (isJsonWebTokenError(error)) {
			return {
				error: "Token generation failed",
				status: 500,
			};
		}

		return {
			error: "An unexpected error occurred",
			status: 500,
		};
	}
};

type AuthenticateResult = AuthBaseType & {
	isAuthenticated: boolean;
	payload?: { [key: string]: any };
};
export const authenticate = (token: string, secret: string): AuthenticateResult => {
	try {
		const payload = jwt.verify(token, secret);
		return {
			isAuthenticated: true,
			payload: payload as { [key: string]: any },
			status: 200,
		};
	} catch (error: unknown) {
		if (isJsonWebTokenError(error)) {
			return {
				isAuthenticated: false,
				error: error.message,
				status: 401,
			};
		}

		return {
			isAuthenticated: false,
			error: "An unexpected error occurred",
			status: 500,
		};
	}
};

const revokedTokens: Set<string> = new Set();

// Function to revoke token
export const revokeToken = (token: string) => {
	revokedTokens.add(token);
};

// Function to check if a token has been revoked
export const isTokenRevoked = (token: string): boolean => {
	return revokedTokens.has(token);
};

type RefreshTokenResult = AuthBaseType & {
	accessToken?: string;
	refreshToken?: string;
};
export const refreshToken = (
	refreshToken: string,
	refreshSecret: string,
	accessTokenOptions: {
		payload: { [key: string]: any };
		secret: string;
		options?: SignOptions;
	},
	newRefreshTokenOptions?: {
		payload: { [key: string]: any };
		secret: string;
		options?: SignOptions;
	}
): RefreshTokenResult => {
	try {
		// Verifying the refresh token
		jwt.verify(refreshToken, refreshSecret);

		// Check if refresh token is revoked (You need to implement isTokenRevoked function)
		if (isTokenRevoked(refreshToken)) {
			return {
				error: "Refresh token is revoked",
				status: 401,
			};
		}

		// Generating a new access token
		const accessToken = jwt.sign(accessTokenOptions.payload, accessTokenOptions.secret, accessTokenOptions.options);

		// Optionally generating a new refresh token
		let newRefreshToken;
		if (newRefreshTokenOptions) {
			newRefreshToken = jwt.sign(
				newRefreshTokenOptions.payload,
				newRefreshTokenOptions.secret,
				newRefreshTokenOptions.options
			);
		}

		return {
			accessToken: accessToken,
			refreshToken: newRefreshToken,
			status: 200,
		};
	} catch (error: unknown) {
		if (isJsonWebTokenError(error)) {
			return {
				error: error.message,
				status: 401,
			};
		}

		return {
			error: "An unexpected error occurred",
			status: 500,
		};
	}
};
