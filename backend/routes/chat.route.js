import express from "express";
import { getChatHistory } from "../controllers/chat.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/history/:recipientId", authMiddleware, getChatHistory);

export default router;