import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { tokenService } from '../util/jwtUtils.js';

export const verifyToken = (req, res, next) => {
	// obtener el token del header 'Authorization'
	const token = req.headers.authorization?.split(' ')[1]
	console.log(req.headers.authorization)
	
	if (!token) {
		return res.status(401).json({
			code: 'TOKEN_REQUIRED',
			message: 'Token no proporcionado'
		})
	}

	try {
		// Verificar y decodificar el token
		const decode = jwt.verify(token, config.jwtSecret);
		req.user = decode;
		next();
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({
				code: 'TOKEN_EXPIRED',
				message: 'Token expirado'
			})
		}
		res.status(403).json({
			code: 'INVALID_TOKEN',
			message: 'Token inválido'
		})
	}
};

export const verifyRefreshToken = async(req, res, next) => {
	const { refreshToken } = req.body;

	if(!refreshToken) {
		return res.status(400).json({
			code: 'TOKEN_REQUIRED',
			message: 'Refresh token no proporcionado'
		})
	}

	try {
		const storedToken = await tokenService.isValidRefreshToken(refreshToken);

		if(!storedToken) {
			return res.status(403).json({
				code: 'INVALID_TOKEN',
				message: 'Refresh token inválido'
			})
		}

		// Verifica la firma y expiracion
		const decode = jwt.verify(refreshToken, config.jwtRefreshSecret)
		req.user = decode; // Almacena los datos decodificados
		next();
		
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ code: 'TOKEN_EXPIRED', message: 'Refresh token expirado' });
		}

		res.status(403).json({ code: 'TOKEN_INVALID', message: 'Token corrupto' });
	}
}