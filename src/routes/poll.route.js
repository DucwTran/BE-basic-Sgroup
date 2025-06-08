import { Router } from "express";
import AuthValidator from "../middlewares/auth.middleware.js";
import Poll from "../models/poll.model.js";
import Vote from "../models/vote.model.js";
import User from "../models/user.model.js";
import PollService from "../services/poll.service.js";
import PollController from "../controllers/poll.controller.js";
import asyncHandler from "../middlewares/asyncHandle.js";

export default class PollRoute {
  constructor() {
    this.router = Router();
    this.authValidator = new AuthValidator();
    this.pollController = new PollController(new PollService(Poll, Vote, User));
    this.setupRoutes();
  }
  setupRoutes() {
    // [POST] add new poll (admin)
    this.router.post(
      "/",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.authValidator.checkAdmin),
      asyncHandler(this.pollController.createPoll)
    );

    // [GET] get all polls (admin & user)
    this.router.get(
      "/",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.pollController.getAllPolls)
    );

    // [GET] get poll by id (admin & user)
    this.router.get(
      "/:id",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.pollController.getPollById)
    );

    this.router.post(
      "/add-option/:pollId",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.authValidator.checkAdmin),
      asyncHandler(this.pollController.addOption)
    );

    this.router.delete(
      "/:pollId/options/:optionId",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.authValidator.checkAdmin),
      asyncHandler(this.pollController.removeOption)
    );

    this.router.put(
      "/lock-poll/:pollId",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.authValidator.checkAdmin),
      asyncHandler(this.pollController.lockPoll)
    );
    this.router.put(
      "/unlock-poll/:pollId",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.authValidator.checkAdmin),
      asyncHandler(this.pollController.unlockPoll)
    );
  }
  getRoute() {
    return this.router;
  }
}
