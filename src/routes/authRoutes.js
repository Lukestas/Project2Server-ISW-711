import { Router } from "express";
<<<<<<< HEAD
import { getParent, login, logout, registerParent, verifyEmail, verifyToken } from "../controllers/authController.js";
=======
import { getParent, login, logout, registerParent, verifyToken } from "../controllers/authController.js";
>>>>>>> 8911a2e785612adfaafb0040ed35b36515edbdf8
import { authRequired } from "../middlewares/validateToken.js"


const router = Router();

router.post('/auth/register', registerParent);
<<<<<<< HEAD
router.get('/auth/verify-email', verifyEmail);

router.post('/auth/login', login);

router.post("/auth/logout", logout);

router.get("/auth/verify", verifyToken);

router.get("/auth/parent", authRequired, getParent)

export default router;
=======
router.post('/auth/login', login);
router.post("/auth/logout", logout)
router.get("/auth/verify", verifyToken)

router.get("/auth/parent", authRequired, getParent)

export default router;
>>>>>>> 8911a2e785612adfaafb0040ed35b36515edbdf8
