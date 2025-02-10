import { Router } from "express";
import { loginController } from "../controllers/login.controller.js";

export const loginRouter = Router();

loginRouter.post('/', loginController.login)