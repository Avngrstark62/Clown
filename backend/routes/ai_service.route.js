import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js"
import { generateCaption } from "../controllers/ai_service.controller.js";

const router = express.Router();

router.post("/generate_captions", authMiddleware, generateCaption);

export default router;