import { Router } from "express";
import { UserController } from "../controllers/users.controller.js";
import { verifyToken } from "../middlewares/tokenMiddleware.js";

export const createUserRouter = ({ userModel }) => {
    const usersRouter = Router();

    const userController = new UserController({ userModel })
    
    usersRouter.post('/', userController.create);
    
    // usersRouter.get('/', verifyToken ,userController.getUsers);
    usersRouter.get('/', userController.getUsers);
    
    usersRouter.get('/:userId', userController.getUserById);
    
    // usersRouter.delete('/:userId', verifyToken, userController.deleteUser);
    usersRouter.delete('/:userId', userController.deleteUser);
    
    usersRouter.patch('/', verifyToken, userController.updateUser)
    
    return usersRouter;
}
