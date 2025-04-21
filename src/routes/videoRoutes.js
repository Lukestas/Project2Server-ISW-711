import express from 'express'

import { authRequired } from "../middlewares/validateToken.js"
import { disableVideo, getAllVideo, getOneVideo, getVideos, registerVideo, updateVideo } from '../controllers/videoController.js';

const router = express.Router();

router.get("/allvideos", authRequired, getAllVideo)
router.get("/videos", authRequired, getVideos)

router.post("/video", authRequired, registerVideo);
router.get("/video", authRequired, getOneVideo)
router.put("/video", authRequired, updateVideo)

router.put("/disablevideo", authRequired, disableVideo)

export default router