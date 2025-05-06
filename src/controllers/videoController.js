import Video from "../models/VideoModel.js";
import Parent from "../models/ParentModel.js"


//this function is used to register a video
export const registerVideo = async (req, res) => {
    try {
        const { youtubeid, title, description, thumbnail, status } = req.body;
        const parentFound = await Parent.findById(req.parent.id)
        if (!youtubeid || !title || !description || !thumbnail) {
            return res.status(400).json(["Todos los campos son obligatorios"]);
        }
        const videoExist = await Video.findOne({ youtubeid })
        if (videoExist) {
            videoExist.status = status;
            await videoExist.save();

            return res.status(200).json({ message: "El video se ha reactivado", video: videoExist });
        }
        const NewVideo = new Video({
            youtubeid,
            title,
            description,
            status,
            thumbnail,
            parent: req.parent.id
        })
        const VideoSaved = await NewVideo.save()
        parentFound.videos.push(VideoSaved._id);
        await parentFound.save();
        res.status(201).json({ message: 'video agregado correctamente', video: VideoSaved });
    } catch (error) {
        console.error("Error al agregar o reactivar el video:", error);
        res.status(500).json({ message: 'Error al agregar el video', error });
    }
}

//This function is used to get all videos
export const getAllVideo = async (req, res) => {
    try {
        const status = "enable"
        const videoExist = await Video.find({ status })
        if (!videoExist) return res.status(400).json(["Ningun video encontrado"])
        res.json(videoExist);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al encontrar el video', error });
    }
}

//This function is used to get a video by id
export const getOneVideo = async (req, res) => {
    try {
        console.log(req.query)
        const { youtubeid } = req.query;
        const videoFound = await Video.findOne({ youtubeid })
        if (!videoFound) {
            return res.status(400).json(["Ningun video encontrado"])
        }
        res.status(200).json(videoFound);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al encontrar el video', error });
    }
}

//This function is used to disable a video
export const disableVideo = async (req, res) => {
    try {
        const { youtubeid } = req.body;
        const videoFound = await Video.findOne({ youtubeid })
        if (!videoFound) {
            return res.status(400).json(["Ningun video encontrado"])
        }

        videoFound.status = "disable"
        const disableVideo = await videoFound.save();
        res.json({ message: "se desactivo el siguiente video", video: disableVideo })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al desactivar el video', error });
    }
}

//This function is used to update a video
export const updateVideo = async (req, res) => {
    try {
        const { youtubeid } = req.query
        const { title, description } = req.body;

        const videoFound = await Video.findOneAndUpdate({ youtubeid },
            { title, description },
            { new: true }
        )
        if (!videoFound) {
            return res.status(400).json(["Ningun video encontrado"])
        }

        res.status(200).json({ message: "Video actualizado correctamente", video: videoFound });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al desactivar el video', error });
    }
}