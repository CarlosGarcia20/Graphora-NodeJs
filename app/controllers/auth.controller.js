import { loginModel } from "../models/auth.models.js";
import { validateLogin } from "../schemas/login.js";
import { tokenService } from "../util/jwtUtils.js";

export class loginController {
    static async login(req, res) {
        try {
            const resultado = validateLogin(req.body);
           
            if (!resultado.success) {
                return res.status(400).json({ message: JSON.parse(resultado.error.message) });
            }

            const result = await loginModel.login({ input: resultado.data });
           
            if (!result.success) {
                return res.status(500).json({ message: result.message });
            }
            
            const { userId: userId, email, name, lastname } = result.data;

            // Generar tokens de acceso y actualización
            const { accessToken, refreshToken } = tokenService.generateTokens({ userId });
            
            // Guardar el token de actualización en la base de datos o en la memoria
            await tokenService.storeRefreshToken(userId, refreshToken);

            return res.status(200).json({ 
                message: "Inicio de sesión exitoso",
                accessToken, 
                refreshToken, 
                user: {
                    name: name,
                    lastname: lastname,
                    email: email
                }
            });
        } catch (error) {
            // console.error(error)
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }

    static async logout(req, res) {
        const { refreshToken } = req.body;

        try {
            await tokenService.removeRefreshToken(refreshToken);

            res.status(200).json({ message: "Sesión cerrada exitosamente" });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }

    static async refreshToken(req, res) {
        const { refreshToken: oldRefreshToken } = req.body;
        const userId = req.user.userId; // Obtener el userId del token decodificado

        if (!userId) {
            return res.status(403).json({ 
              code: 'USER_NOT_FOUND', 
              message: 'No se identificó al usuario' 
            });
        }
        
        try {
            // Generar nuevos tokens
            const { accessToken, refreshToken: newRefreshToken } = tokenService.generateTokens({
                userId: userId,
            })

            // Rotar el refresh token
            await tokenService.removeRefreshToken(oldRefreshToken)
            await tokenService.storeRefreshToken(userId, newRefreshToken)

            // Regresar la respuesta
            res.json({ accessToken, refreshToken: newRefreshToken })
        } catch (error) {
            console.log(error)
            res.status(500).json({ code: 'Internal Server Error', message: 'Error al renovar token' });
        }
    }
}