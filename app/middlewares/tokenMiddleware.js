export const requireAuth = ({ tokenService }) => {
    return (req, res, next) => {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({ message: "No autorizado" });
        }

        try {
            const user = tokenService.verifyToken(token)
            req.user = user
            next();            
        } catch (error) {
            return res.status(503).json({ message: "Token expirado o inválido" })
        }
    }
};