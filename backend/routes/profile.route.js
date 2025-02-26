import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js"
import { updateUserData, getUserData } from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/user_data/:username", authMiddleware, getUserData);
router.patch("/user_data", authMiddleware, updateUserData);

export default router;