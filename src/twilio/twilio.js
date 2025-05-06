import twilio from "twilio";
import dotenv from "dotenv";
import Parent from "../models/ParentModel.js";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const apiKeySid = process.env.TWILIO_API_KEY_SID;
const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
const serviceSid = process.env.TWILIO_SERVICE_SID;

const client = twilio(apiKeySid, apiKeySecret, { accountSid });

export const sendVerificationCode = async (req, res) => {
    const { phone } = req.body;

    try {
        const verification = await client.verify.v2.services(serviceSid)
            .verifications.create({ to: phone, channel: "sms" });

        console.log({ message: "Código de verificación enviado", status: verification.status });
        res.status(200).json({ message: "Código de verificación enviado", status: verification.status });
    } catch (error) {
        console.error("Error al enviar el código de verificación:", error);
        res.status(500).json({ message: "Error al enviar el código de verificación", error: error.message });
    }
};

export const verifyCode = async (req, res) => {
    const { phone, code } = req.body;

    try {
        const verificationCheck = await client.verify.v2.services(serviceSid)
            .verificationChecks.create({ to: phone, code });

        if (verificationCheck.status === "approved") {
            const parent = await Parent.findOneAndUpdate(
                { phone },
                { isSMSVerified: true },
                { new: true }
            );
            res.status(200).json(verificationCheck.status);
        } else {
            res.status(400).json({ message: "Código incorrecto o expirado" });
        }
    } catch (error) {
        console.error("Error al verificar el código:", error);
        res.status(500).json({ message: "Error al verificar el código", error: error.message });
    }
};
