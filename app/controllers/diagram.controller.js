import { validateCreateDiagram } from "../schemas/createDiagram.schema.js";
import { validateTemplate } from "../schemas/template.js";
import { validateUpdateTemplate } from "../schemas/updateTemplate.js";
import { catchAsync } from "../util/catchAsync.js";
import { CloudinaryHelper } from "../helpers/cloudinary.helper.js";

export class DiagramController {
    constructor({ diagramModel }) {
        this.diagramModel = diagramModel
    }

    getTemplates = catchAsync(async(req, res, next) => {
        const result = await this.diagramModel.getTemplates();

        if (result.rows.length === 0) {
            return res.status(200).json({ templates: [] });
        }

        return res.status(200).json({ templates: result.rows });
    })

    getTemplateById = catchAsync(async(req, res, next) => {
        const { diagramId } = req.params;
        const result = await this.diagramModel.getTemplateById({ diagramId })

        if (!result.success) {
            return res.status(404).json({ message: result.error });
        }

        return res.status(200).json({ diagram: result.data });
    })

    create = catchAsync(async(req, res, next) => {
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
            return res.status(400).json({ error: validation.error.flatten().fieldErrors });
        }

        let imageUrl = null;
        let imagePublicId = null;
        
        if (req.file) {
            const uploadResult = await CloudinaryHelper.uploadImageBuffer(req.file.buffer);
            imageUrl = uploadResult.url;
            imagePublicId = uploadResult.public_id;
        }

        const inputData = {
            ...validation.data, 
            preview_image: imageUrl
        };

        const result = await this.diagramModel.createTemplate(inputData)

        if (!result.success) {
            if (imagePublicId) {
                await CloudinaryHelper.deleteImage(imagePublicId);
            }
            return res.status(409).json({ message: result.error });
        }

        return res.status(201).json({ message: "Plantilla creada exitosamente" });
    })

    update = async(req, res, next) => {
        const { diagramId } = req.params;
        const rawBody = req.body;

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
            return res.status(400).json({ error: validation.error.flatten().fieldErrors })
        }

        const existingTemplate = await this.diagramModel.getTemplateById({ diagramId });
        if (!existingTemplate.success) {
            return res.status(404).json({ message: "Plantilla no encontrada" });
        }
        const oldImageUrl = existingTemplate.data.preview_image;

        let newImageUrl = null;
        let newImagePublicId = null;

        if (req.file) {
            const uploadResult = await CloudinaryHelper.uploadImageBuffer(req.file.buffer);
            newImageUrl = uploadResult.url;
            newImagePublicId = uploadResult.public_id;
        }

        const inputData = {
            ...validation.data,
            preview_image: newImageUrl
        };

        const result = await this.diagramModel.updateTemplate({
            diagramId,
            input: inputData
        })

        if (!result.success) {
            if (newImagePublicId) await CloudinaryHelper.deleteImage(newImagePublicId);
            return res.status(400).json({ error: result.error });
        }

        if (newImageUrl && oldImageUrl) {
            const oldPublicId = CloudinaryHelper.getPublicIdFromUrl(oldImageUrl);
            if (oldPublicId) await CloudinaryHelper.deleteImage(oldPublicId);
        }

        return res.status(200).json({ message: "Plantilla actualizada correctamente" })
    }

    delete = catchAsync(async(req, res) => {
        const { diagramId } = req.params

        const result = await this.diagramModel.deleteTemplate({ diagramId })

        if (!result.success) {
            return res.status(404).json({ error: result.error })
        }

        if (result.deletedImageUrl) {
            const publicId = CloudinaryHelper.getPublicIdFromUrl(result.deletedImageUrl);
            if (publicId) {
                await CloudinaryHelper.deleteImage(publicId);
            }
        }

        return res.status(200).json({ message: "Plantilla eliminada correctamente" })
    })

    /* 
    * Diagramas del usuario 
    * 
    */

    getMyDiagrams = catchAsync(async(req, res, next) => {
        const userId = req.user.userId
        const result = await this.diagramModel.getDiagramsByUser({ userId })

        if (!result.success) {
            return res.status(400).json({
                message: result.error
            })
        }
        
        return res.status(200).json({ diagrams: result.data })
    })
    
    getMyDiagramById = catchAsync(async(req, res, next) => {
        const userId = req.user.userId
        const { diagramId } = req.params
        
        const result = await this.diagramModel.getDiagramInfo({ userId, diagramId })

        if (!result.success) {
            return res.status(404).json({ message: result.error })
        }

        return res.status(200).json({ diagram: result.data })
    })

    softDeleteDiagram = catchAsync(async(req, res, next) => {
        const userId = req.user.userId
        const { diagramId } = req.params

        const result = await this.diagramModel.softDeleteDiagram({ userId, diagramId })

        if (!result.success) {
            return res.status(404).json({ message: result.error })
        }

        return res.status(200).json({ message: "Diagrama eliminado correctamente" })
    })

    restoreDiagram = catchAsync(async(req, res, next) => {
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
    })

    deleteDiagram = catchAsync(async(req, res, next) => {
        const userId = req.user.userId
        const { diagramId } = req.params

        const result = await this.diagramModel.deleteDiagram({ userId, diagramId })

        if (!result.success) {
            return res.status(404).json({ message: result.error })
        }

        return res.status(200).json({ message: "Diagrama eliminado correctamente" })
    })

    createDiagramUser = catchAsync(async(req, res, next) => {
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
    })

    updateDiagramUser = catchAsync(async(req, res, next) => {
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
    })

    setFavoriteStatus = catchAsync(async(req, res, next) => {
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
    })
    
    getUserFavoriteDiagrams = catchAsync(async(req, res, next) => {
        const userId = req.user.userId

        const result = await this.diagramModel.getUserFavoriteDiagrams({ userId })

        if (!result.success) {
            return res.status(404).json({ message: result.error })
        }

        return res.status(200).json({
            data: result.data
        })
    })

    getUserDiagramsInTrash = catchAsync(async(req, res, next) => {
        const userId = req.user.userId

        const result = await this.diagramModel.getUserDiagramsInTrash({ userId })

        if (!result.success) {
            return res.status(404).json({ message: result.error })
        }

        return res.status(200).json({
            data: result.data
        })
    })
}