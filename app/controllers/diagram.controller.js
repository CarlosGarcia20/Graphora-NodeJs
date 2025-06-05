import { DiagramModel } from "../models/diagram.model.js";
import { validateCreateDiagram } from "../schemas/createDiagram.schema.js";
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

    // Diagramas del usuario
    static async getMyDiagrams(req, res) {
        try {
            const userId = req.user.userId
            const result = await DiagramModel.getDiagramsByUser({ userId })

            if (!result.success) {
                return res.status(400).json({
                    message: result.error
                })
            }
            
            return res.status(200).json({ diagrams: result.data })
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener los diagramas",
                error: error.message
            })
        }
    }
    
    static async getMyDiagramById(req, res) {
        try {
            const userId = req.user.userId
            const { diagramId } = req.params
            
            const result = await DiagramModel.getDiagramInfo({ userId, diagramId })

            if (!result.success) {
                return res.status(404).json({ message: result.error })
            }

            return res.status(200).json({ diagram: result.data })
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener los diagramas",
                error: error.message
            })
        }
    }

    static async softDeleteDiagram(req, res) {
        try {
            const userId = req.user.userId
            const { diagramId } = req.params

            const result = await DiagramModel.softDeleteDiagram({ userId, diagramId })

            if (!result.success) {
                return res.status(404).json({ message: result.error })
            }

            return res.status(200).json({ message: "Diagrama eliminado correctamente" })
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener los diagramas",
                error: error.message
            })
        }
    }

    static async restoreDiagram(req, res) {
        try {
            const userId = req.user.userId
            const { diagramId } = req.params

            const result = await DiagramModel.restoreDiagram({ userId, diagramId })

            if (!result.success) {
                return res.status(404).json({ message: result.error })
            }

            return res.status(200).json({ 
                message: "Diagrama restaurado correctamente",
                data: result.data 
            })
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener los diagramas",
                error: error.message
            })
        }
    }

    static async deleteDiagram(req, res) {
        try {
            const userId = req.user.userId
            const { diagramId } = req.params

            const result = await DiagramModel.deleteDiagram({ userId, diagramId })

            if (!result.success) {
                return res.status(404).json({ message: result.error })
            }

            return res.status(200).json({ message: "Diagrama eliminado correctamente" })
        } catch (error) {
            return res.status(500).json({
                message: "Error al obtener los diagramas",
                error: error.message
            })
        }
    }

    static async createDiagramUser(req, res) {
        try {
            const validation = validateCreateDiagram(req.body);

            if (!validation.success) {
                return res.status(400).json({ 
                    message: JSON.parse(validation.error.message)
                });
            }

            const userId = req.user.userId

            const result = await DiagramModel.createDiagramUser({
                userId,
                input: validation.data
            });

            if (!result.success) {
                return res.status(400).json({
                    message: result.error || "Error al guardar el diagrama"
                })
            }

            return res.status(201).json({
                message: "Diagrama guardado exitosamente"
            })
        } catch (error) {
            return res.status(500).json({ 
                message: "Internal Server Error", 
                error: error.message 
            });
        }
    }

    static async updateDiagramUser(req, res) {
        try {
            const validation = validateCreateDiagram(req.body);

            if (!validation.success) {
                return res.status(400).json({ 
                    message: JSON.parse(validation.error.message)
                });
            }

            const userId = req.user.userId

            const result = await DiagramModel.updateDiagramUser({
                userId,
                diagramId: req.params.diagramId,
                input: validation.data
            })

            if (!result.success) {
                return res.status(404).json({ 
                    message: result.error || "Error al actualizar el diagrama" 
                });
            }
            
            return res.status(200).json({ 
                message: "Diagrama actualizado correctamente" 
            });
        } catch (error) {
            return res.status(500).json({ 
                message: "Internal Server Error", 
                error: error.message 
            });
        }
    }
}