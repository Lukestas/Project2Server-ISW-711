import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "videos"
    }],
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'parents',
        required: true
    }
}, { timestamps: true })

export default mongoose.model("playlists", playlistSchema)