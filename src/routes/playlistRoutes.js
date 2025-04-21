import express from 'express'
import { authRequired } from '../middlewares/validateToken.js';
import { addVideoToPlaylist, assignPlaylistToChild, createPlaylist, deletePlaylist, getAllPlaylist, getOnePlaylist, removeVideoFromPlaylist, updatePlaylist } from '../controllers/playlistController.js';

const router = express.Router();

router.get("/allplaylist",authRequired,getAllPlaylist);

router.post("/playlist",authRequired,createPlaylist);
router.get("/playlist",authRequired,getOnePlaylist);
router.delete("/playlist",authRequired,deletePlaylist);
router.put("/playlist",authRequired,updatePlaylist)
router.put("/addvideo/playlist",authRequired,addVideoToPlaylist);
router.put("/removevideo/playlist",authRequired,removeVideoFromPlaylist);
router.put("/assignPlaylist",authRequired,assignPlaylistToChild)

export default router;