import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config();

const MONGOURI = process.env.MONGO_URI

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGOURI)
        console.log("Conectado a MongoDB")
    } catch (error) {
        console.error("Fallo la conexion a MongoDB:", error)
    }
}