import { Router } from "express";
import { loginController } from "../controllers/auth.controller.js";
import { verifyRefreshToken } from "../middlewares/tokenMiddleware.js";

export const loginRouter = Router();

loginRouter.post('/', loginController.login)

loginRouter.post('/refresh', verifyRefreshToken, loginController.refreshToken)