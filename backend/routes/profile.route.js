import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js"
import { getProfile, updateProfile } from "../controllers/profile.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/:username", authMiddleware, getProfile);
// router.patch("/user_data", authMiddleware, updateUserData);
router.patch('/update', authMiddleware, upload.single('image'), updateProfile);

export default router;