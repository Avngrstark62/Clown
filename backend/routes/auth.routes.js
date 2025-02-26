import express from "express";
import { register, login, logout, user } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js"

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/user", authMiddleware, user);

export default router;