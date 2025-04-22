import mongoose from "mongoose";

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
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
}, { timestamps: true });

export default mongoose.model('parents', parentsSchema);