import { Router } from "express";
import { loginController } from "../controllers/auth.controller.js";

export const loginRouter = Router();

loginRouter.post('/', loginController.login)