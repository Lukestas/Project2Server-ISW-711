import { buildSchema } from "graphql";

export const graphQLschema = buildSchema(
    `
    type Query{
        videoList: [Video]
        playLists: [Playlist]
        parentList: [Parent]
        childrenList: [Child]
    }

    type Video{
        _id: ID
        name: String!
        URL: String!
        description: String!
    }

    type Playlist{
        _id: ID
        name: String!
        videos:[Video]
    }

    type Parent{
        _id: ID
        email: String!
        firstName: String
        lastName: String
        country: String
        phone: String
        pin: String
        birthDate: String
        children:[Child]
        playlists:[Playlist]
    }
    
    type Child{
        _id: ID
        name: String
        pin: String
        avatar: String
        parent: Parent
        playlists: [Playlist]
    }
    `
)
