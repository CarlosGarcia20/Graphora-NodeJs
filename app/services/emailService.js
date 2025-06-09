import nodemailer from 'nodemailer'
import 'dotenv/config';
import { subset } from 'semver';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    }
});

export const sendInvitation = async (email, name, name_diagram) => {
    const mailOptions = {
        from: `${process.env.EMAIL_USER}`,
        to: email,
        subject: `Invitación para participar en el diagrama ${name_diagram}`,
        html: `
            <p>Hola ${name}, has sido invitado para participar en la elaboración del diagrama <strong>${name_diagram}</strong>.</p>
            <p>Haz clic en este enlace para unirte:</p>
            <a href=''>Unirme</a>
        `
    }

    return transporter.sendMail(mailOptions)
}