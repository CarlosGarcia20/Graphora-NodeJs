import { InvitationModel } from "../models/invitation.model.js";

export class InvitationController {
    static async sendInvitation(req, res) {
        const userId = req.user.userId
        const { diagramId, invitedUserIds } = req.body;

        if (!diagramId || !Array.isArray(invitedUserIds)) {
            return res.status(400).json({ error: 'Datos incompletos' });
        }

        try {
            const result = await InvitationModel.sendInvitation({ userId, diagramId, invitedUserIds })
        } catch (error) {
            
        }
    }
}