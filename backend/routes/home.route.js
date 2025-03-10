import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js"
import { fetchPosts } from "../controllers/home.controller.js";

const router = express.Router();

router.get('/posts', authMiddleware, fetchPosts);

export default router;