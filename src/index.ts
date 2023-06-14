import jwt, {JsonWebTokenError, SignOptions} from "jsonwebtoken";

type AuthBaseType = {
	status?: number;
	error?: string;
};

/**
 * Check if the error is a JsonWebTokenError.
 *
 * @param error - The error object.
 * @returns - A boolean indicating if the error is a JsonWebTokenError.
 */
const isJsonWebTokenError = (error: unknown): error is JsonWebTokenError => {
	return error instanceof Object && "message" in error && typeof error.message === "string";
};

type GenerateTokenResult = AuthBaseType & {
	accessToken?: string;
	refreshToken?: string;
};

/**
 * Generate access and refresh tokens.
 *
 * @param accessTokenOptions - The options for the access token.
 * @param refreshTokenOptions - The options for the refresh token.
 * @returns - An object with the access and refresh tokens, and status.
 */
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

/**
 * Authenticate a user based on their tokens.
 *
 * @param token - An object containing the access and optional refresh tokens.
 * @param secret - The secret to verify the token.
 * @returns - An object indicating if the user is authenticated, the payload, and status.
 */
export const authenticate = (token: {
	accessToken: string;
	refreshToken?: string
}, secret: string): AuthenticateResult => {
	try {
		const payload = jwt.verify(token.accessToken, secret);
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

/**
 * Revoke a token.
 *
 * @param token - The token to revoke.
 */
export const revokeToken = (token: string) => revokedTokens.add(token);

/**
 * Revokes many tokens.
 *
 * @param tokens - The array of tokens to revoke.
 */
export const revokeManyTokens = (tokens: string[]) => tokens.forEach(token => revokedTokens.add(token));

/**
 * Check if a token has been revoked.
 *
 * @param token - The token to check.
 * @returns - A boolean indicating if the token has been revoked.
 */
export const isTokenRevoked = (token: string): boolean => revokedTokens.has(token);

type RefreshTokenResult = AuthBaseType & {
	accessToken?: string;
	refreshToken?: string;
};

/**
 * Refresh the access and refresh tokens.
 *
 * @param refreshToken - The refresh token.
 * @param refreshSecret - The secret for the refresh token.
 * @param accessTokenSecret - The secret for the access token.
 * @param accessTokenExpiry - The expiry duration for the access token.
 * @param refreshTokenExpiry - The expiry duration for the refresh token.
 * @returns - An object with the new access and refresh tokens, and status.
 */
export const refreshToken = (
	refreshToken: string,
	refreshSecret: string,
	accessTokenSecret: string,
	accessTokenExpiry: string = "15m",
	refreshTokenExpiry: string = "7d",
): RefreshTokenResult => {
	try {
		const decoded: any = jwt.verify(refreshToken, refreshSecret);

		const {iat, exp, ...payload} = decoded;

		const newAccessToken = jwt.sign(payload, accessTokenSecret, {expiresIn: accessTokenExpiry});

		const newRefreshToken = jwt.sign(payload, refreshSecret, {expiresIn: refreshTokenExpiry});

		revokeToken(refreshToken);

		return {
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
			status: 200,
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'Unknown error',
			status: 401,
		};
	}
};