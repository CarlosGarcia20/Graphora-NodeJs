import 'dotenv/config';
export const PORT = process.env.PORT || 4000;

const config = {
    jwtSecret: process.env.JWT_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtExpiresIn: process.env.JWTEXPIRESIN,
    jwtRefreshExpiresIn: process.env.JWTREFRESHEXPIRESIN,
    development: {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        dialect: 'postgres'
    }
};

export default config;