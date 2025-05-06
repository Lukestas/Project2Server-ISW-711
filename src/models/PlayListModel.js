import mongoose from "mongoose";

// Playlist schema
// This schema defines the structure of a playlist document in the MongoDB database
// It includes the name of the playlist, an array of video IDs, and a reference to the parent user
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