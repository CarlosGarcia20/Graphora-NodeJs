import { Router } from "express";
import { LoginController } from "../controllers/auth.controller.js";
import { verifyRefreshToken } from "../middlewares/tokenMiddleware.js";

export const createAuthRouter = ({ loginModel }) => {
    const loginRouter = Router();
    
    const loginController = new LoginController({ loginModel })
    
    loginRouter.post('/', loginController.login)
    
    // loginRouter.post('/refresh', verifyRefreshToken, loginController.refreshToken)

    return loginRouter;
}