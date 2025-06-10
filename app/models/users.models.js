import pool from "../config/db.js";
import { EncryptionHelper } from '../helpers/encryption.helper.js'
import { v4 as uuidv4 } from 'uuid';

export class UserModel {
    static async createUser ({ input }) {
        try {
            const { email, password, name, lastName } = input;
            
            // Validacion para verificar si el email ya existe en la base de datos
            const { rows: user } = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

            if (user.length > 0) {
                return { success: false, error: "El email ya se encuentra registrado" };
            }

            // Creacion del uuid para el iduser
            const userId = uuidv4();

            const hashedPassword = await EncryptionHelper.hashPassword(password);

            const { rows } = await pool.query(`
                INSERT INTO users (
                    userid, email, password, name, lastname
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
                `,
                [
                    userId,
                    email,
                    hashedPassword,
                    name,
                    lastName
                ]
            );

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
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
            const { rows } = await pool.query("SELECT * FROM users");

            return { success: true, data: rows };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async getUserById({ userId }) {
        try {
            const { rows } = await pool.query(`
                SELECT * FROM users
                WHERE userid = $1`,
                [userId]
            );

            if (rows.length === 0) {
                return { success: false };
            }

            return { success: true, data: rows[0] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}