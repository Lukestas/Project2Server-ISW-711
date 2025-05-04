import Video from "../models/VideoModel.js";

export const registerVideo = async (req, res) => {
    try {
        const { youtubeid, title, description, thumbnail, status } = req.body;
        console.log(req.body)
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
        res.status(201).json({ message: 'video agregado correctamente', video: VideoSaved });
    } catch (error) {
        console.error("Error al agregar o reactivar el video:", error);
        res.status(500).json({ message: 'Error al agregar el video', error });
    }
}

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

export const getOneVideo = async (req, res) => {
    try {
        console.log(req.query)
        const { youtubeid } = req.query;
        const videoFound = await Video.findOne({youtubeid})
        if (!videoFound) {
            return res.status(400).json(["Ningun video encontrado"])
        }
        res.status(200).json(videoFound);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al encontrar el video', error });
    }
}

export const disableVideo = async (req, res) => {
    try {
        const { youtubeid } = req.body;
        const videoFound = await Video.findOne({youtubeid})
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

export const updateVideo = async (req, res) => {
    try {
        const { name, URL, description } = req.body;

        const videoFound = await Video.findById(req.query.id)
        if (!videoFound) {
            return res.status(400).json(["Ningun video encontrado"])
        }

        videoFound.name = name || videoFound.name;
        videoFound.URL = URL || videoFound.URL;
        videoFound.description = description || videoFound.description;
        videoFound.status = "enable"

        const updatedVideo = await videoFound.save();
        res.json({ message: "se actualizo el siguiente video", video: updatedVideo })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al desactivar el video', error });
    }
}