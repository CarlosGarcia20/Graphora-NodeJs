import jwt from "jsonwebtoken";
import config from "../config/config.js";
import pool from "../config/db.js";

export class tokenService {
    // Genera tokens de acceso y actualización
    static generateTokens(userData) {
        const accessToken = jwt.sign(
            {
                iduser: userData.userId
            }, 
            config.jwtSecret, { 
                expiresIn: config.jwtExpiresIn 
            }
        );

        const refreshToken = jwt.sign(
            {
                iduser: userData.iduser
            },
            config.jwtRefreshSecret, { 
                expiresIn: config.jwtRefreshExpiresIn 
            }
        );

        return { accessToken, refreshToken };
    }

    static async storeRefreshToken(userId, token) {
        // Guardar el token de actualización en la base de datos o en la memoria
        await pool.query(`
            INSERT INTO refresh_tokens (token, userid, expiresAt)
            VALUES ($1, $2, NOW() + INTERVAL '${config.jwtRefreshExpiresIn}')`,
            [
                token,
                userId
            ]
        );
    }
    
    static async removeRefreshToken(token) {
        await pool.query(`
            DELETE FROM refresh_tokens WHERE token = $1`,
            [ token ]
        );
    }

    static async isValidRefreshToken(token) {
        const result = await pool.query(`
            SELECT 1 FROM refresh_tokens 
            WHERE token = $1 AND expiresat > NOW()`,
            [ token ]
        );
        return result.rows[0];
    }
}