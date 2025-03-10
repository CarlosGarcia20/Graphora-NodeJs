import jwt from 'jsonwebtoken'
import config from '../config.js'
import { tokenService } from '../helpers/token.helper.js'

export class tokenController {
    static async refreshToken(req, res) {
        try {
            const { refreshToken } = req.data;

            if (!refreshToken || !tokenService.isValidRefreshToken(refreshToken)) {
                return res.status(403).json({ message: "Refresh token inválido" })
            }

            jwt.verify(refreshToken, config.jwtRefreshSecret, (err, user) => {
                if (err) return res.status(403).json({ message: "Token expirado" })
                
                // Eliminar el token viejo y generar uno nuevo
                tokenService.removeRefreshToken(refreshToken);
                const { accestToken, newRefreshToken } = tokenService.generateToken(user);

                // Guardar nuevo refreshToken
                tokenService.storeRefreshToken(newRefreshToken)

                // Enviar nuevo refreshToken
            });
        } catch (error) {
            return res.status(500).json({ message: "Error en el refresh token", error: error.message });
        }
    }
}