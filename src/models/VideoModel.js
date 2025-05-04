import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    youtubeid: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    status: { type: String, required: true },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'parents',
        required: true
    }
}, { timestamps: true })

export default mongoose.model("videos", videoSchema)