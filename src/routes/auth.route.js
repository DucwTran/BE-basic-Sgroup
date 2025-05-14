import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import asyncHandler from "../middlewares/asyncHandle.js";
const router = Router();

router.post("/register", asyncHandler(AuthController.register));
router.post("/login", asyncHandler(AuthController.login));
router.post("/processNewToken", asyncHandler(AuthController.processNewToken));
router.post("/logout", asyncHandler(AuthController.logout));


export default router;
