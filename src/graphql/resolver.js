import PlayList from "../models/PlayListModel.js"
import Video from "../models/VideoModel.js"
import Parent from "../models/ParentModel.js"
import Child from "../models/ChildModel.js"


// Resolver functions for GraphQL queries and mutations
// These functions interact with the database models to fetch or manipulate data
// and return the results to the GraphQL server.
// Each function corresponds to a specific GraphQL query or mutation defined in the schema
export const graphqlResolvers = {
    videoList: async () => {
        const videosList = await Video.find().populate("parent")
        console.log(videosList)
        return videosList
    },

    getVideoById: async({youtubeid})=>{
        const video= await Video.findOne({youtubeid})
        return video;
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

    getParentById: async ({ id }) => {
        const parent = await Parent.findById(id)
            .populate({
                path: "children",
                populate: {
                    path: "playlists",
                    populate: {
                        path: "videos",
                        match: { status: { $ne: "disable" } }
                    }
                }
            })
            .populate("playlists")
            .populate({
                path: "videos",
                match: { status: { $ne: "disable" } },
            })
        return parent
    },


    childrenList: async () => {
        const childrenList = await Child.find()
            .populate("parent")
            .populate("playlists");
        return childrenList
    },
    
    getChildById: async ({ id }) => {
        const child = await Child.findById(id)
            .populate("parent")
            .populate({
                path: "playlists",
                populate: {
                    path: "videos", 
                    match: { status: { $ne: "disable" } },
                },
            });
        return child
    }
}
