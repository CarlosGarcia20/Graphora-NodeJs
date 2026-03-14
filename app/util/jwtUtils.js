import jwt from 'jsonwebtoken';
import config from '../config/config.js';

/* 
 * TODO
 * Por el momento los usuarios no tienen roles pero en un futuro
 * se agregaran roles para poder diferenciar a los usuarios de los
 * administradores, etc.
*/

export class tokenService {
    static generateToken(userData) {
        return jwt.sign(
            {
                userId: userData.userId
                // userIdRol: userData.userIdRol
            },
            config.jwtSecret, {
                expiresIn: config.jwtExpiresIn
            }
        );
    }
    
    static generateRefreshToken(userData) {
        return jwt.sign(
            {
                userId: userData.userId
                // userIdRol: userData.userIdRol
            },
            config.jwtRefreshSecret, {
                expiresIn: config.jwtRefreshExpiresIn
            }
        )
    }

    static verifyRefreshToken(token) {
        return jwt.verify(token, config.jwtRefreshSecret);
    } 
}