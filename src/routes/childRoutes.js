import express from 'express'
import { authRequired } from "../middlewares/validateToken.js"
import { getChildrensByParentId, registerChild, getChildById, updateChild, deleteChild } from '../controllers/childController.js';

const router = express.Router();

router.post('/register-child', authRequired, registerChild);
router.get('/childrens', authRequired, getChildrensByParentId);

router.get('/child', authRequired, getChildById);
router.put('/child', authRequired, updateChild);
router.delete('/child', authRequired, deleteChild);


export default router