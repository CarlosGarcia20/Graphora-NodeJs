import { token } from "morgan";
import pool from "../../config/db.js";
import { mapPostgresError } from "./errors/postgresErrorMapper.js";

export class TokenModel {
    saveUserToken = async({ userId, token, expiresAt }) => {
        try {
            await pool.query(
                `
                INSERT INTO refresh_tokens (token, userid, expires_at)
                VALUES ($1, $2, $3)
                `,
                [ token, userId, expiresAt ]
            );
        } catch (error) {
            throw mapPostgresError(error)
        }
    }

    findToken = async({ token, userId }) => {
        const { rows } = await pool.query(
            `SELECT token, userid, expires_at
            FROM refresh_tokens
            WHERE token = $1 AND userid = $2 
            AND expires_at > NOW() `,
            [token, userId]
        );

        if (rows.length === 0) return { success: false }

        return { success: true, data: rows[0] }
    }
    
    revokeToken = async({ token }) => {
        await pool.query(
            `DELETE FROM refresh_tokens WHERE token = $1`,
            [token]
        );
    }

    revokeAllUserTokens = async({ userId }) => {
        await pool.query(
            `DELETE FROM refresh_tokens WHERE userid = $1`,
            [userId]
        )
    }

    rotateToken = async({ oldToken, newToken, userId, expiresAt }) => {
        const client = await pool.connect();

        try {
            await client.query('BEGIN')

            await client.query(
                `DELETE FROM refresh_tokens where token = $1`,
                [oldToken]
            )

            await client.query(
                `INSERT INTO refresh_tokens (token, userid, expires_at)
                VALUES ($1, $2, $3)`,
                [newToken, userId, expiresAt]
            )

            await client.query('COMMIT')
        } catch (error) {
           await client.query('ROLLBACK')
            throw mapPostgresError(error)
        } finally {
            client.release()
        }
    }
}