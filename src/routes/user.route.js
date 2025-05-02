import { Router } from "express";
import { validateCreateUser } from "../middlewares/validateCreateUser.js";
import { validatePatchUser } from "../middlewares/validatePatchUser.js";
import UserController from "../controllers/user.controller.js";
const router = Router();

router.get("/", UserController.renderHomePage);

router.get("/users", UserController.getAllUsers);

router.get("/users/:id", UserController.getUserById);

router.post("/users", validateCreateUser, UserController.postUser);

router.put("/users/:id", validateCreateUser, UserController.putUser);

router.patch("/users/:id", validatePatchUser, UserController.patchUser);

router.delete("/users/:id", UserController.deleteUser);

export default router;
