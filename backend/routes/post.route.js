import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js"
import { createPost, getAllPosts, viewPost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", authMiddleware, createPost);
router.get("/get_all", authMiddleware, getAllPosts);
router.get("/view/:postId", authMiddleware, viewPost);

export default router;