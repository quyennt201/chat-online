import { Router } from "express";
import { createConversation, getConversationById, getConversationsMe } from "../controllers/conversation.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const conversationRouter = Router();

conversationRouter.post("/", verifyToken, createConversation);
conversationRouter.get("/me", verifyToken, getConversationsMe);
conversationRouter.get("/:conversationId", verifyToken, getConversationById);

export default conversationRouter;
