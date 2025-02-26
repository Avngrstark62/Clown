import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js"
import { searchUsers } from "../controllers/search.controller.js";

const router = express.Router();

router.post("/users", authMiddleware, searchUsers);

export default router;