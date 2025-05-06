import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const apiKey = process.env.YOUTUBE_API_KEY;

//This function is used to search for videos on YouTube using the YouTube Data API v3.
// It takes a search term from the request query and returns a list of videos that match the search term.
export const youtubeSearch = async (req, res) => {
    try {
        const { search } = req.query;
        
        if (!search) {
            return res.status(400).json(["Debe ingresar un término de búsqueda"]);
        }
        const YoutubeResquest = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: search,
                type: 'video',
                key: apiKey,
                maxResults: 5
            }
        });
        const videosFound = YoutubeResquest.data.items.map((video) => ({
            id: video.id.videoId,
            title: video.snippet.title,
            description: video.snippet.description,
            thumbnail: video.snippet.thumbnails.high.url
        }));

        res.status(200).json(videosFound);
    } catch (error) {
        console.error(error);
        return res.status(500).json(["Error al buscar videos en YouTube"]);
    }
}
