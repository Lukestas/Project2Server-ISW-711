import Parent from "../models/ParentModel.js";

export const smsVerificationRequired = async (req, res, next) => {
    try {
        const parent = await Parent.findById(req.parent.id);
        console.log(parent)
        if (!parent || !parent.isSMSVerified) {
            return res.status(403).json({ message: "Acceso denegado. Verificación SMS requerida." });
        }
        next();
    } catch (error) {
        console.error("Error al verificar SMS:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};