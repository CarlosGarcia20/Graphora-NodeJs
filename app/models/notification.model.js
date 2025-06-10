import pool from "../config/db.js";

export class NotificationModel {
    static async saveNotification({ userId, message }) {
        const { rowCount } = await pool.query(
            `INSERT INTO notifications (user_id, message, read, created_at) 
            VALUES ($1, $2, false, NOW())
            RETURNING *`,
            [ userId, message ]
        )

        if (rowCount === 0) {
            throw new Error("No se pudo guardar la notificación");
        }
    }
}