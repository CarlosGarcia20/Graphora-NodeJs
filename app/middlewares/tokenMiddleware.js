import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const requireAuth = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: "No autorizado" });
    }

    jwt.verify(token, config.jwtSecret, (err, user) => {
        if (err) return res.status(403).json({ message: "Token expirado" });
        
        req.user = user;
        next();
    });
};