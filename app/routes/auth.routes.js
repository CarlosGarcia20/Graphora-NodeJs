import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

export const createAuthRouter = ({ loginModel, tokenModel, tokenService }) => {
    const authRouter = Router();
    
    const authController = new AuthController({ loginModel, tokenModel, tokenService })
    
    authRouter.post('/', authController.login)

    authRouter.post('/logout', authController.logout)
    
    authRouter.post('/refresh', authController.refreshToken)

    authRouter.post('/register', authController.register)

    return authRouter;
}