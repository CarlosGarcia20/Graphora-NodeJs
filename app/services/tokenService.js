import jwt from 'jsonwebtoken';
import config from '../config/config.js';

/* 
 * TODO
 * Por el momento los usuarios no tienen roles pero en un futuro
 * se agregaran roles para poder diferenciar a los usuarios de los
 * administradores, etc.
*/

export class TokenService {
   generateToken(userData) {
      return jwt.sign(
         {
            userId: userData.userId
         },
         config.jwtSecret, { expiresIn: config.jwtExpiresIn }
      )
   }

   generateRefreshToken(userData) {
      return jwt.sign(
         {
            userId: userData.userId
         },
         config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiresIn }
      )
   }

   verifyToken(token) {
      return jwt.verify(token, config.jwtSecret)
   }

   verifyRefreshToken(token) {
      return jwt.verify(token, config.jwtRefreshSecret);
   } 
}
