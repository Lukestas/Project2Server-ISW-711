import mongoose from "mongoose"

const childSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pin: { type: String, required: true, minlength: 6, maxlength: 6 },
    avatar: { type: String, required: true },
    playlists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "playlists"
    }],
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'parents',
        required: true
    }
}, { timestamps: true })

export default mongoose.model('children', childSchema, 'children');