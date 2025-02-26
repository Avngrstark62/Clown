import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js"
import { getUserData, updateUserData, getOtherUserData } from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/user_data", authMiddleware, getUserData);
router.patch("/user_data", authMiddleware, updateUserData);

router.get("/:username", authMiddleware, getOtherUserData);

export default router;