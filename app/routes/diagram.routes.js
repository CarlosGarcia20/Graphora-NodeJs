import { Router } from "express";
import { DiagramController } from "../controllers/diagram.controller.js";
import { verifyToken } from "../middlewares/tokenMiddleware.js";
import upload from '../middlewares/uploads.js' 

export const createDiagramsRouter = ({ diagramModel }) => {
    const diagramsRouter = Router();

    const diagramController = new DiagramController({ diagramModel })
    
    diagramsRouter.get('/templates', diagramController.getTemplates)
    
    diagramsRouter.get('/templates/:diagramId', diagramController.getTemplateById)
    
    diagramsRouter.post(
        '/templates', 
        upload.single('preview_image'),
        diagramController.create
    )
    
    diagramsRouter.put(
        '/templates/:diagramId', 
        upload.single('preview_image'),
        diagramController.update
    )
    
    diagramsRouter.delete('/templates/:diagramId', diagramController.delete)
    
    // Rutas para los diagramas del usuario
    diagramsRouter.get('/me', verifyToken, diagramController.getMyDiagrams)
    
    diagramsRouter.get('/me/favorites', verifyToken, diagramController.getUserFavoriteDiagrams)
    
    diagramsRouter.get('/me/trash', verifyToken, diagramController.getUserDiagramsInTrash)
    
    diagramsRouter.get('/me/:diagramId', verifyToken, diagramController.getMyDiagramById)
    
    diagramsRouter.post(
        '/me', 
        verifyToken,
        upload.single('preview_image'), 
        diagramController.createDiagramUser
    )
    
    diagramsRouter.put(
        '/me/:diagramId', 
        verifyToken, 
        upload.single('preview_image'),
        diagramController.updateDiagramUser
    )
    
    diagramsRouter.patch('/me/delete/:diagramId', verifyToken, diagramController.softDeleteDiagram)
    
    diagramsRouter.patch('/me/restore/:diagramId', verifyToken, diagramController.restoreDiagram)
    
    diagramsRouter.patch('/me/favorite/:diagramId', verifyToken, diagramController.setFavoriteStatus)
    
    diagramsRouter.delete('/me/:diagramId', verifyToken, diagramController.deleteDiagram)

    return diagramsRouter;
}


