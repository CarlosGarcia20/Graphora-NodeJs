import { compareSync } from "bcrypt";
import { DiagramModel } from "../models/diagram.model.js";
import { InvitationModel } from "../models/invitation.model.js";
import { UserModel } from "../models/users.models.js";
import { InvitationStatus } from "../constants/invitationStatus.js";

const emailSockets = new Map();

export function setupSocketConnections(io) {
    io.emailSockets = emailSockets

    io.on('connection', async (socket) => {
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
                        diagramId: diagramData.data.template_id,
                        diagramName: diagramData.data.name,
                        from: `${userData.data.name} ${userData.data.lastname}`,
                        email: InvitedUserEmail,
                        message: `Has sido invitado a colaborar en el diagrama ${diagramData.data.name}`,
                        status: invitationData.data.status
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

        socket.on('get-pending-invitations', async ({ email }) => {
            try {
                const invitations = await InvitationModel.recoveredInvitations({ email });

                for (const invitation of invitations) {
                    const fromUser = await UserModel.getUserById({ userId: invitation.invited_by_user_id });
                    const diagram = await DiagramModel.getDiagramInfo({
                        userId: invitation.invited_by_user_id,
                        diagramId: invitation.diagram_id
                    });

                    socket.emit('invitation', {
                        id: invitation.id,
                        diagramId: diagram.data.template_id,
                        diagramName: diagram.data.name,
                        from: `${fromUser.data.name} ${fromUser.data.lastname}`,
                        email: invitation.invited_user_email,
                        message: `Has sido invitado a colaborar en el diagrama ${diagram.data.name}`,
                        status: invitation.status
                    });
                }
            } catch (error) {
                console.log('❌ Error al recuperar invitaciones:', error);
            }
        });

        socket.on('accept-invitation', async ({ invitationId }) => {
            try {
                await InvitationModel.updateStatus({ id: invitationId, status: 'A' });
                socket.emit('invitation-updated', { id: invitationId, status: 'A' });
            } catch (error) {
                console.error('❌ Error al aceptar invitación:', error);
            }
        });

        socket.on('decline-invitation', async ({ invitationId }) => {
            try {
                await InvitationModel.updateStatus({ id: invitationId, status: 'D' });
                socket.emit('invitation-updated', { id: invitationId, status: 'D' });
            } catch (error) {
                console.error('❌ Error al rechazar invitación:', error);
            }
        });
    })
}