import { Router } from "express";
import { validateCreateUser } from "../middlewares/validateCreateUser.js";
import { validatePatchUser } from "../middlewares/validatePatchUser.js";
import {
  renderHomePage,
  getAllUsers,
  getUserById,
  postUser,
  putUser,
  patchUser,
  deleteUser,
} from "../controllers/user.controller.js";
const router = Router();

router.get("/", renderHomePage);

router.get("/users", getAllUsers);

router.get("/users/:id", getUserById);

router.post("/users", validateCreateUser, postUser);

router.put("/users/:id", validateCreateUser, putUser);

router.patch("/users/:id", validatePatchUser, patchUser);

router.delete("/users/:id", deleteUser);

export default router;
