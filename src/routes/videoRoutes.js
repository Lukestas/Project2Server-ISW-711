import express from 'express'

import { authRequired } from "../middlewares/validateToken.js"
import { disableVideo, getAllVideo, getOneVideo, registerVideo, updateVideo } from '../controllers/videoController.js';
import { youtubeSearch } from '../youtube/youtube.js';

const router = express.Router();

router.get("/allvideos", authRequired, getAllVideo)

router.post("/video", authRequired, registerVideo);
router.put("/video", authRequired, updateVideo)

router.get("/video", authRequired, getOneVideo)

router.put("/disablevideo", authRequired, disableVideo)

router.get("/youtubesearch", authRequired, youtubeSearch)

export default router