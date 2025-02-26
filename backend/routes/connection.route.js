import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js"
import { follow, getFollowersList, getFollowingList, unfollow } from "../controllers/connection.controller.js";

const router = express.Router();

router.post("/follow", authMiddleware, follow);
router.post("/unfollow", authMiddleware, unfollow);

router.get("/followers/:username", authMiddleware, getFollowersList);
router.get("/following/:username", authMiddleware, getFollowingList);

export default router;