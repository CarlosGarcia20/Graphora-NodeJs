import pool from "../config/db.js";
import { EncryptionHelper } from '../helpers/encryption.helper.js'

export class UserModel {
    static async createUser ({ email, password, rememberMe }) {
        try {
            const hashedPassword = await EncryptionHelper.hashPassword(password);

            const { rows } = await pool.query(`
                INSERT INTO usuarios (email, password, rememberme)
                VALUES ($1, $2, $3) 
                RETURNING *
                `,
                [
                    email, 
                    hashedPassword,
                    rememberMe
                ]
            );

            return { success: true, data: rows[0] };
        } catch (error) {
            return { success: false, error };
        }
    }

    static async deleteUser ({ idUser }) {
        try {
            const { rowCount } = await pool.query(`
                DELETE FROM usuarios
                WHERE iduser = $1`,
                [idUser]
            );
    
            if (rowCount === 0) {
                return res.status(404).json({ success: false });
            }
    
            return { success: true };
    
        } catch (error) {
            // console.error("Error al eliminar: ", error);
            return { success: false, error };
        }
    }

    static async getAllUsers() {
        try {
            const { rows } = await pool.query("SELECT * FROM usuarios");

            return { success: true, data: rows };
        } catch (error) {
            return { success: false, error };
        }
    }
}