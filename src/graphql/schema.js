import { buildSchema } from "graphql";

export const graphQLschema = buildSchema(
    `
    type Query{
        videoList: [Video]
        playLists: [Playlist]
        parentList: [Parent]
        childrenList: [Child]
        getParentById(id: ID!): Parent
        getChildById(id: ID!): Child
        getVideoById(youtubeid: String): Video
    }

    type Video{
        _id: ID
        youtubeid: String!
        title: String
        description: String
        thumbnail: String
        parent: Parent
        status: String
    }

    type Playlist{
        _id: ID!
        name: String
        videos:[Video]
    }

    type Parent{
        _id: ID!
        email: String
        firstName: String
        lastName: String
        country: String
        phone: String
        pin: String
        birthDate: String
        children:[Child]
        playlists:[Playlist]
        videos:[Video]
    }
    
    type Child{
        _id: ID!
        name: String
        pin: String
        avatar: String
        parent: Parent
        playlists: [Playlist]
    }
    `
)
