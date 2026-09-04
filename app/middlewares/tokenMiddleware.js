export const requireAuth = ({ tokenService }) => {
    return (req, res, next) => {
        const token = req.cookies?.accessToken;

        if (!token) {
            return res.status(401).json({ message: "No autorizado" });
        }

        try {
            const user = tokenService.verifyToken(token)
            req.user = user
            next();            
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Token expirado", code: "TOKEN_EXPIRED" })
            }

            return res.status(403).json({ message: "Token inválido" })
        }
    }
};