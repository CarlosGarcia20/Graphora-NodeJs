import { EncryptionHelper } from "../helpers/encryption.helper.js";
import { validateLogin } from "../schemas/login.js";
import { catchAsync } from "../util/catchAsync.js";
import { tokenService } from "../util/jwtUtils.js";
import 'dotenv/config';

const isProduction = process.env.NODE_ENV === 'production';

export class LoginController {
    constructor({ loginModel }) {
        this.loginModel = loginModel
    }

    login = catchAsync(async(req, res, next) => {
        const authValidation = validateLogin(req.body);
        
        if (!authValidation.success) {
            return res.status(400).json({ 
                message: "Datos incorrectos",
                errors: authValidation.error.flatten().fieldErrors
            });
        }

        const { email, password} = authValidation.data

        const result = await this.loginModel.login(email);
        if (!result.success) {
            return res.status(401).json({ message: "Correo o contraseña incorrectos" });
        }
        
        const user = result.data

        const isValidPassword = await EncryptionHelper.comparePassword(password, user.password)
        if (!isValidPassword) {
            return res.status(401).json({ message: "Correo o contraseña incorrectos" });
        }

        // Generar tokens de acceso y actualización
        // const { accessToken, refreshToken } = tokenService.generateTokens({ userId });
        
        // Guardar el token de actualización en la base de datos o en la memoria
        // await tokenService.storeRefreshToken(userId, refreshToken);

        return res.status(200).json({ 
            message: "Inicio de sesión exitoso",
            // accessToken, 
            // refreshToken, 
            user: {
                name: user.name,
                lastname: user.lastname,
            }
        });
    })

    // logout = async(req, res) => {
    //     const { refreshToken } = req.body;

    //     try {
    //         await tokenService.removeRefreshToken(refreshToken);

    //         res.status(200).json({ message: "Sesión cerrada exitosamente" });
    //     } catch (error) {
    //         res.status(500).json({ message: "Internal Server Error", error: error.message });
    //     }
    // }

    // refreshToken = async (req, res) => {
    //     const { refreshToken: oldRefreshToken } = req.body;
    //     const userId = req.user.userId; // Obtener el userId del token decodificado

    //     if (!userId) {
    //         return res.status(403).json({ 
    //           code: 'USER_NOT_FOUND', 
    //           message: 'No se identificó al usuario' 
    //         });
    //     }
        
    //     try {
    //         // Generar nuevos tokens
    //         const { accessToken, refreshToken: newRefreshToken } = tokenService.generateTokens({
    //             userId: userId,
    //         })

    //         // Rotar el refresh token
    //         await tokenService.removeRefreshToken(oldRefreshToken)
    //         await tokenService.storeRefreshToken(userId, newRefreshToken)

    //         // Regresar la respuesta
    //         res.json({ accessToken, refreshToken: newRefreshToken })
    //     } catch (error) {
    //         console.log(error)
    //         res.status(500).json({ code: 'Internal Server Error', message: 'Error al renovar token' });
    //     }
    // }
}