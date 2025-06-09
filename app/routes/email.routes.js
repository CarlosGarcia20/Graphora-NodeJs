import { Router } from "express";
import { EmailController } from "../controllers/email.controller.js";

export const emailRouter = Router();

emailRouter.post('/send', EmailController.sendEmail)