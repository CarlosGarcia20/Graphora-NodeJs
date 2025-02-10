import { Router } from "express";
import { userController } from "../controllers/users.controller.js";

export const usersRouter = Router();

usersRouter.post('/', userController.create);

usersRouter.get('/', userController.getUsers);

usersRouter.delete('/:idUser', userController.deleteUser);