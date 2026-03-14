import pool from "../../config/db.js";

export class tokenModel {
    saveUserToken = async({ userId, token, expiresAt }) => {
        await pool.query(
            `
            INSERT INTO refresh_tokens (token, userid, expires_at)
            VALUES ($1, $2, $3)
            `,
            [ token, userId, expiresAt ]
        );
    }

    findToken = async({ token }) => {
        const { rows } = await pool.query(
            `SELECT token FROM refresh_tokens
            WHERE token = $1`,
            [token]
        );

        if (rows.length === 0) {
            return { success: false, message: "No existe el token solicitado" }
        }

        return {
            success: true,
            token: rows[0].token
        }
    }
    
    revokeToken = async({ token }) => {
        await pool.query(
            `DELETE FROM refresh_tokens WHERE token = $1`,
            [token]
        );
    }
}