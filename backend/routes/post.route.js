import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js"
import { createPost, deletedPost, fetchUserPosts } from "../controllers/post.controller.js";
import upload from '../middlewares/upload.middleware.js'

const router = express.Router();

router.post('/create/post', authMiddleware, upload.single('image'), createPost);
router.get('/user-posts/:username', authMiddleware, fetchUserPosts);
router.post('/delete/post', authMiddleware, deletedPost);

export default router;