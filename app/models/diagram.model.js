import pool from "../config/db.js";

export class DiagramModel {
    static async getTemplates() {
        try {
            const { rows } = await pool.query(
                `SELECT * FROM templates`
            )

            return { success: true, data: rows}
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    static async getTemplateById({ diagramId }) {
        try {
            const { rows } = await pool.query(
                `SELECT * FROM templates 
                WHERE template_id = $1`,
                [diagramId]
            );

            return { success: true, data: rows[0] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async createTemplate ({ input }) {
        try {
            // Validar si no hay un template creado con el mismo nombre
            const { rows: existing  } = await pool.query(
                `SELECT name FROM templates WHERE name = $1`,
                [input.name]
            )

            if (existing.length > 0) {
                return {
                    success: false,
                    message: "El nombre del diagrama ya se encuentra registrado"
                }
            }

            const { rowCount } = await pool.query(`
                INSERT INTO templates (
                    name, description, category_id, template_data
                )
                VALUES ($1, $2, $3, $4)
                RETURNING *`,
                [
                    input.name, 
                    input.description, 
                    input.category_id,
                    input.template_data
                ]
            )

            if (rowCount < 1) {
                return { success: false }
            }

            return { success: true }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async updateTemplate({ diagramId, input }) {
        try {
            // Verificar si la plantilla existe 
            const { rowCount: exists } = await pool.query(
                `SELECT template_id FROM templates WHERE template_id = $1`,
                [diagramId]
            )

            if (exists < 1) {
                return { success: false, error : "Plantilla no encontrada " }
            }

            const { rowCount } = await pool.query(
                `UPDATE templates 
                SET name = $1,
                    description = $2,
                    category_id = $3,
                    template_data = $4,
                    updated_at = CURRENT_TIMESTAMP
                WHERE template_id = $5`,
                [
                    input.name,
                    input.description,
                    input.category_id,
                    input.template_data,
                    diagramId
                ]
            );

            if (rowCount < 1) {
                return { success: false, error: "No se pudo actualizar la plantilla" };
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async deleteTemplate({ diagramId }) {
        try {
            // Validar si la plantilla existe
            const { rowCount: exists } = await pool.query(
                `SELECT template_id FROM templates WHERE template_id = $1`,
                [diagramId]
            )

            if (exists < 1) {
                return { success: false, error : "Plantilla no encontrada " }
            }

            const { rowCount } = await pool.query(
                `DELETE FROM templates WHERE template_id = $1`,
                [diagramId]
            )

            if (rowCount < 1) {
                return { success: false, error : "Ocurrió un error al eliminar la plantilla " }
            }

            
            return { success: true }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}