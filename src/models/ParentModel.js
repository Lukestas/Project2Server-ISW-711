import mongoose from "mongoose";

// Parent model schema
// This schema defines the structure of the parent documents in the MongoDB collection
// It includes fields for email, password, phone, pin, first name, last name, country, birth date, children, playlists, videos, verification status, and verification token
const parentsSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    pin: { type: String, required: true, minlength: 6, maxlength: 6 },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    country: { type: String, default: "No especificado" },
    birthDate: { type: Date, required: true },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "children"
    }],
    playlists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "playlists"
    }],
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "videos"
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    isSMSVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model('parents', parentsSchema);