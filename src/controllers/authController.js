import Parent from '../models/ParentModel.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import moment from 'moment';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { generateVerificationToken } from '../middlewares/tokenUtils.js';
import { sendVerificationEmail } from '../mailersend/mailersend.js';

dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET;


//This function is used to register a new parent in the database
export const registerParent = async (req, res) => {
    //get all element's needed to register a parent
    const { email, password, repeatPassword, phone, pin, firstName, lastName, country, birthDate } = req.body;

    try {
        //check if all fields are filled
        if (!email || !password || !repeatPassword || !phone || !pin || !firstName || !lastName || !birthDate) {
            return res.status(400).json(["Todos los campos son obligatorios"]);
        }

        //check if the phone number is valid
        const phoneRegex = /^\+506\d{8}$/; // Assuming a 8-digit phone number
        if (!phoneRegex.test(phone)) {
            return res.status(400).json(["Número de teléfono inválido"]);
        }

        //check if the email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json(["Correo electrónico inválido"]);
        }

        //check if password and repeatPassword are the same
        if (password !== repeatPassword) {
            return res.status(400).json(["Las contraseñas no coinciden"])
        }

        //check if password is empty or less than 6 characters
        if (pin.length !== 6 || isNaN(pin)) {
            return res.status(400).json(["El pin debe ser exactamente de 6 digitos numericos"])
        }

        //check if email already exists in the database
        const emailExist = await Parent.findOne({ email })
        if (emailExist) {
            return res.status(400).json(["El correo electronico ingresado ya se encuentra registrado"])
        }

        //check if age is less than 18 years old
        const age = moment().diff(moment(birthDate, "DD-MM-YYYY"), "years");
        if (age <= 18) {
            return res.status(400).json(["Debe ser mayor de edad para registrarse"])
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        const { token: verificationToken, expiresAt: verificationTokenExpires } =
            generateVerificationToken();

        //create a new parent using the Parent model
        const newParent = new Parent({
            email,
            password: hashedPassword,
            phone,
            pin,
            firstName,
            lastName,
            country,
            birthDate,
            isVerified: false,
            verificationToken,
            verificationTokenExpires
        });

        //save the new parent in the database
        const savedParent = await newParent.save()
        await sendVerificationEmail({
            email: savedParent.email,
            firstName: savedParent.firstName,
            verificationToken: savedParent.verificationToken
        });
        //create a new token for the new parent
        const token = await createAccessToken({ id: savedParent._id })

        res.status(200);//set status to 200
        res.cookie("token", token);//set the token in a cookie
        res.header({ 'location': `/api/auth/parent?id=${savedParent._id}` });//set the location header to the new parent
        res.json(savedParent)////send the new parent as a response
        
    } catch (error) {
        //send an error message if something goes wrong
        console.error(error);
        res.status(500).json(["Error interno del servidor"]);
    }
}

export const verifyEmail = async (req, res) => {
    console.log("Solicitud de verificación recibida. Query params:", req.query);
    const { token } = req.query;

    try {
        const parent = await Parent.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!parent) {
            return res.status(400).json("Token inválido o expirado");
        }

        parent.isVerified = true;
        parent.verificationToken = undefined;
        parent.verificationTokenExpires = undefined;
        await parent.save();

        res.status(200).json({
            message: "Correo verificado exitosamente",
            parent: {
                id: parent._id,
                email: parent.email,
                isVerified: parent.isVerified
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json("Error interno del servidor");
    }
}

export const login = async (req, res) => {

    const { email, password } = req.body;

    try {

        const parentFound = await Parent.findOne({ email });
        if (!parentFound) {
            res.status(400)
            res.json(["El padre no se encontro en la base de datos"
            ])
            return res;
        }

        const isMatch = await bcrypt.compare(password, parentFound.password);
        if (!isMatch) {
            res.status(400)
            res.json(["Contraseña incorrecta"])
            return res;
        }

        const token = await createAccessToken({ id: parentFound._id })
        res.cookie("token", token)
        res.json(`Bienvenido ${parentFound.firstName} ${parentFound.lastName}`)
    } catch (error) {
        res.status(500)
        res.json({
            message: error.message
        })
    }
}

export const logout = (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0)
    })
    return res.sendStatus(200)
}

export const verifyToken = async (req, res) => {
    const { token } = req.cookies
    if (!token) {
        return res.status(401).json(["No autorizado"])
    }
    jwt.verify(token, TOKEN_SECRET, async (err, parent) => {
        if (err) {
            return res.status(401).json({ message: "Token inválido o expirado" });
        }
        const parentFound = await Parent.findById(parent.id);
        if (!parentFound) {
            return res.status(401).json(["No autorizado"]);
        }
        return res.json([parentFound])
    })
}

export const getParent = async (req, res) => {
    try {
        const parentFound = await Parent.findById(req.parent.id);
        if (!parentFound) return res.status(404).json(["Padre no encontrado"]);
        res.json(parentFound);
    } catch (error) {
        res.status(500).json(["back: Error al obtener los hijos"]);
    }
};
