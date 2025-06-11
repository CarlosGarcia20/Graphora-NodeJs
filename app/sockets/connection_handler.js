import { compareSync } from "bcrypt";
import { DiagramModel } from "../models/diagram.model.js";
import { InvitationModel } from "../models/invitation.model.js";
import { UserModel } from "../models/users.models.js";

const emailSockets = new Map();

export function setupSocketConnections(io) {
    io.emailSockets = emailSockets

    io.on('connection', (socket) => {
        const email = socket.handshake.auth?.email

        if (email) {
            emailSockets.set(email, socket.id)
            console.log(`✅ Usuario con correo ${email} conectado (socket: ${socket.id})`)
        }

        socket.on('send-invitation', async ({ userId, diagramId, InvitedUserEmail }) => {
            try {
                const invitationData = await InvitationModel.sendInvitation({ userId, diagramId, InvitedUserEmail })

                const userData = await UserModel.getUserById({ userId })
                const diagramData = await DiagramModel.getDiagramInfo({ userId, diagramId })
                const socketId = emailSockets.get(InvitedUserEmail)
                if (socketId) {
                    io.to(socketId).emit('invitation', {
                        id: invitationData.data.id,
                        diagramId: diagramData.data.id
                        from: `${userData.data.name} ${userData.data.lastname}`,
                        email: InvitedUserEmail,
                        message: `Has sido invitado a colaborar en el diagrama ${diagramData.data.name}`
                    })

                    console.log(`📨 Invitación emitida a ${InvitedUserEmail}`);
                } else {
                    console.log(`ℹ️ El usuario con correo ${InvitedUserEmail} no está conectado`);
                }
            } catch (error) {
                console.log(error)
            }
        })

        socket.on('disconnect', () => {
            if (email) {
                emailSockets.delete(email);
                console.log(`🔴 Usuario con correo ${email} desconectado`);
            }
        });
    })
}