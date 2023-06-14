# 🚀 JWT Authorize - Secure Your Tokens! 🛡️

A powerful and easy-to-use library for handling JSON Web Tokens (JWT) in your Node.js applications. Be it generating,
authenticating, refreshing, or managing tokens, JWT Authorize has got you covered! 🎩

## 🎁 What's inside

- 💪 Robust token generation
- 🔐 Secure token authentication
- 🔄 Easy token refreshing
- ❌ Token revocation utilities

# 📚 Table of Contents 📚

1. 🎉 [Welcome to JWT Authorize!](#-jwt-authorize---secure-your-tokens-) 🎉
2. 🛠️ [Function Guide](#-functions) 🛠️
	1. 🚀 [generateToken](#-generatetoken) 🚀
	2. 🛡️ [authenticate](#-authenticate) 🛡️
	3. 🚫 [revokeToken](#-revoketoken) 🚫
	4. 🚫🔢 [revokeManyTokens](#-revokemanytokens) 🚫🔢
	5. ❓ [isTokenRevoked](#-istokenrevoked) ❓
	6. 🔄 [refreshToken](#-refreshtoken) 🔄
4. 📃 [License](#license) 📃

## 🧰 Installation

    npm install jwt-authorize

## 🧪 Functions

### 🎟️ `generateToken`

Generates access and refresh tokens.

#### Parameters

- `accessTokenOptions`: Object
	- `payload`: Object - The data you want to encode in the access token.
	- `secret`: String - The secret key for the access token.
	- `options`: [SignOptions](https://www.npmjs.com/package/jsonwebtoken) - Optional JWT sign options.
- `refreshTokenOptions`: Object (optional)
	- `payload`: Object - The data you want to encode in the refresh token.
	- `secret`: String - The secret key for the refresh token.
	- `options`: [SignOptions](https://www.npmjs.com/package/jsonwebtoken) - Optional JWT sign options.

#### Returns

- Object
	- `accessToken`: String - The generated access token.
	- `refreshToken`: String - The generated refresh token (if `refreshTokenOptions` were provided).
	- `status`: Number - 200 if successful.

#### Example

    import { generateToken } from "jwt-authorize";

    const tokens = generateToken(
      {
        payload: { username: "Alice" },
        secret: "super-secret-key",
        options: { expiresIn: '1h' },
      },
      {
        payload: { username: "Alice" },
        secret: "another-super-secret-key",
        options: { expiresIn: '7d' },
      }
    );

    console.log(tokens); // { accessToken: "...", refreshToken: "...", status: 200 }

---

### 🔒 `authenticate`

Authenticates a user based on their access token.

#### Parameters

- `token`: Object
	- `accessToken`: String - The access token to authenticate.
	- `refreshToken`: String (optional) - The refresh token.
- `secret`: String - The secret key to verify the token.

#### Returns

- Object
	- `isAuthenticated`: Boolean - True if the token is valid, false otherwise.
	- `payload`: Object - The decoded payload of the token if authenticated.
	- `status`: Number - 200 if authenticated, 401 if not authenticated.

#### Example

    import { authenticate } from "jwt-authorize";

    const result = authenticate(
      {
        accessToken: "your-access-token",
      },
      "your-secret-key"
    );

    console.log(result); // { isAuthenticated: true, payload: {...}, status: 200 }

---

### ❌ `revokeToken`

Revokes a single token, so it can't be used again.

#### Parameters

- `token`: String - The token to revoke.

#### Example

    import { revokeToken } from "jwt-authorize";

    revokeToken("your-token-to-revoke");

---

### ❌❌ `revokeManyTokens`

Revokes multiple tokens at once.

#### Parameters

- `tokens`: Array of Strings - The tokens to revoke.

#### Example

    import { revokeManyTokens } from "jwt-authorize";

    revokeManyTokens(["token-1", "token-2", "token-3"]);

---

### 🕵️ `isTokenRevoked`

Checks if a token has been revoked.

#### Parameters

- `token`: String - The token to check.

#### Returns

- Boolean - True if the token has been revoked, false otherwise.

#### Example

    import { isTokenRevoked } from "jwt-authorize";

    const revoked = isTokenRevoked("your-token");

    console.log(revoked); // true or false

---

### 🔄 `refreshToken`

Refreshes the access and refresh tokens. This is useful to get new tokens without asking the user for their credentials
again.

#### Parameters

- `refreshToken`: String - The refresh token.
- `refreshSecret`: String - The secret for the refresh token.
- `accessTokenSecret`: String - The secret for the access token.
- `accessTokenExpiry`: String (default = "15m") - The expiry duration for the access token.
- `refreshTokenExpiry`: String (default = "7d") - The expiry duration for the refresh token.

#### Returns

- Object
	- `accessToken`: String - The new access token.
	- `refreshToken`: String - The new refresh token.
	- `status`: Number - 200 if successful.

#### Example

    import { refreshToken } from "jwt-authorize";

    const newTokens = refreshToken(
      "your-old-refresh-token",
      "refresh-secret",
      "access-secret"
    );

    console.log(newTokens); // { accessToken: "...", refreshToken: "...", status: 200 }

---

## 📜 License

This package is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License.