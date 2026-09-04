import pkg from "pg";
import { dbConfig } from "./config.js";

const { Pool } = pkg;

const pool = new Pool({
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    user: dbConfig.username,
    password: dbConfig.password,
});

export default pool;