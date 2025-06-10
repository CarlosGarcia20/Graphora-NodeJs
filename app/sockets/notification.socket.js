import { NotificationModel } from "../models/notification.model.js";

export function setupNotificationSocket(io, socket) {
    socket.on("new-notification", async (data) => {
        try {
            const saveNotification = await NotificationModel.saveNotification(data)
            socket.broadcast.emit("receive-notification", saveNotification)
        } catch (error) {
            console.error("Error al guardar la notificación: ", error);
        }
    })
}