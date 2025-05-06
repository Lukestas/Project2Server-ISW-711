import Playlist from '../models/PlayListModel.js'
import Video from '../models/VideoModel.js';
import Child from '../models/ChildModel.js';
import Parent from '../models/ParentModel.js'

//This function is to create a playlist
export const createPlaylist = async (req, res) => {
    try {
        const { name } = req.body;
        const parentFound= await Parent.findById(req.parent.id);
        if (!name) {
            return res.status(400).json(["Se requiere un nombre para la playlist"]);
        }
        const newPlaylist = new Playlist({
            name,
            parent:parentFound.id
        })
        const playlistSaved = await newPlaylist.save();
        parentFound.playlists.push(playlistSaved._id)
        await parentFound.save()
        res.status(201).json(playlistSaved)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al crear la playlist', error });
    }
}
//This function is to assign a playlist to a child
export const assignPlaylistToChild = async (req, res) => {
    try {
        const childFound=await Child.findById(req.body.childId)
        
        const playlistFound=await Playlist.findById(req.body.playlistId)
        if(!childFound){
            return res.status(400).json(["Se requiere un niño para asignar la playlist"]);
        }
        if(!playlistFound){
            return res.status(400).json(["Se requiere una playlist para asignar"]);
        }
        childFound.playlists.push(playlistFound._id)
        await childFound.save();
        res.status(200).json({ message: "La playlist se asigno correctametne"});
    } catch (error) {
        res.status(500).json({ message: "Error al asignar la playlist", error: error.message });
    }
}
//This function is to get all the playlists
export const getAllPlaylist = async (req, res) => {
    try {
        const PlaylistsFound = await Playlist.find().populate("videos");
        if (!PlaylistsFound) {
            return res.status(404).json(["No se encontraron Playlist"]);
        }
        res.json(PlaylistsFound);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al obtener las playlists', error });
    }
}
//This function is to get one playlist with videos by id
export const getOnePlaylist = async (req, res) => {
    try {
        const playlistFound = await Playlist.findById(req.query.id).populate("videos");
        if (!playlistFound) {
            return res.status(404).json(["No se encontro la Playlist"]);
        }
        res.json(playlistFound);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al obtener las playlist', error });
    }
}
//This function is to delete a playlist by id
export const deletePlaylist = async (req, res) => {
    try {
        const playlistFound = await Playlist.findByIdAndDelete(req.body.playlistID);
        if (!playlistFound) {
            return res.status(404).json(["No se encontro la Playlist"]);
        }
        res.json({ message: "Playlist eliminada correctamente" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al obtener las playlist', error });
    }
}

//This function is to add a video to a playlist by id
export const addVideoToPlaylist = async (req, res) => {
    try {
        const {youtubeid}=req.body
        const videoFound = await Video.findOne({youtubeid})
        console.log(videoFound)
        const playlistFound = await Playlist.findById(req.query.id);
        if (!playlistFound) {
            return res.status(404).json(["No hay playlist al cual agregar este video"]);
        }
        if (!videoFound) {
            return res.status(404).json({ message: "No se encontró el video" });
        }
        if (playlistFound.videos.includes(videoFound.id)) {
            return res.status(400).json({ message: "El video ya está en la playlist" });
        }

        playlistFound.videos.push(videoFound.id);
        const playlistSaved = await playlistFound.save();
        res.status(200).json({ message: "Video agregado a la playlist", playlistSaved });
    } catch (error) {
        res.status(500).json({ message: "Error al agregar el video", error: error.message });
    }
}

//This function is to remove a video from a playlist by id
export const removeVideoFromPlaylist = async (req, res) => {
    try {
        const videoFound = await Video.findById(req.body.videoId)
        const playlistFound = await Playlist.findById(req.query.id)
        if (!videoFound) {
            return res.status(404).json({ message: "No se encontró el video" });
        }
        if (!playlistFound) {
            return res.status(404).json({ message: "No se encontró la playlist" });
        }
        if (!playlistFound.videos.includes(videoFound.id)) {
            return res.status(400).json({ message: "El video no está en la playlist" });
        }

        playlistFound.videos = playlistFound.videos.filter(video => video.toString() !== videoFound.id);

        const playlistSaved = await playlistFound.save();
        res.status(200).json({ message: "Video eliminado de la playlist", playlistSaved });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el video", error });
    }
}

//This function is to update a playlist by id
export const updatePlaylist = async (req, res) => {
    try {
        console.log(req.query.id)
        const name = req.body.name
        const playlistFound = await Playlist.findById(req.query.id)
        if (!playlistFound) {
            return res.status(404).json({ message: "No se encontró la playlist" });
        }
        playlistFound.name = name;
        const playlistSaved = await playlistFound.save();
        res.status(200).json({ message: "playlist actualizada", playlistSaved });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el playlist", error });
    }
}