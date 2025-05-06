import mongoose from "mongoose";

// Define the schema for the video model
// This schema defines the structure of the video documents in the MongoDB collection
// Each video document will have a youtubeid, title, description, thumbnail, status, and a reference to the parent document
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