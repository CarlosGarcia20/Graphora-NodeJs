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
    
    
    /*
    * A partir de aquí se crearan rutas para que el usuario pueda modificar su perfil
    * TODO
    * Antes de modificar los tokens se estara utilizando el id del usuario
    * por parametro, luego se cambiara para que lo tome por el token
    *  
    * - Ruta para cambiar solo el nombre y el apellido del usuario
    * - Ruta para cambiar el correo (se tiene que validar)
    * - Ruta para cambiar la contraseña (se tiene que validar)
    */
    // usersRouter.patch('/', verifyToken, userController.updateUser)
    // usersRouter.patch('/profile', userController.updateUser)
    usersRouter.patch('/profile/:userId', userController.updateUserProfile)

    // Actualiza correo (exigiendo contraseña actual por seguridad)
    usersRouter.patch('/profile/email/:userId', userController.updateEmail);

    usersRouter.patch('/profile/password/:userId', userController.updatePassword);
    
    return usersRouter;
}
