import Parent from '../models/ParentModel.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import moment from 'moment';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET;

export const registerParent = async (req, res) => {

    const { email, password, repeatPassword, phone, pin, firstName, lastName, country, birthDate } = req.body;

    try {

        if (!email || !password || !repeatPassword || !phone || !pin || !firstName || !lastName || !birthDate) {
            return res.status(400).json(["Todos los campos son obligatorios"]);
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json(["Correo electrónico inválido"]);
        }

        if (password !== repeatPassword) {
            return res.status(400).json(["Las contraseñas no coinciden"])
        }

        if (pin.length !== 6 || isNaN(pin)) {
            return res.status(400).json(["El pin debe ser exactamente de 6 digitos numericos"])
        }

        const emailExist = await Parent.findOne({ email })
        if (emailExist) {
            return res.status(400).json(["El correo electronico ingresado ya se encuentra registrado"])
        }

        const age = moment().diff(moment(birthDate, "DD-MM-YYYY"), "years");
        if (age <= 18) {
            return res.status(400).json(["Debe ser mayor de edad para registrarse"])
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newParent = new Parent({
            email,
            password: hashedPassword,
            phone,
            pin,
            firstName,
            lastName,
            country,
            birthDate
        });

        const savedParent = await newParent.save()

        const token = await createAccessToken({ id: savedParent._id })
        res.status(200);
        res.cookie("token", token);
        res.header({
            'location': `/api/auth/parent?id=${savedParent._id}`
        });
        res.json(savedParent)
    } catch (error) {
        console.error(error);
        res.status(500).json(["Error interno del servidor"]);
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
