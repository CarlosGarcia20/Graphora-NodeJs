import pool from "../config/db.js";
import { EncryptionHelper } from '../helpers/encryption.helper.js'

export class UserModel {
    static async createUser ({ input }) {
        try {
            const { email, password, name, lastName } = input;

            const hashedPassword = await EncryptionHelper.hashPassword(password);

            const { rows } = await pool.query(`
                INSERT INTO users (email, password, name, lastname)
                VALUES ($1, $2, $3, $4)
                RETURNING *
                `,
                [
                    email, 
                    hashedPassword,
                    name,
                    lastName
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