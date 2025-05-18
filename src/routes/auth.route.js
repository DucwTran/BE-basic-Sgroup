import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import asyncHandler from "../middlewares/asyncHandle.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = Router();

router.post("/register", asyncHandler(AuthController.register));
router.post("/login", asyncHandler(AuthController.login));
router.post("/processNewToken", asyncHandler(AuthController.processNewToken));
router.post("/logout",checkAuth, asyncHandler(AuthController.logout));
router.post("/forgot-password", asyncHandler(AuthController.forgotPassword));
router.post("/verify-otp", asyncHandler(AuthController.verifyOtp));



export default router;
