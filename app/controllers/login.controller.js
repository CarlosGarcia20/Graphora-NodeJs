import { loginModel } from "../models/login.models.js";
import jwt from 'jsonwebtoken';
import config from '../config.js';


let refreshTokens = [];

export class loginController {
    static async login(req, res) {
        try {
            console.log("Entro");
            const { email, password, rememberMe } = req.body;
            const result = await loginModel.login({ email, password, rememberMe });

            if (!result.success) {
                return res.status(500).json({ message: result.message });
            }
            console.log(result);

            const data = (({ iduser, email, name, lastname }) => ({ iduser, email, name, lastname }))(result);
            
            const accessToken = jwt.sign(data, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
            const refreshToken = jwt.sign(data, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiresIn });
            refreshTokens.push(refreshToken);
            
            return res.status(200).json({ message: "Inicio de sesión exitoso", accessToken, refreshToken, data });
            console.log(result);

            const data = (({ iduser, email, name, lastname }) => ({ iduser, email, name, lastname }))(result);
            
            return res.status(200).json({ message: "Inicio de sesión exitoso", data: data })
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