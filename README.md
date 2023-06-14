# JWT Authorize

This utility is a JavaScript module that provides functions to handle JSON Web Tokens (JWT) for authentication purposes.
It is built using Node.js and utilizes the `jsonwebtoken` library.

## Features

1. **Token Generation**: Generate access and refresh tokens.
2. **Token Authentication**: Authenticate a user by verifying their access token.
3. **Token Revocation**: Revoke tokens by storing them in memory.
4. **Token Refresh**: Generate a new access token using a refresh token.

## Installation

This module has a dependency on the `jsonwebtoken` library. Make sure you have it installed in your project:

    npm install jsonwebtoken

Then, import the utility module in your code:

    import {
        generateToken,
        authenticate,
        revokeToken,
        isTokenRevoked,
        refreshToken
    } from 'jwt-authorize';

## API

### generateToken(accessTokenOptions, refreshTokenOptions)

Generates an access token and, optionally, a refresh token.

- **accessTokenOptions**: Object containing payload, secret, and options for the access token.
- **refreshTokenOptions**: Optional object containing payload, secret, and options for the refresh token.

Returns an object containing the access token, refresh token, and status code.

### authenticate(token, secret)

Authenticates a user by verifying their access token.

- **token**: Object containing the access token and optional refresh token.
- **secret**: Secret key used for verifying the access token.

Returns an object containing the authentication status, payload, error message (if any), and status code.

### revokeToken(token)

Revokes a token by adding it to an in-memory store.

- **token**: The token to be revoked.

### isTokenRevoked(token)

Checks if a token has been revoked.

- **token**: The token to check.

Returns a boolean indicating whether the token is revoked.

### refreshToken(refreshToken, refreshSecret, accessTokenPayloadCallback, accessTokenOptions, newRefreshTokenOptions)

Generates a new access token using a refresh token.

- **refreshToken**: The refresh token.
- **refreshSecret**: Secret key used for verifying the refresh token.
- **accessTokenPayloadCallback**: Callback function to manipulate the payload of the new access token.
- **accessTokenOptions**: Object containing payload, secret, and options for the new access token.
- **newRefreshTokenOptions**: Optional object containing payload, secret, and options for a new refresh token.

Returns an object containing the new access token, optional new refresh token, and status code.

## Example Usage

    import {
        generateToken,
        authenticate,
        revokeToken,
        isTokenRevoked,
        refreshToken
    } from 'path-to-this-module';

    // Generate tokens
    const tokens = generateToken(
        {
            payload: { userId: 1 },
            secret: 'secretKey',
            options: { expiresIn: '1h' }
        },
        {
            payload: { userId: 1 },
            secret: 'refreshSecretKey',
            options: { expiresIn: '7d' }
        }
    );

    // Authenticate user
    const authResult = authenticate(
        { accessToken: tokens.accessToken },
        'secretKey'
    );

    // Revoke token
    revokeToken(tokens.refreshToken);

    // Check if token is revoked
    const isRevoked = isTokenRevoked(tokens.refreshToken);

    // Refresh token
    const newTokens = refreshToken(
        tokens.refreshToken,
        'refreshSecretKey',
        payload => payload,
        {
            payload: { userId: 1 },
            secret: 'secretKey',
            options: { expiresIn: '1h' }
        }
    );

## Contributing

Contributions, issues, and feature requests are welcome!

## License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.
