import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    URL: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    status: { type: String, required: true }
},{ timestamps: true })

export default mongoose.model("videos",videoSchema)