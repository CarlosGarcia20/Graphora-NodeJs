import { DiagramModel } from "../models/diagram.model.js";
import { validateTemplate } from "../schemas/template.js";
import { validateUpdateTemplate } from "../schemas/updateTemplate.js";

export class DiagramController {
    static async getTemplates(req, res) {
        try {
            const result = await DiagramModel.getTemplates();

            if (!result.success) {
                return res.status(500).json({ 
                    message: "Error al obtener las plantillas" ,
                    error: result.error
                });
            }

            if (result.data.length === 0) {
                return res.status(404).json({ message: "No se encontraron plantillas" });
            }

            return res.status(200).json({ templates: result.data });
        } catch (error) {
            return res.status(500).json({ 
                message: "Error interno del servidor", 
                error: error.message 
            });
        }
        
    }

    static async getTemplateById(req, res) {
        try {
            const { diagramId } = req.params;
            const result = await DiagramModel.getTemplateById({ diagramId })

            if (!result.success) {
                return res.status(404).json({ 
                    message: "Ocurrió un error",
                    error: result.error 
                })
            }

            if (!result.data) {
                return res.status(404).json({ message: "Diagrama no encontrado" });
            }

            return res.status(200).json({
                diagram: result.data
            });
        } catch (error) {
            return res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const validation = validateTemplate(req.body);
    
            if (!validation.success) {
                return res.status(400).json({ error: validation.error.issues })
            }
    
            const result = await DiagramModel.createTemplate({ input: validation.data })
    
            if (!result.success) {
                return res.status(400).json({
                    error: result.error || "Ocurrió un error al guardar la plantilla"
                })
            }
    
            return res.status(201).json({
                message: "Plantilla creada exitosamente",
            });
            
        } catch (error) {
            return res.status(500).json({ 
                message: "Error interno del servidor", 
                error: error.message 
            });   
        }
    }

    static async update(req, res) {
        try {
            const { diagramId } = req.params;
            const validation = validateUpdateTemplate(req.body)

            if (!validation.success) {
                return res.status(400).json({ error: validation.error.issues })
            }

            const result = await DiagramModel.updateTemplate({
                diagramId: diagramId,
                input: validation.data
            })

            if (!result.success) {
                return res.status(404).json({ error: result.error })
            }

            return res.status(200).json({ message: "Plantilla actualizada correctamente" })
        } catch (error) {
            return res.status(500).json({
                message: "Error interno del servidor",
                error: error.message
            })
        }
    }

    static async delete(req, res) {
        try {
            const { diagramId } = req.params
    
            const result = await DiagramModel.deleteTemplate({ diagramId })
    
            if (!result.success) {
                return res.status(404).json({ error: result.error })
            }
    
            return res.status(200).json({ message: "Plantilla eliminada correctamente" })
        } catch (error) {
            return res.status(500).json({
                message: "Error interno del servidor",
                error: error.message
            })
        }
    }
}