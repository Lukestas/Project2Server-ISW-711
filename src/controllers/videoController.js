import Video from "../models/VideoModel.js";


export const registerVideo = async (req, res) => {
    try {
        const { name, URL, description } = req.body;
        const status="enable"
        if (!name || !URL || !description) {
            return res.status(400).json(["Todos los campos son obligatorios"]);
        }
        const urlExist = await Video.findOne({ URL })
        if (urlExist) {
            urlExist.status = status;
            await urlExist.save();

            return res.status(200).json({ message: "El video se ha reactivado", video: urlExist });
        }
        const NewVideo = new Video({
            name,
            URL,
            description,
            status
        })
        const VideoSaved = await NewVideo.save()
        res.status(201).json({ message: 'video agregado correctamente', video: VideoSaved });
    } catch (error) {
        console.error("Error al agregar o reactivar el video:", error);
        res.status(500).json({ message: 'Error al agregar el video', error });
    }
}

export const getVideos = async (req, res) => {
    try {
        const name = req.body.name;
        const videoExist = await Video.find({ name })
        if (!videoExist || videoExist.length === 0) {
            return res.status(404).json(["Ningun video con dicho nombre"]);
        }
        res.json(videoExist);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al encontrar el video', error });
    }
}

export const getOneVideo= async (req,res)=>{
    try {
        const videoFound=await Video.findById(req.query.id)
        if(!videoFound){
            return res.status(404).json(["Ningun video encontrado"]);
        }
        res.json(videoFound)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al encontrar el video', error });
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

export const disableVideo = async (req, res) => {
    try {
        const videoFound = await Video.findById(req.body.videoId)
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