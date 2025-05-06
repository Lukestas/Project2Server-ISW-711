import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import dotenv from "dotenv";

dotenv.config();

const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
});

const sentFrom = new Sender(process.env.MAILERSEND_SENDER_EMAIL, process.env.MAILERSEND_SENDER_NAME);

//Send a verification email to the user
//The email will contain a link to verify the user's email address
//Use the library mailersend to send the email
export const sendVerificationEmail = async ({ email, firstName, verificationToken }) => {
    const verificationUrl = `http://localhost:5173/verify-email?token=${verificationToken}`;

    const recipients = [new Recipient(email, firstName)];

    try {
        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject("Verifica tu cuenta de KidsTube")
            .setHtml(`
            <h1>Bienvenido ${firstName || "Usuario"} a KidsTube</h1>
            <p>Por favor verifica tu email haciendo clic aquí:</p>
            <a href="${verificationUrl}">Verificar ahora</a>
            <p>Enlace válido por 24 horas</p>
          `)
            .setText(
                `Verifica tu cuenta: ${verificationUrl}`
            );
        console.log("[DEBUG] Parámetros del email:", emailParams);
        const response = await mailerSend.email.send(emailParams);
        console.log("[DEBUG] Email enviado con éxito");
        return response;

    } catch (error) {
        // Captura detallada de errores
        console.error("[ERROR] Detalles completos:", {
            message: error.message,
            code: error.code,
            response: error.response?.data,
            stack: error.stack,
            
        });

        throw new Error("Error al enviar el email. Por favor intente más tarde.");
    }
};

