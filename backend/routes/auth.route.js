import express from "express";
import { login, logout, user, initiateRegister, verifyAndRegister, resendOTP } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js"

const router = express.Router();

// Updated registration routes
router.post("/register/initiate", initiateRegister);
router.post("/register/verify", verifyAndRegister);
router.post("/register/resend-otp", resendOTP);

// router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/user", authMiddleware, user);

export default router;