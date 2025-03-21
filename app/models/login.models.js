import pool from "../config/db.js";
import { EncryptionHelper } from "../helpers/encryption.helper.js";

export class loginModel {
    static async login({ email, password, rememberMe }) {
        try {
            const { rows } = await pool.query(
                `SELECT * FROM users WHERE email = $1`,
                [ email ]
            );

            if (rows.length === 0) {
                return { success: false, message: "Usuario no encontrado" }
            }

            const verificarContraseña = await EncryptionHelper.comparePassword(password, rows[0].password);

            if(!verificarContraseña) {
                return { success: false, message: "Contraseña incorrecta" }
            }

            return { success: true, data: rows[0] }
        } catch (error) {
            return { success: false, error };
        }
    }
}