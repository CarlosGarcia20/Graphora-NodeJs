import pkg from "pg";
const { Pool } = pkg;
import 'dotenv/config';

// Crear pool de conexiones
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Necesario para Neon
    }
});

// Probar la conexión
pool.connect()
    .then(() => console.log("📡 Conectado a Neon PostgreSQL"))
    .catch(err => console.error("❌ Error de conexión a Neon:", err));

export default pool;
