import pool from "../../config/db.js";

export class LoginModel {
    login = async(email) => {
        const { rows } = await pool.query(
            `SELECT *
            FROM users WHERE email = $1`,
            [ email ]
        );

        if (rows.length === 0) {
            return { success: false }
        }

        return { success: true, data: rows[0] };
    }
}