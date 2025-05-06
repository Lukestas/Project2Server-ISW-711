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
    console.log('Datos recibidos:', req.body);
    console.log('Email recibidos:', email);

    try {
        //check if all fields are filled
        if (!email || !password || !repeatPassword || !phone || !pin || !firstName || !lastName || !birthDate) {
            return res.status(400).json(["Todos los campos son obligatorios"]);
        }

        //check if the phone number is valid
        const phoneRegex = /^\d{8}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json(["El número de teléfono debe tener exactamente 8 dígitos"])
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
            phone: "+506" + phone,
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

        //send the verification email to the new parent
        await sendVerificationEmail({
            email: savedParent.email,
            firstName: savedParent.firstName,
            verificationToken: savedParent.verificationToken
        });

        res.status(200);//set status to 200
        res.header({ 'location': `/api/auth/parent?id=${savedParent._id}` });//set the location header to the new parent
        res.json(savedParent)////send the new parent as a response
        
    } catch (error) {
        //send an error message if something goes wrong
        console.error(error);
        res.status(500).json(["Error interno del servidor"]);
    }
}


//This function is used to verify the email of a parent
export const verifyEmail = async (req, res) => {
    //get the token from the query string
    const token  = req.query.token;

    try {

        //check if exist a parent with the token and if the token is not expired
        const parent = await Parent.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        //Mark the email as verified and remove the token and expiration date
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


//This function is used to Login a parent in the system
export const login = async (req, res) => {

    const { email, password } = req.body;

    try {
        const parentFound = await Parent.findOne({ email });
        if (!parentFound) {
            res.status(400)
            console.log('El padre no se encontro en la base de datos')
            res.json(["El padre no se encontro en la base de datos"])
            return res;
        }

        //Find the parent by email and check if the password is correct
        if(!parentFound.isVerified) {
            res.status(400)
            console.log('El correo no ha sido verificado')
            res.json(["El correo no ha sido verificado"])
            return res;
        }

        const isMatch = await bcrypt.compare(password, parentFound.password);
        if (!isMatch) {
            console.log('Contraseña incorrecta')
            res.status(400)
            res.json(["Contraseña incorrecta"])
            return res;
        }

        //create a token for the parent and set it in a cookie
        const token = await createAccessToken({ id: parentFound._id })
        res.cookie("token", token)
        res.json(parentFound)
    } catch (error) {
        res.status(500)
        res.json({
            message: error.message
        })
    }
}

//This function is used to logout a parent from the system
export const logout = async(req, res) => {
    const {id}=req.body
    await Parent.findByIdAndUpdate(id, { isSMSVerify: false });
    res.cookie("token", "", {
        expires: new Date(0)
    })
    return res.sendStatus(200)
}


//This function is used to verify if the token is valid and if the parent exists in the database
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

// Gets the parent's details
export const getParent = async (req, res) => {
    try {
        const parentFound = await Parent.findById(req.parent.id);
        if (!parentFound) return res.status(404).json(["Padre no encontrado"]);
        return res.json(parentFound);
    } catch (error) {
        res.status(500).json(["back: Error al obtener los hijos"]);
    }
};
