import { loginModel } from "../models/login.models.js";
import { validateLogin } from "../schemas/login.js";
import jwt from 'jsonwebtoken';
import config from '../config.js';

let refreshTokens = [];

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

            const data = (({ iduser, email, name, lastname }) => ({ iduser, email, name, lastname }))(result);
            
            const accessToken = jwt.sign(data, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
            const refreshToken = jwt.sign(data, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiresIn });
            refreshTokens.push(refreshToken);
            
            return res.status(200).json({ message: "Inicio de sesión exitoso", accessToken, refreshToken, data });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }

    static refreshToken(req, res) {
        const { token } = req.body;
        if (!token || !refreshTokens.includes(token)) {
            return res.status(403).json({ message: "Refresh token inválido" });
        }

        jwt.verify(token, config.jwtRefreshSecret, (err, user) => {
            if (err) return res.status(403).json({ message: "Token expirado" });
            const newAccessToken = jwt.sign(user, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
            res.json({ accessToken: newAccessToken });
        });
    }
}