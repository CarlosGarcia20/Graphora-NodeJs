import { Router } from "express";
import { DiagramController } from "../controllers/diagram.controller.js";


export const diagramsRouter = Router();

diagramsRouter.get('/templates', DiagramController.getTemplates)

diagramsRouter.get('/templates/:diagramId', DiagramController.getTemplateById)

diagramsRouter.post('/templates', DiagramController.create)

diagramsRouter.put('/templates/:diagramId', DiagramController.update)

diagramsRouter.delete('/templates/:diagramId', DiagramController.delete)