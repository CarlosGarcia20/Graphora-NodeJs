import jwt from "jsonwebtoken";
import config from "../config.js";

let refreshTokens = [];

export const tokenService = {
    generateToken(userData) {
        const accessToken = jwt.sign(userData, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
        const refreshToken = jwt.sign(userData, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiresIn });
        return { accessToken, refreshToken };
    },

    storeRefreshToken(token) {
        refreshTokens.push(token)
    },

    removeRefreshToken(token) {
        refreshTokens = refreshTokens.filter(token => token !== token);
    },

    isValidRefreshToken(token) {
        return refreshTokens.includes(token);
    }
}