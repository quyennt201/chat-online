import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getUsersController, getUserByIdController, getMeController, updateMeController } from "../controllers/user.controller.js";

const userRouter = Router()

userRouter.get('/', verifyToken, getUsersController); // query ids
userRouter.get('/me', verifyToken, getMeController);
userRouter.get('/:userId', verifyToken, getUserByIdController);
userRouter.put('/me', verifyToken, updateMeController);

export default userRouter;