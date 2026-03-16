import { Router } from "express";
import { UserController } from "../controllers/users.controller.js";
import { requireAuth } from "../middlewares/tokenMiddleware.js";

export const createUserRouter = ({ userModel }) => {
    const usersRouter = Router();

    const userController = new UserController({ userModel })
    
    usersRouter.post('/', userController.create);
    
    // usersRouter.get('/', verifyToken ,userController.getUsers);
    usersRouter.get('/', userController.getUsers);
    
    usersRouter.get('/:userId', userController.getUserById);
    
    // usersRouter.delete('/:userId', verifyToken, userController.deleteUser);
    usersRouter.delete('/:userId', userController.deleteUser);
    
    
    /*
    * A partir de aquí se crearan rutas para que el usuario pueda modificar su perfil
    *  
    */
    usersRouter.patch('/profile', requireAuth, userController.updateUserProfile)

    usersRouter.patch('/profile/email', requireAuth, userController.updateEmail);

    usersRouter.patch('/profile/password', requireAuth, userController.updatePassword);
    
    return usersRouter;
}
