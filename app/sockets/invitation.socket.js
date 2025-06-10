import { InvitationModel } from "../models/invitation.model.js";

export function setupInvitationSocket(io, socket) {
    socket.on("new-notification", async (data) => {
        try {
            const saveNotification = await InvitationModel.saveNotification(data)
            socket.broadcast.emit("receive-notification", saveNotification)
        } catch (error) {
            console.error("Error al guardar la notificación: ", error);
        }
    })
}