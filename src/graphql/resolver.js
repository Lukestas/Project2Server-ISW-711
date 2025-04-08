import PlayList from "../models/PlayListModel.js"
import Video from "../models/VideoModel.js"
import Parent from "../models/ParentModel.js"
import Child from "../models/ChildModel.js"

export const graphqlResolvers = {
    videoList: async () => {
        const videosList = await Video.find()
        return videosList
    },
    playLists: async () => {
        const list = await PlayList.find().populate("videos")
        return list;
    },
    parentList: async () => {
        const parentList = await Parent.find()
            .populate({
                path: "children",
                populate: {
                    path: "playlists",
                    populate: {
                        path: "videos"
                    }
                }
            })
            .populate("playlists")
        return parentList;
    },
    childrenList: async () => {
        const childrenList = await Child.find()
            .populate("parent")
            .populate("playlists");
        return childrenList
    }
}