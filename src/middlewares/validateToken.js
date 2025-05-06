import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET;

//This middleware checks if the user is authenticated by verifying the JWT token
export const authRequired = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ message: "No existen token, acceso denegado" })
    }
    jwt.verify(token, TOKEN_SECRET, (err, parent) => {
        if (err) {
            return res.status(403).json({ message: "Token invalido" })
        }
        req.parent = parent
        next();
    })
}
