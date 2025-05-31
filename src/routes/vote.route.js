import { Router } from "express";
import VoteController from "../controllers/vote.controller.js";
import asyncHandler from "../middlewares/asyncHandle.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = Router();

router.post("/votes", checkAuth, asyncHandler(VoteController.createVote));
router.delete("/votes", checkAuth, asyncHandler(VoteController.deleteVote));

export default router;
