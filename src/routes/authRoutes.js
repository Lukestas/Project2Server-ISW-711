import { Router } from "express";
import { getParent, login, logout, registerParent, verifyEmail, verifyToken } from "../controllers/authController.js";
import { authRequired } from "../middlewares/validateToken.js"
import { verifyParentPin } from "../controllers/verifications.js";


const router = Router();

router.post('/auth/register', registerParent);
router.get('/auth/verify-email', verifyEmail);

router.post('/auth/login', login);

router.post("/auth/logout", logout);

router.get("/auth/verify", verifyToken);

router.get("/auth/parent", authRequired, getParent)

router.get ("/auth/verifyPinParent", authRequired, verifyParentPin)

export default router;
