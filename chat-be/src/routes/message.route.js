import { Router } from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const messageRouter = Router();

messageRouter.get("/:conversationId", verifyToken, getMessages);
messageRouter.post("/", verifyToken, sendMessage);

export default messageRouter;
