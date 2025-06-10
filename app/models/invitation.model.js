import pool from "../config/db.js";

export class InvitationModel {
    static async sendInvitation({ userId, diagramId, invitedUserIds }) {
        try {
            for (const invitedUserId of invitedUserIds) {
                await pool.query(
                    `INSERT INTO diagram_invitations
                    (diagram_id, invited_user_id, invited_by_user_id)
                    VALUES ($1, $2, $3)`,
                    [
                        diagramId,
                        invitedUserId,
                        userId
                    ]
                )
            }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
}