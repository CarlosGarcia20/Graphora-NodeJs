import pool from "../config/db.js";

export class EmailModel {
    static async searchEmail({ email }) {
        try {
            const { rows } = await pool.query(
                `SELECT email, name, lastname FROM users 
                WHERE email = $1`, 
                [email]
            );

            return rows.length > 0 ? { success: true, data: rows[0] } :
            { success: false, error: "Usuario no encontrado" };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}