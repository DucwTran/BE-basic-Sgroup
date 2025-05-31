import { Router } from "express";
import PollController from "../controllers/poll.controller.js";
import asyncHandler from "../middlewares/asyncHandle.js";
import checkAuth from "../middlewares/checkAuth.js";
import checkAdmin from "../middlewares/checkAdmin.js";
const router = Router();

router.post(
  "/polls",
  checkAuth,
  checkAdmin,
  asyncHandler(PollController.createPoll)
);

router.get("/polls", checkAuth, asyncHandler(PollController.getAllPolls));

router.get("/polls/:id", checkAuth, asyncHandler(PollController.getPollById));

router.post(
  "/polls/add-option/:pollId",
  checkAuth,
  checkAdmin,
  asyncHandler(PollController.addOption)
);

router.delete(
  "/polls/:pollId/options/:optionId",
  checkAuth,
  checkAdmin,
  asyncHandler(PollController.removeOption)
);

router.patch(
  "/polls/lock-poll/:pollId",
  checkAuth,
  checkAdmin,
  asyncHandler(PollController.lockPoll)
);
router.patch(
  "/polls/unlock-poll/:pollId",
  checkAuth,
  checkAdmin,
  asyncHandler(PollController.unlockPoll)
);

export default router;
