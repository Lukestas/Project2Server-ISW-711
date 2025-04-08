import { Router } from "express";
import { getParent, login, logout, registerParent, verifyToken } from "../controllers/authController.js";
import { authRequired } from "../middlewares/validateToken.js"


const router = Router();

router.post('/auth/register', registerParent);
router.post('/auth/login', login);
router.post("/auth/logout", logout)
router.get("/auth/verify", verifyToken)

router.get("/auth/parent", authRequired, getParent)

export default router;