import { Router } from "express";
import { InvitationController } from "../controllers/invitation.controller.js";

export const invitationRouter = Router();

invitationRouter.post('/', InvitationController.sendInvitation)