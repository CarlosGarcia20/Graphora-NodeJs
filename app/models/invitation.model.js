import pool from "../config/db.js";

export class InvitationModel {
    static async sendInvitation({ userId, diagramId, InvitedUserEmail }) {
        try {
            const { rows } = await pool.query(
                `INSERT INTO diagram_invitations
                (diagram_id, invited_user_email, invited_by_user_id)
                VALUES ($1, $2, $3)
                RETURNING *`,
                [
                    diagramId,
                    InvitedUserEmail,
                    userId
                ]
            )

            return { success: true, data: rows[0] }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    static async recoveredInvitations({ email }) {
        try {
            const { rows } = await pool.query(
                `SELECT * FROM diagram_invitations
                WHERE invited_user_email = $1 AND status = 'P'`,
                [email]
            )

            return rows;
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    static async updateStatus({ id, status }) {
        await pool.query(
            `UPDATE diagram_invitations SET status = $1 WHERE id = $2`,
            [status, id]
        );
    }
}