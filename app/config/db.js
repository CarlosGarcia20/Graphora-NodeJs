import pkg from "pg";
const { Pool } = pkg;
import 'dotenv/config';

const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT
});

export default pool;

// Esta parte es para poderse conectar a la BD de Neon Database

// Crear pool de conexiones
// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false // Necesario para Neon
//     }
// });

// // Probar la conexión
// pool.connect()
//     .then(() => console.log("📡 Conectado a Neon PostgreSQL"))
//     .catch(err => console.error("❌ Error de conexión a Neon:", err));

// export default pool;

