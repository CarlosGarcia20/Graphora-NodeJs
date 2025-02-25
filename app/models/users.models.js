import pool from "../config/db.js";
import { EncryptionHelper } from '../helpers/encryption.helper.js'

export class UserModel {
<<<<<<< HEAD
    static async createUser ({ input }) {
=======
    static async createUser ({ name, lastName, email, password, rememberMe }) {
>>>>>>> master
        try {
            const { email, password, name, lastName } = input;
            
            // Validacion para verificar si el email ya existe en la base de datos
            const { rows: user } = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

            if (user.length > 0) {
                return { success: false, error: "El email ya se encuentra registrado" };
            }

            const hashedPassword = await EncryptionHelper.hashPassword(password);

            const { rows } = await pool.query(`
<<<<<<< HEAD
                INSERT INTO users (email, password, name, lastname)
                VALUES ($1, $2, $3, $4)
=======
                INSERT INTO users (email, password, name, lastname, rememberme)
                VALUES ($1, $2, $3, $4, $5)
>>>>>>> master
                RETURNING *
                `,
                [
                    email,
                    hashedPassword,
                    name,
<<<<<<< HEAD
                    lastName
=======
                    lastName,
                    rememberMe
>>>>>>> master
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
            const { rows } = await pool.query("SELECT * FROM usuarios");

            return { success: true, data: rows };
        } catch (error) {
            return { success: false, error };
        }
    }
}