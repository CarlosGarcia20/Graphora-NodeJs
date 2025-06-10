import pkg from "pg";
const { Pool } = pkg;
import 'dotenv/config';

// Crear pool de conexiones
const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT
});

// Probar la conexión
// pool.connect()
//     .then(() => console.log("📡 Conectado a Neon PostgreSQL"))
//     .catch(err => console.error("❌ Error de conexión a Neon:", err));

export default pool;

