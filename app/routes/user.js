import { Router } from "express";
import { userController } from "../controllers/users.js";

export const usersRouter = Router()

usersRouter.get('/', userController.create)