import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import checkAuth from "../middlewares/checkAuth.js";
const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/processNewToken", AuthController.processNewToken);
router.post("/logout", AuthController.logout);
router.get("/me",checkAuth, AuthController.getUserInfo);


export default router;
