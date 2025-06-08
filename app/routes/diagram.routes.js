import { Router } from "express";
import { DiagramController } from "../controllers/diagram.controller.js";
import { verifyToken } from "../middlewares/tokenMiddleware.js";


export const diagramsRouter = Router();

diagramsRouter.get('/templates', DiagramController.getTemplates)

diagramsRouter.get('/templates/:diagramId', DiagramController.getTemplateById)

diagramsRouter.post('/templates', DiagramController.create)

diagramsRouter.put('/templates/:diagramId', DiagramController.update)

diagramsRouter.delete('/templates/:diagramId', DiagramController.delete)

// Rutas para los diagramas del usuario
diagramsRouter.get('/me', verifyToken, DiagramController.getMyDiagrams)

diagramsRouter.get('/me/favorites', verifyToken, DiagramController.getUserFavoriteDiagrams)

diagramsRouter.get('/me/:diagramId', verifyToken, DiagramController.getMyDiagramById)

diagramsRouter.post('/me', verifyToken, DiagramController.createDiagramUser)

diagramsRouter.put('/me/:diagramId', verifyToken, DiagramController.updateDiagramUser)

diagramsRouter.patch('/me/delete/:diagramId', verifyToken, DiagramController.softDeleteDiagram)

diagramsRouter.patch('/me/restore/:diagramId', verifyToken, DiagramController.restoreDiagram)

diagramsRouter.patch('/me/favorite/:diagramId', verifyToken, DiagramController.setFavoriteStatus)

diagramsRouter.delete('/me/:diagramId', verifyToken, DiagramController.deleteDiagram)

