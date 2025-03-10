import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js"
import { createComment, createPost, deleteComment, deletePost, fetchPostAndComments, fetchUserPosts, likePost } from "../controllers/post.controller.js";
import upload from '../middlewares/upload.middleware.js'

const router = express.Router();

router.get('/user-posts/:username', authMiddleware, fetchUserPosts);
router.post('/create', authMiddleware, upload.single('image'), createPost);
router.post('/delete', authMiddleware, deletePost);
router.post('/like', authMiddleware, likePost);
router.get('/:postId', authMiddleware, fetchPostAndComments);
router.post('/comment/create', authMiddleware, createComment);
router.post('/comment/delete', authMiddleware, deleteComment);

export default router;