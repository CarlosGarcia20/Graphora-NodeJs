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

    getAllUsers = async() => {
        const { rows } = await pool.query(`
            SELECT userid, email, name, lastname
            FROM users`
        );

        return { success: true, data: rows };
    }

    deleteUser = async({ userId }) => {
        const { rowCount } = await pool.query(`
            DELETE FROM users
            WHERE userid = $1`,
            [userId]
        );

        if (rowCount === 0) {
            return {
                success: false,
                message: "Usuario no encontrado"
            };
        }

        return { success: true };
    }

    getUserById = async({ userId }) => {
        const { rows } = await pool.query(`
            SELECT userid, email, name, lastname
            FROM users
            WHERE userid = $1`,
            [userId]
        );

        if (rows.length === 0) {
            return { success: false };
        }

        return { success: true, data: rows[0] };
    }

    getUserPassword = async (userId) => {
        const { rows } = await pool.query(
            `SELECT password FROM users WHERE userid = $1`, 
            [userId]
        );

        if (rows.length === 0) {
            return { success: false };
        }

        return { success: true, password: rows[0].password };
    }

    updateUserProfile = async({ userId, name, lastname }) => {
        const { rowCount } = await pool.query(
            `UPDATE users 
            SET name = $1, lastname = $2 
            WHERE userid = $3`,
            [
                name,
                lastname,
                userId
            ]
        );

        if (rowCount === 0) {
            return { success: false, message: "Usuario no encontrado" };
        }

        return { success: true }
    }

    updateEmailOnly = async(userId, newEmail) => {
        await pool.query(
            `UPDATE users
            SET email = $1
            WHERE userid = $2`,
            [newEmail, userId]
        )

        return { success: true }
    }

    updateOnlyPassword = async(userId, password) => {
        await pool.query(
            `UPDATE users SET password = $1 WHERE userid = $2`,
            [password, userId]
        );

        return { success: true };
    }

    checkEmailExists = async(email) => {
        const { rowCount } = await pool.query(
            `SELECT email FROM users WHERE email = $1`,
            [email]
        )

        if (rowCount > 0) return true;
    }
}