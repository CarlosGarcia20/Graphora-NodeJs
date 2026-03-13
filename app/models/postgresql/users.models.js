import pool from "../../config/db.js";

export class UserModel {
    createUser = async({ email, password, name, lastName }) => {
        const { rows: user } = await pool.query(
            `SELECT * FROM users WHERE email = $1`, 
            [email]
        )

        if (user.length > 0) {
            return { success: false, error: "El email ya se encuentra registrado" };
        }

        await pool.query(`
            INSERT INTO users (
                email, password, name, lastname
            )
            VALUES ($1, $2, $3, $4)
            `,
            [
                email,
                password,
                name,
                lastName
            ]
        );

        return { success: true };
    }

    deleteUser = async({ userId }) => {
        try {
            const { rowCount } = await pool.query(`
                DELETE FROM users
                WHERE userid = $1`,
                [userId]
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

    getAllUsers = async() => {
        try {
            const { rows } = await pool.query("SELECT * FROM users");

            return { success: true, data: rows };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    getUserById = async({ userId }) => {
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

    updateUser = async({ userId, input }) => {
        try {
            const { rowCount: existing, rows } = await pool.query(
                `SELECT email FROM users
                WHERE userid = $1`,
                [userId]
            )            

            if (existing < 1) {
                return { success: false, message: "Usuario no encontrado" };
            }

            const currentEmail = rows[0].email

            if (input.email !== currentEmail) {
                const { rowCount: emailExists } = await pool.query(
                    `SELECT 1 FROM users WHERE email = $1 AND userid != $2`,
                    [ input.email, userId ]
                )

                if (emailExists > 0) {
                    return { success: false, message: "El email ya se encuentra registrado" };
                }
            }

            const fields = [];
            const values = [];
            let paramIndex = 1;

            if (input.email) {
                fields.push(`email = $${paramIndex++}`);
                values.push(input.email);
            }

            if (input.name) {
                fields.push(`name = $${paramIndex++}`);
                values.push(input.name);
            }

            if (input.lastName) {
                fields.push(`lastname = $${paramIndex++}`);
                values.push(input.lastName);
            }

            if (input.password && input.password.trim() !== '') {
                const hashedPassword = await EncryptionHelper.hashPassword(input.password);
                fields.push(`password = $${paramIndex++}`);
                values.push(hashedPassword);
            }

            if (fields.length === 0) {
                return { success: false, message: "No se proporcionaron campos para actualizar" };
            }

            // Agregamos el userId al final para el WHERE
            values.push(userId);

            const query = `
            UPDATE users
            SET ${fields.join(', ')}
            WHERE userid = $${paramIndex}
            RETURNING *`;

            const { rows: updated } = await pool.query(query, values);

            return { success: true, message: "Usuario actualizado correctamente" };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

}