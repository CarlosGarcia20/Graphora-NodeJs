import { Router } from "express";
import { LoginController } from "../controllers/auth.controller.js";

export const createAuthRouter = ({ loginModel, tokenModel }) => {
    const loginRouter = Router();
    
    const loginController = new LoginController({ loginModel, tokenModel })
    
    loginRouter.post('/', loginController.login)

    loginRouter.post('/logout', loginController.logout)
    
    loginRouter.get('/refresh', loginController.refreshToken)

    return loginRouter;
}