import jwt from "jsonwebtoken";
import config from "../config/config.js";
import pool from "../config/db.js";

export class tokenService {
    // Genera tokens de acceso y actualización
    static generateTokens(userData) {
        const accessToken = jwt.sign(
            {
                userId: userData.userId
            }, 
            config.jwtSecret, { 
                expiresIn: config.jwtExpiresIn 
            }
        );

        const refreshToken = jwt.sign(
            {
                userId: userData.userId
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
            INSERT INTO refresh_tokens (token, userid, expiresat)
            VALUES ($1, $2, NOW() + INTERVAL '${config.jwtRefreshExpiresIn}')`,
            [
                token,
                userId
            ]
        );
    }
    
    static async removeRefreshToken(token) {
        const { rows } = await pool.query(`
            DELETE FROM refresh_tokens WHERE token = $1 RETURNING *`,
            [ token ]
        );

        return rows[0]
    }

    static async isValidRefreshToken(token) {
        const { rows } = await pool.query(`
            SELECT * FROM refresh_tokens 
            WHERE token = $1 AND expiresat > NOW()`,
            [ 
                token 
            ]
        );

        if (rows.length === 0) {
            return false;
        }

        return rows[0]
       
    }
}