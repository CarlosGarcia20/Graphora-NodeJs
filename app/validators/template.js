import { validateTemplate } from "../schemas/template.js";
import pool from "../config/db.js";

export const validateTemplateWithCategory = async (input) => {
    const result = validateTemplate(input);
    if(!result.success) return result;

    const queryResult = await pool.query(
        `SELECT * FROM categories
        WHERE category_id = $1`,
        [result.data.category_id]
    )

    if (queryResult.rows.length === 0) {
        return {
            success: false,
            error: {
                issues: [{
                    path: ['category_id'],
                    message: 'La categoría no existe en la base de datos'
                }]
            }
        };
    }

     return result;
}