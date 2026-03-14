import ms from "ms";
import config from "../config/config.js";
import { EncryptionHelper } from "../helpers/encryption.helper.js";
import { validateLogin } from "../schemas/login.js";
import { catchAsync } from "../util/catchAsync.js";
import { tokenService } from "../util/jwtUtils.js";
import 'dotenv/config';

const isProduction = process.env.NODE_ENV === 'production';

export class LoginController {
    constructor({ loginModel, tokenModel }) {
        this.loginModel = loginModel;
        this.tokenModel = tokenModel;
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

        const accessToken = tokenService.generateToken({
            userId: user.userid
        })

        const refreshToken = tokenService.generateRefreshToken({
            userId: user.userid
        })

        const accessCookieMaxAge = ms(config.jwtExpiresIn);
        const refreshCookieMaxAge = ms(config.jwtRefreshExpiresIn);

        await this.tokenModel.saveUserToken({
            userId: user.userid,
            token: refreshToken,
            expiresAt: new Date(Date.now() + accessCookieMaxAge)
        });

        res.cookie("accessToken", accessToken, {
            maxAge: accessCookieMaxAge,
            httpOnly: true,
            secure: isProduction, 
            sameSite: isProduction ? 'none' : 'lax'
        });

        res.cookie("refreshToken", refreshToken, {
            maxAge: refreshCookieMaxAge,
            httpOnly: true,
            secure: isProduction, 
            sameSite: isProduction ? 'none' : 'lax'
        });

        return res.status(200).json({
            message: "Inicio de sesión exitoso",
            user: {
                name: user.name,
                lastname: user.lastname
            }
        });
    })

    logout = catchAsync(async(req, res, next) => {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(200).json({ message: "Sesión cerrada" });
        }
        
        await this.tokenModel.revokeToken({ token: refreshToken });

        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
        };

        res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);
        
        return res.status(200).json({ message: "Sesión cerrada exitosamente" });
    })

    refreshToken = catchAsync(async(req, res, next) => {
        const { refreshToken } = req.cookies;
        
        if (!refreshToken) {
            return res.status(401).json({ message: "No autorizado. Inicia sesión nuevamente." });
        }

        const data = tokenService.verifyRefreshToken(refreshToken);

        const dbToken = await this.tokenModel.findToken({ token: refreshToken });
        if (!dbToken.success) return res.status(403).json({ message: "Token revocado o no válido" });

        const newAccessToken = tokenService.generateToken({ 
            userId: data.userId
            // userIdRol: data.userIdRol 
        });

        const accessCookieMaxAge = ms(config.jwtExpiresIn);

        res.cookie("accessToken", newAccessToken, {
            maxAge: accessCookieMaxAge,
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax'
        });

        res.json({ message: "Refrescado" });
    })
}