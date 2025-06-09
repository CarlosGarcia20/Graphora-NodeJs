import { EmailModel } from "../models/email.model.js"
import { sendInvitation } from "../services/emailService.js"

export class EmailController {
    static async sendEmail(req, res) {
        try {
            const { email, name_diagram } = req.body;

            const result = await EmailModel.searchEmail({ email });

            if (!result.success) {
                try {
                    await sendInvitation(email, "", name_diagram);
                    return res.status(200).json({ mensaje: 'Invitación enviada con éxito.' });
                } catch (error) {
                    console.error('Error al enviar correo:', error);
                    return res.status(500).json({
                        message: "Error al enviar el correo.",
                        error: error.message
                    });
                }
            }

            // Si encontró el usuario
            try {
                await sendInvitation(
                    result.data.email,
                    `${result.data.name} ${result.data.lastname}`,
                    name_diagram
                );
                return res.status(200).json({ mensaje: 'Invitación enviada con éxito.' });
            } catch (error) {
                console.error('Error al enviar correo:', error);
                return res.status(500).json({
                    message: "Error al enviar el correo de invitación",
                    error: error.message
                });
            }

        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
                error: error.message
            });
        }
    }
}
