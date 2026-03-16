import { validateRegister } from "../schemas/register.js";
import { catchAsync } from "../util/catchAsync.js";
import { EncryptionHelper } from "../helpers/encryption.helper.js"
import { validateUpdateUserProfile } from "../schemas/updateUserProfile.js";
import { validatePasswordUpdate } from "../schemas/updatePassword.js";
import { validateEmailUpdate } from "../schemas/updateEmail.js";

export class UserController {
    constructor({ userModel }) {
        this.userModel = userModel
    }
    
    create = catchAsync(async(req, res, next) => {
        const registerValidation = validateRegister(req.body);

        if (!registerValidation.success) {
            return res.status(400).json({
                message: "Datos incorrectos",
                errors: registerValidation.error.flatten().fieldErrors
            });
        }

        const hashedPassword = await EncryptionHelper.hashPassword(registerValidation.data.password);
        
        const result = await this.userModel.createUser({ 
            email: registerValidation.data.email,
            password: hashedPassword,
            name: registerValidation.data.name,
            lastName: registerValidation.data.lastName     
        });
        
        if (!result.success) {
            return res.status(409).json({ message: result.error });
        }

        return res.status(201).json({ message: "Usuario creado con éxito" });
    })

    getUsers = catchAsync(async(req, res, next) => {
        const result = await this.userModel.getAllUsers();

        if (!result.success) {
            return res.status(500).json({ 
                message: "Error al obtener usuarios",
                error: result.error
            });
        }

        return res.status(200).json({ users: result.data });
    })

    deleteUser = catchAsync(async(req, res, next) => {
        const { userId } = req.params;
        const result = await this.userModel.deleteUser({ userId });

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        return res.sendStatus(204);
    })

    getUserById = catchAsync(async(req, res, next) => {
        const { userId } = req.params;
        const result = await this.userModel.getUserById({ userId });

        if (!result.success) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.status(200).json({ result: result.data });
    })

    updateUserProfile = catchAsync(async(req, res, next) => {
        const userId = req.user.userId

        const updateValidation = validateUpdateUserProfile(req.body);
        if (!updateValidation.success) {
            return res.status(400).json({ 
                message: "Datos incorrectos",
                errors: updateValidation.error.flatten().fieldErrors
            });
        }
        const result = await this.userModel.updateUserProfile({ 
            userId, 
            name: updateValidation.data.name,
            lastname: updateValidation.data.lastname
        });

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        return res.status(200).json({ message: "Datos actualizados correctamente" });
    });

    updateEmail = catchAsync(async(req, res, next) => {
        const userId = req.user.userId

        const emailValidation = validateEmailUpdate(req.body);
        if (!emailValidation.success) {
            return res.status(400).json({ 
                message: "Datos incorrectos",
                errors: emailValidation.error.flatten().fieldErrors
            });
        }
        const { currentPassword, newEmail } = emailValidation.data

        const verifyPassword = await this._verifyCurrentPassword(userId, currentPassword);
        if (!verifyPassword.success) {
            return res.status(verifyPassword.status).json({ message: verifyPassword.message });
        }

        const emailExist = await this.userModel.checkEmailExists(newEmail);
        if(emailExist) {
            return res.status(409).json({ message: "El correo ya esta en uso" })
        }

        await this.userModel.updateEmailOnly(userId, newEmail);

        return res.status(200).json({ message: "Correo electrónico actualizado con éxito" })

    });

    updatePassword = catchAsync(async(req, res, next) => {
        const userId = req.user.userId

        const passwordValidation = validatePasswordUpdate(req.body);
        if (!passwordValidation.success) {
            return res.status(400).json({ 
                message: "Datos incorrectos",
                errors: passwordValidation.error.flatten().fieldErrors
            });
        }
        const { currentPassword, newPassword } = passwordValidation.data;

        const verifyPassword = await this._verifyCurrentPassword(userId, currentPassword);
        if (!verifyPassword.success) {
            return res.status(verifyPassword.status).json({ message: verifyPassword.message });
        }

        const hashedNewPassword = await EncryptionHelper.hashPassword(newPassword);

        await this.userModel.updateOnlyPassword(userId, hashedNewPassword);

        return res.status(200).json({ message: "Contraseña actualizada con éxito" });
    });

    _verifyCurrentPassword = async (userId, currentPassword) => {
        const user = await this.userModel.getUserPassword(userId);
        
        if (!user.success) {
            return { success: false, status: 404, message: "Usuario no encontrado" };
        }

        const isValid = await EncryptionHelper.comparePassword(currentPassword, user.password);
        
        if (!isValid) {
            return { success: false, status: 401, message: "La contraseña actual es incorrecta" };
        }

        return { success: true };
    }
}