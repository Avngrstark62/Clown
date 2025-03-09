import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js"
import { createPost, deletePost, fetchUserPosts, likePost } from "../controllers/post.controller.js";
import upload from '../middlewares/upload.middleware.js'

const router = express.Router();

router.post('/create/post', authMiddleware, upload.single('image'), createPost);
router.get('/user-posts/:username', authMiddleware, fetchUserPosts);
router.post('/delete/post', authMiddleware, deletePost);
router.post('/like/post', authMiddleware, likePost);

export default router;