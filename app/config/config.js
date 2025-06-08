import 'dotenv/config';
export const PORT = process.env.PORT || 4000;

const config = {
    jwtSecret: process.env.JWT_SECRET || 'secreto_super_seguro',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secreto',
    jwtExpiresIn: '24h',
    jwtRefreshExpiresIn: '7d'
};

export default config;