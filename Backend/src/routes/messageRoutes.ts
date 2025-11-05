import { Router } from "express";
import { deleteMessages, getMessages } from "../controllers/message.controller";
const router=Router();
router.get('/get/', getMessages);
router.delete('/delete/', deleteMessages);

export default router;