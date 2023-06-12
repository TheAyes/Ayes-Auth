# Ayes' Authentication Library

This library provides utility functions for handling JSON Web Tokens (JWT) for authentication purposes.

---

## Functions

### `generateToken(accessTokenOptions, refreshTokenOptions)`

Generates an access token and optionally a refresh token.

- `accessTokenOptions`: An object containing the payload, secret, and options for the access token.
	- `payload`: The payload of the token.
	- `secret`: The secret used to sign the token.
	- `options`: Optional. The signing options for the token.

- `refreshTokenOptions`: An object containing the payload, secret, and options for the refresh token.
	- `payload`: The payload of the token.
	- `secret`: The secret used to sign the token.
	- `options`: Optional. The signing options for the token.

#### Returns

An object containing the generated access and refresh tokens, along with a status code.

---

### `authenticate(token, secret)`

Verifies a token using a secret.

- `token`: The token to verify.
- `secret`: The secret used to verify the token.

#### Returns

An object indicating whether the token is valid, the payload if valid, and a status code. If invalid, it includes an
error message.

---

### `isTokenRevoked(token)`

Checks if a token has been revoked.

- `token`: The token to check.

#### Returns

A boolean indicating whether the token has been revoked.

---

### `revokeToken(token)`

Revokes a token by adding it to the revoked tokens list.

- `token`: The token to revoke.

#### Returns

Nothing.

---

### `refreshToken(refreshToken, refreshSecret, accessTokenOptions, newRefreshTokenOptions)`

Refreshes a token by verifying the provided refresh token and generating a new access token and optionally a new refresh
token.

- `refreshToken`: The refresh token used for refreshing.
- `refreshSecret`: The secret used to verify the refresh token.
- `accessTokenOptions`: An object containing the payload, secret, and options for the new access token.
- `newRefreshTokenOptions`: Optional. An object containing the payload, secret, and options for the new refresh token.

#### Returns

An object containing the newly generated access and refresh tokens, along with a status code.

---

## Dependencies

This library depends on the `jsonwebtoken` NPM package.

## Example Usage

```javascript
import { generateToken, authenticate, revokeToken, isTokenRevoked, refreshToken } from 'path-to-library';

const accessTokenOptions = {
    payload: { userId: 1 },
    secret: 'access-secret',
    options: { expiresIn: '1h' }
};

const refreshTokenOptions = {
    payload: { userId: 1 },
    secret: 'refresh-secret',
    options: { expiresIn: '7d' }
};

const tokens = generateToken(accessTokenOptions, refreshTokenOptions);

const authenticationResult = authenticate(tokens.accessToken, 'access-secret');

console.log(authenticationResult.isAuthenticated); // true

revokeToken(tokens.refreshToken);

console.log(isTokenRevoked(tokens.refreshToken)); // true
