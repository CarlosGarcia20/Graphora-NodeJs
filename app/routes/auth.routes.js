import { Router } from "express";
import { LoginController } from "../controllers/auth.controller.js";

export const createAuthRouter = ({ loginModel, tokenModel, tokenService }) => {
    const loginRouter = Router();
    
    const loginController = new LoginController({ loginModel, tokenModel, tokenService })
    
    loginRouter.post('/', loginController.login)

    loginRouter.post('/logout', loginController.logout)
    
    loginRouter.post('/refresh', loginController.refreshToken)

    return loginRouter;
}