import { Router } from "express";
import { createConversation } from "../controllers/conversation.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const conversationRouter = Router();

conversationRouter.post("/", verifyToken, createConversation);

export default conversationRouter;
