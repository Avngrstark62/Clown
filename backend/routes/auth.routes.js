import express from "express";
import { register, login, logout, profile } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js"

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", authMiddleware, profile);

export default router;