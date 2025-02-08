import pool from "../config/db.js";

export class userController {
    static async create (req, res) {
        try {
            const { descripcion } = req.body;
    
            const { rows, rowCount } = await pool.query(`
                INSERT INTO prueba (descripcion)
                VALUES ($1)
                RETURNING *`,
                [
                    descripcion
                ]
            );
    
            if(rowCount < 1) {
                return res.status(500).json({ message: "Ocurrió un error al crear el usuario" });
            }
    
            return res.status(201).json({ message: "Creado con éxito" });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async getUsers (req, res) {
        try {
            const { rows, rowCount, } = await pool.query(
                "SELECT * FROM prueba"
            );

            if(rowCount < 1) {
                return res.status(404).json({ message: "No hay registros." });
            }

            return res.status(200).json({ rows });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async deleteUser (req, res) {
        try {
            const { idUser } = req.params;
    
            const { rowCount } = await pool.query(`
                DELETE FROM prueba
                WHERE idprueba = $1`,
                [idUser]
            );
    
            if (rowCount < 1) {
                return res.status(404).json({ message: "Registro no encontrado" });
            }
    
            return res.status(200).json({ message: "Eliminado con éxito" });
    
        } catch (error) {
            // console.error("Error al eliminar: ", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}