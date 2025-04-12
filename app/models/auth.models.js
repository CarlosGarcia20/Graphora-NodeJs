import pool from "../config/db.js";
import { EncryptionHelper } from "../helpers/encryption.helper.js";

export class loginModel {
    static async login({ input }) {
        try {
            const { email, password } = input;
           
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

            return { 
                success: true, 
                data: {
                    userId: rows[0].userid,
                    email: rows[0].email,
                    name: rows[0].name,
                    lastname: rows[0].lastname,
                }
            };
        } catch (error) {
            // console.log(error)
            return { success: false, error };
        }
    }
}