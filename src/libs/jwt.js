import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET;
//
if (!TOKEN_SECRET) {
    throw new Error("Falta la variable de entorno TOKEN_SECRET en el archivo .env")
}

//Generate a JWT token with a payload and a secret key
//The token will expire in 1 day
export async function createAccessToken(payload) {
    try {
        const token = await new Promise((resolve, reject) => {
            jwt.sign(payload, TOKEN_SECRET, { expiresIn: "1d" }, (err, token) => {
                if (err) reject(err);
                resolve(token);
            });
        });
        return token;
    } catch (error) {
        throw new Error("Error al generar el token: " + error.message);
    }
}