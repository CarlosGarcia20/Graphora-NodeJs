import { catchAsync } from "../util/catchAsync.js";
import { validateLogin } from "../schemas/login.js";
import { EncryptionHelper } from "../helpers/encryption.helper.js";
import config from "../config/config.js";
import { isProduction } from "../config/config.js";
import ms from "ms";

export class LoginController {
    constructor({ loginModel, tokenModel, tokenService }) {
        this.loginModel = loginModel;
        this.tokenModel = tokenModel;
        this.tokenService = tokenService;
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
        
        const user = result.success ? result.data : null
        
        const isValidPassword = await EncryptionHelper.comparePassword(
            password,
            user ? user.password : config.dummyHash
        )

        if (!user || !isValidPassword) {
            return res.status(401).json({ message: "Correo o contraseña incorrectos" })
        }

        const accessToken = this.tokenService.generateToken({ userId: user.userid })
        const refreshToken = this.tokenService.generateRefreshToken({ userId: user.userid })

        const accessCookieMaxAge = ms(config.jwtExpiresIn);
        const refreshCookieMaxAge = ms(config.jwtRefreshExpiresIn);

        await this.tokenModel.saveUserToken({
            userId: user.userid,
            token: refreshToken,
            expiresAt: new Date(Date.now() + refreshCookieMaxAge)
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

    logout = catchAsync(async (req, res, next) => {
        const refreshToken = req.cookies?.refreshToken;
        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
        };

        if (refreshToken) {
            await this.tokenModel.revokeToken({ token: refreshToken });
        }

        res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);

        return res.status(200).json({ message: "Sesión cerrada exitosamente" });
    })

    refreshToken = catchAsync(async(req, res, next) => {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ message: "No autorizado. Inicia sesión nuevamente." });
        }
        
        let data
        try {
            data = this.tokenService.verifyRefreshToken(refreshToken);
        } catch (error) {
            console.error(error)
            return res.status(401).json({ message: "Sesión expirada. Inicia sesión nuevamente." })
        }

        const dbToken = await this.tokenModel.findToken({ token: refreshToken, userId: data.userId });
        if (!dbToken.success) return res.status(403).json({ message: "Token revocado o no válido" });

        const newAccessToken = this.tokenService.generateToken({ userId: data.userId })
        const newRefreshToken = this.tokenService.generateRefreshToken({ userId: data.userId })

        const accessCookieMaxAge = ms(config.jwtExpiresIn);
        const refreshCookieMaxAge = ms(config.jwtRefreshExpiresIn)

        await this.tokenModel.rotateToken({
            oldToken: refreshToken,
            newToken: newRefreshToken,
            userId: data.userId,
            expiresAt: new Date(Date.now() + refreshCookieMaxAge)
        })

        res.cookie("accessToken", newAccessToken, {
            maxAge: accessCookieMaxAge,
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax'
        })

        res.cookie("refreshToken", newRefreshToken, {
            maxAge: refreshCookieMaxAge,
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax'
        })

        res.json({ message: "Refrescado" });
    })
}