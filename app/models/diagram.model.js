import pool from "../config/db.js";
import { DiagramStatus } from "../constants/diagramStatus.js";

export class DiagramModel {
    static async getTemplates() {
        try {
            const { rows } = await pool.query(
                `SELECT * FROM templates`
            )

            // convertir imagen a base64 si existe
            const data = rows.map(template => ({
                ...template,
                preview_image: template.preview_image
                    ? `data:image/png;base64,${template.preview_image.toString('base64')}`
                    : null
            }));

            return { success: true, data }
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

            if (rows.length === 0) {
                return { success: false, error: "Plantilla no encontrada" };
            }

            const template = rows[0];

             // Convertir imagen a base64 si existe
            template.preview_image = template.preview_image
                ? `data:image/png;base64,${template.preview_image.toString('base64')}`
                : null;


            return { success: true, data: template };
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
                    error: "El nombre del diagrama ya se encuentra registrado"
                }
            }

            const { rowCount } = await pool.query(`
                INSERT INTO templates (
                    name, description, category_id, template_data, preview_image
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *`,
                [
                    input.name, 
                    input.description, 
                    input.category_id,
                    input.template_data,
                    input.preview_image
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
            );

            if (exists < 1) {
                return { success: false, error: "Plantilla no encontrada" };
            }

            const values = [
                input.name,
                input.description,
                input.category_id,
                input.template_data,
                diagramId
            ];

            let query = `
            UPDATE templates 
            SET name = $1,
                description = $2,
                category_id = $3,
                template_data = $4,
                updated_at = CURRENT_TIMESTAMP
            `;

            if (input.preview_image) {
                query += `, preview_image = $6 WHERE template_id = $5`;
                values.push(input.preview_image);
            } else {
                query += ` WHERE template_id = $5`;
            }

            const { rowCount } = await pool.query(query, values);

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

    // Diagramas del usuario
    static async getDiagramsByUser({ userId }) {
        try {
            const { rows, rowCount } = await pool.query(
                `SELECT template_id, name, description, template_data, created_at, preview_image
                FROM user_diagrams 
                WHERE user_id = $1 AND status = $2
                ORDER BY created_at DESC`,
                [ userId, DiagramStatus.ACTIVE ]
            )
    
            if (rowCount < 1) {
                return { success: false, error: "No se encontraron diagramas" }
            }

            // Convertir preview_image a base&4 si se guardo una imagen
            const diagrams = rows.map(diagram => {
                if (diagram.preview_image) {
                    diagram.preview_image = `data:image/png;base64,${diagram.preview_image.toString('base64')}`
                }
                return diagram;
            })
    
            return { success: true, data: diagrams }    
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
    
    static async getDiagramInfo({ userId, diagramId }) {
        try {
            const { rows, rowCount } = await pool.query(
                `SELECT template_id, name, description, template_data, created_at, updated_at, preview_image
                FROM user_diagrams
                WHERE template_id = $1 AND user_id = $2 AND status = $3`,
                [ 
                    diagramId, 
                    userId,
                    DiagramStatus.ACTIVE
                ]
            )

            if (rowCount < 1) {
                return { success: false, error: "No se encontró el diagrama" }
            }

            const diagram = rows[0]

            // Convertir el buffer a base64
            if (diagram.preview_image) {
                diagram.preview_image = `data:image/png;base64,${diagram.preview_image.toString('base64')}`
            }

            return { success: true, data: diagram }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    static async softDeleteDiagram({ userId, diagramId }) {
        try {
            const { rowCount } = await pool.query(`
                UPDATE user_diagrams
                SET status = $1, updated_at = CURRENT_TIMESTAMP
                WHERE template_id = $2 AND user_id = $3 AND status = $4`, 
                [
                    DiagramStatus.DELETED,
                    diagramId,
                    userId,
                    DiagramStatus.ACTIVE
                ]
            );

            if (rowCount < 1) {
                return { success: false, error: "Diagrama no encontrado o ya eliminado" }
            }

            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    static async restoreDiagram({ userId, diagramId }) {
        try {
            const { rowCount: existing } = await pool.query(
                `SELECT template_id FROM user_diagrams 
                WHERE template_id = $1 AND user_id = $2 AND status = $3`,
                [
                    diagramId, 
                    userId, 
                    DiagramStatus.DELETED
                ]
            );

            if (existing < 1) {
                return { success: false, error: "Diagrama no encontrado o no ha sido enviado a la papelera" };
            }

            const { rowCount: updating } = await pool.query(
                `UPDATE user_diagrams
                SET status = $1, updated_at = CURRENT_TIMESTAMP
                WHERE template_id = $2 AND user_id = $3`,
                [ 
                    DiagramStatus.ACTIVE,
                    diagramId, 
                    userId 
                ]
            )

            if (updating < 1) {
                return { success: false, error: "Error al recuperar el diagrama" }
            }

            const { rows: updatedRows } = await pool.query(
                `SELECT template_id, name, description, template_data, created_at 
                FROM user_diagrams 
                WHERE template_id = $1 AND user_id = $2`,
                [ diagramId, userId ]
            );

            return { success: true, data: updatedRows[0] }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    static async deleteDiagram({ userId, diagramId }) {
        try {
            const { rows, rowCount } = await pool.query(
                `SELECT status 
                FROM user_diagrams 
                WHERE template_id = $1 AND user_id = $2`,
                [diagramId, userId]
            );

            if (rowCount < 1) {
                return { success: false, error: "Diagrama no encontrado" };
            }

            if (rows[0].status !== DiagramStatus.DELETED) {
                return { success: false, error: "Primero debes enviar el diagrama a la papelera" };
            }

            const { rowCount: deleted } = await pool.query(
                `DELETE FROM user_diagrams 
                WHERE template_id = $1 AND user_id = $2`,
                [ diagramId, userId ]
            );

            if (deleted < 1) {
                return { success: false, error: "No se pudo eliminar el diagrama" };
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async createDiagramUser({ userId, input, previewImage }) {
        try {
            const { rowCount } = await pool.query(
                `INSERT INTO user_diagrams
                (name, description, user_id, template_data, status, preview_image) 
                VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    input.name,
                    input.description || null,
                    userId,
                    input.template_data,
                    DiagramStatus.ACTIVE,
                    previewImage
                ]
            )

            if (rowCount < 1) {
                return { success: false, error: "No se pudo guardar el diagrama" }
            }
            
            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    static async updateDiagramUser({ userId, diagramId, input, preview_image }) {
        try {
            const { rowCount: exists } = await pool.query(
                `SELECT template_id FROM user_diagrams 
                WHERE template_id = $1 AND user_id = $2 AND status = $3`,
                [ 
                    diagramId, 
                    userId, 
                    DiagramStatus.ACTIVE 
                ]
            );

            if (exists < 1) {
                return { success: false, error: "Diagrama no encontrado" };
            }

            let query = `
            UPDATE user_diagrams
            SET name = $1,
                description = $2,
                template_data = $3,
                updated_at = CURRENT_TIMESTAMP
        `;
            let values = [input.name, input.description || null, input.template_data];

            if (preview_image) {
                query += `, preview_image = $4 WHERE template_id = $5 AND user_id = $6`;
                values.push(preview_image, diagramId, userId);
            } else {
                query += ` WHERE template_id = $4 AND user_id = $5`;
                values.push(diagramId, userId);
            }

            const { rowCount } = await pool.query(query, values);

            if (rowCount < 1) {
                return { success: false, error: "No se pudo actualizar el diagrama" };
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }


    static async setFavoriteStatus({ userId, diagramId, input }) {
        try {
            const { rowCount: exists } = await pool.query(
                `SELECT template_id FROM user_diagrams
                WHERE template_id = $1 AND user_id = $2 AND status = $3`,
                [
                    diagramId,
                    userId,
                    DiagramStatus.ACTIVE
                ]
            )

            if (exists < 1) {
                return { success: false, error: "Diagrama no encontrado o eliminado" }
            }

            const { rowCount } = await pool.query(
                `UPDATE user_diagrams 
                SET is_favorite = $1, updated_at = CURRENT_TIMESTAMP
                WHERE template_id = $2 AND user_id = $3`,
                [
                    input.is_favorite,
                    diagramId,
                    userId
                ]
            )

            if (rowCount < 1) {
                return { success: false, error: "No se pudo actualizar el estado de favorito" };
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async getUserFavoriteDiagrams({ userId }) {
        try {
            const { rows, rowCount } = await pool.query(
                `SELECT template_id, name, description, template_data, created_at, preview_image
                FROM user_diagrams
                WHERE user_id = $1 AND is_favorite = true
                ORDER BY updated_at DESC`,
                [ userId ]
            )

            if (rowCount < 1) {
                return { 
                    success: false, 
                    error: "Aún no ha marcado algún diagrama como favorito"
                }
            }

            const diagram = rows[0]

            // Convertir buffer a base64
            if (diagram.preview_image) {
                diagram.preview_image = `data:image/png;base64,${diagram.preview_image.toString('base64')}`
            }

            return { success: true, data: rows }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}