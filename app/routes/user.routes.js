import { Router } from "express";
import { userController } from "../controllers/users.controller.js";
import { verifyToken } from "../middlewares/tokenMiddleware.js";

export const usersRouter = Router();

usersRouter.post('/', userController.create);

usersRouter.get('/', verifyToken ,userController.getUsers);

usersRouter.get('/:userId', userController.getUserById);

usersRouter.delete('/:idUser', verifyToken, userController.deleteUser);