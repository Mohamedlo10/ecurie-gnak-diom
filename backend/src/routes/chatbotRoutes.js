// chatbotRoutes.js
import { Router } from "express";
import { chatSessionMiddleware } from "../middlewares/chatSessionMiddleware.js";
import { chatAboutSujet } from "../controllers/chatbotController.js";

const router = Router();

router.post("/chat/:idSujet", chatSessionMiddleware, chatAboutSujet);

export default router;
