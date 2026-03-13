import { validateCreateDiagram } from "../schemas/createDiagram.schema.js";
import { validateTemplate } from "../schemas/template.js";
import { validateUpdateTemplate } from "../schemas/updateTemplate.js";

export class DiagramController {
    constructor({ diagramModel }) {
        this.diagramModel = diagramModel
    }

    getTemplates = async(req, res) => {
        try {
            const result = await this.diagramModel.getTemplates();

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

    getTemplateById = async(req, res) => {
        try {
            const { diagramId } = req.params;
            const result = await this.diagramModel.getTemplateById({ diagramId })

            if (!result.success) {
                return res.status(404).json({ 
                    message: result.error
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

    create = async(req, res) => {
        try {
            const rawBody = req.body

            if (typeof rawBody.template_data === 'string') {
                try {
                    rawBody.template_data = JSON.parse(rawBody.template_data)
                } catch (error) {
                    return res.status(400).json({
                        message: "template_data no es un JSON válido"
                    })
                }
            }

            const validation = validateTemplate(rawBody);
    
            if (!validation.success) {
                return res.status(400).json({ error: validation.error.issues })
            }

            const input = {
                ...validation.data, 
                preview_image: req.file?.buffer || null
            }
    
            const result = await this.diagramModel.createTemplate({ input })
    
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

    update = async(req, res) => {
        try {
            const { diagramId } = req.params;
            const rawBody = req.body;

            // Convertir template_data a objeto si viene como string
            if (typeof rawBody.template_data === 'string') {
                try {
                    rawBody.template_data = JSON.parse(rawBody.template_data);
                } catch (error) {
                    return res.status(400).json({
                        message: "template_data no es un JSON válido"
                    });
                }
            }

            const validation = validateUpdateTemplate(rawBody)

            if (!validation.success) {
                return res.status(400).json({ error: validation.error.issues })
            }

            // Inyectar la imagen si se envió
            const input = {
                ...validation.data,
                preview_image: req.file?.buffer || null
            };

            const result = await this.diagramModel.updateTemplate({
                diagramId,
                input
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

    delete = async(req, res) => {
        try {
            const { diagramId } = req.params
    
            const result = await this.diagramModel.deleteTemplate({ diagramId })
    
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
    getMyDiagrams = async(req, res) => {
        try {
            const userId = req.user.userId
            const result = await this.diagramModel.getDiagramsByUser({ userId })

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
    
    getMyDiagramById = async(req, res) => {
        try {
            const userId = req.user.userId
            const { diagramId } = req.params
            
            const result = await this.diagramModel.getDiagramInfo({ userId, diagramId })

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

    softDeleteDiagram = async(req, res) => {
        try {
            const userId = req.user.userId
            const { diagramId } = req.params

            const result = await this.diagramModel.softDeleteDiagram({ userId, diagramId })

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

    restoreDiagram = async(req, res) => {
        try {
            const userId = req.user.userId
            const { diagramId } = req.params

            const result = await this.diagramModel.restoreDiagram({ userId, diagramId })

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

    deleteDiagram = async(req, res) => {
        try {
            const userId = req.user.userId
            const { diagramId } = req.params

            const result = await this.diagramModel.deleteDiagram({ userId, diagramId })

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

    createDiagramUser = async(req, res) => {
        try {
            const rawBody = req.body

            if (typeof rawBody.template_data === 'string') {
                try {
                    rawBody.template_data = JSON.parse(rawBody.template_data)
                } catch (error) {
                    return res.status(400).json({
                        message: "template_data no es un JSON válido"
                    })
                }
            }

            const validation = validateCreateDiagram(rawBody);

            if (!validation.success) {
                return res.status(400).json({ 
                    message: JSON.parse(validation.error.message)
                });
            }

            const userId = req.user.userId
            const previewImage = req.file?.buffer || null

            const result = await this.diagramModel.createDiagramUser({
                userId,
                input: validation.data,
                previewImage
            });

            if (!result.success) {
                return res.status(400).json({
                    message: result.error || "Error al guardar el diagrama"
                })
            }

            return res.status(201).json({
                message: "Diagrama guardado exitosamente",
                diagramId: result.data
            })
        } catch (error) {
            return res.status(500).json({ 
                message: "Internal Server Error", 
                error: error.message 
            });
        }
    }

    updateDiagramUser = async(req, res) => {
        try {
            const rawBody = req.body

            if (typeof rawBody.template_data === 'string') {
                try {
                    rawBody.template_data = JSON.parse(rawBody.template_data)
                } catch (error) {
                    return res.status(400).json({
                        message: "template_data no es un JSON válido"
                    })
                }
            }

            const validation = validateCreateDiagram(rawBody);

            if (!validation.success) {
                return res.status(400).json({ 
                    message: JSON.parse(validation.error.message)
                });
            }

            const userId = req.user.userId
            const { diagramId } = req.params
            const previewImage = req.file?.buffer || null

            const result = await this.diagramModel.updateDiagramUser({
                userId,
                diagramId,
                input: validation.data,
                preview_image: previewImage
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

    setFavoriteStatus = async(req, res) => {
        try {
            const userId = req.user.userId
            const { diagramId } = req.params
            const input = req.body

            const result = await this.diagramModel.setFavoriteStatus({ userId, diagramId, input })

            if (!result.success) {
                return res.status(404).json({ message: result.error })
            }

            return res.status(200).json({ 
                message: input.is_favorite ? "Diagrama marcado como favorito" : "Diagrama removido de favoritos"
            })
        } catch (error) {
            return res.status(500).json({ 
                message: "Internal Server Error", 
                error: error.message 
            })
        }
    }
    
    getUserFavoriteDiagrams = async(req, res) => {
        try {
            const userId = req.user.userId

            const result = await this.diagramModel.getUserFavoriteDiagrams({ userId })

            if (!result.success) {
                return res.status(404).json({ message: result.error })
            }

            return res.status(200).json({
                data: result.data
            })
        } catch (error) {
            return res.status(500).json({ 
                message: "Internal Server Error", 
                error: error.message 
            })
        }
    }

    getUserDiagramsInTrash = async(req, res) => {
        try {
            const userId = req.user.userId

            const result = await this.diagramModel.getUserDiagramsInTrash({ userId })

            if (!result.success) {
                return res.status(404).json({ message: result.error })
            }

            return res.status(200).json({
                data: result.data
            })
        } catch (error) {
            return res.status(500).json({ 
                message: "Internal Server Error", 
                error: error.message 
            })
        }
    }
}