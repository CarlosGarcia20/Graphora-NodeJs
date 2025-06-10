import pool from "../config/db.js";

export class InvitationModel {
    static async sendInvitation({ userId, diagramId, InvitedUserEmail }) {
        try {
            const { rowCount } = await pool.query(
                `INSERT INTO diagram_invitations
                (diagram_id, invited_user_email, invited_by_user_id)
                VALUES ($1, $2, $3)`,
                [
                    diagramId,
                    InvitedUserEmail,
                    userId
                ]
            )

            console.log(rowCount)

            const { rows } = await pool.query(
                `SELECT name, lastname FROM users
                WHERE userid = $1`,
                [userId]
            )
            
            return { success: true, data: rows[0] }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
}